import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userId: number | null = null;
  skills: any[] = [];
  userProfiles: any = [];
  username: string = "";
  role!: string;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private userStore: UserStoreService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
    } else {
     // console.error('Error: userId is null');
    }

    this.userStore.getUsernameFromStore().pipe(
      switchMap(val => {
        const usernameFromToken = this.authService.getUsernameFromToken();
        this.username = val || usernameFromToken;
        return this.profileService.getAllProfiles();
      })
    ).subscribe(profiles => {
      this.userProfiles = profiles.$values.filter((profile: Profile) => profile.username === this.username);
      if (this.userProfiles.length > 0) {
        this.skills = this.userProfiles[0].skills.$values;
      }
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
