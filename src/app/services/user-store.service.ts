import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private userName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");

  constructor() { }

    public getRoleFromStore(){
      return this.role$.asObservable();
    }

    public setRoleForStore(role:string){
      this.role$.next(role);
    }

    public getUsernameFromStore(){
      return this.userName$.asObservable();
    }

    public setUsernameForStore(fullname:string){
      this.userName$.next(fullname)
    }
}
