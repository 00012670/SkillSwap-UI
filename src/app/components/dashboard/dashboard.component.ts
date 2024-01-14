import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  public users: any = [];
  public username: string = "";
  public role!:string;
  profile: any;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private profileService: ProfileService,
    private route: ActivatedRoute


  ) { }

  ngOnInit() {
    this.api.getUsers()
      .subscribe(res => {
        this.users = res;
      });

    this.userStore.getUsernameFromStore()
      .subscribe(val => {
        const UsernameFromToken = this.auth.getUsernameFromToken();
        this.username = val || UsernameFromToken
      });
    this.userStore.getRoleFromStore()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToken();
        this.role = val || roleFromToken;
      })
      this.route.params.subscribe(params => {
        const userId = params['id'];
        if (userId) {
          // Generate the URL with the userId parameter
          this.profileService.getProfileById(userId)
            .subscribe(profile => {
              this.profile = profile;
            });
        }
      });
  }

  //   public fullName : string = "";
//   constructor(private api : ApiService, private auth: AuthService, private userStore: UserStoreService) { }


  logout() {
    this.auth.signOut();
  }
}
