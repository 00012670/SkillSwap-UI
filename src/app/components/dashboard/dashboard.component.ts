import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userId: number | null = null;
  skills: any[] = [];
  public userProfiles: any = [];
  public username: string = "";
  public role!: string;

  constructor(
    private authService: AuthService,
    private userStore: UserStoreService,
    private profileService: ProfileService,
    private router: Router
    ) { }

  ngOnInit(): void {
   const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
    } else {
      console.error('Error: userId is null');
    }

    this.userStore.getUsernameFromStore().subscribe(val => {
      const usernameFromToken = this.authService.getUsernameFromToken();
      this.username = val || usernameFromToken;
      this.profileService.getAllProfiles().subscribe(profiles => {
        console.log(profiles);
        this.userProfiles = profiles.$values.filter((profile: Profile) => profile.username === this.username);
        if (this.userProfiles.length > 0) {
          this.skills = this.userProfiles[0].skills.$values;
        }
      });
    });
    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  logout() {
    this.authService.signOut();
  }
}
