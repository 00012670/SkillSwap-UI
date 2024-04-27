import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { TokenApiModel } from '../models/token-api.model';

// Defining the TokenInterceptor service
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  // Injecting necessary services in the constructor
  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private router: Router
  ) { }

  // Implementing the intercept method
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    // If token exists, clone the request and set the Authorization header
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }  // "Bearer "+myToken
      })
    }

    // Handle the request and catch any errors
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // If error status is 401, handle the Unauthorized error
            return this.handleUnAuthorizedError(request, next);
          }
        }
        // If any other error, throw it
        return throwError(() => err)
      })
    );
  }

  // Method to handle Unauthorized error
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokeApiModel = new TokenApiModel();
    tokeApiModel.accessToken = this.auth.getToken()!;
    tokeApiModel.refreshToken = this.auth.getRefreshToken()!;
    // Call the renewToken method from AuthService
    return this.auth.renewToken(tokeApiModel)
      .pipe(
        switchMap((data: TokenApiModel) => {
          // If successful, store the new tokens and clone the request with new Authorization header
          this.auth.storeRefreshToken(data.refreshToken);
          this.auth.storeToken(data.accessToken);
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${data.accessToken}` }  // "Bearer "+myToken
          })
          // Handle the request with the new token
          return next.handle(req);
        }),
        // If error, navigate to login and show error toast
        catchError((err) => {
          return throwError(() => {
            this.router.navigate(['login'])
            this.toast.error({ detail: "Warning", summary: "Token is expired, please Login again", duration: 5000 });
          })
        })
      )
  }
}
