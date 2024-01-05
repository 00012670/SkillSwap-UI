import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public users: any = [];
  constructor(
    private api: ApiService,
    private auth: AuthService,
   // private userStore: UserStoreService

    ) { }

  ngOnInit() {
    this.api.getUsers()
      .subscribe(res => {
        this.users = res;
      });
  }

  logout() {
    this.auth.signOut();
  }
}


//   public role!:string;

//   public fullName : string = "";
//   constructor(private api : ApiService, private auth: AuthService, private userStore: UserStoreService) { }



//     this.userStore.getFullNameFromStore()
//     .subscribe(val=>{
//       const fullNameFromToken = this.auth.getfullNameFromToken();
//       this.fullName = val || fullNameFromToken
//     });

//     this.userStore.getRoleFromStore()
//     .subscribe(val=>{
//       const roleFromToken = this.auth.getRoleFromToken();
//       this.role = val || roleFromToken;
//     })
//   }

