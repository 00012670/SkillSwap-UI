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
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    //     // this.start.load();
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }  // "Bearer "+myToken
      })
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.toast.warning({ detail: "Warning", summary: "Token is expired, Please Login again" });
            this.router.navigate(['login']);
          }
          // Log the actual error for debugging
          console.error('HTTP error occurred:', err);
          // Return the specific error message from the server if available
          return throwError(() => err.error?.message || 'Some other error occurred');
        }
        // If it's not an HttpErrorResponse, return a generic error message
        return throwError(() => 'Some other error occurred');
      })
    );
  }
}





