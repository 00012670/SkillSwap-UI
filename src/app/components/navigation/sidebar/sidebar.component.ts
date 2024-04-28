import { Component } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  userId: number | null = null;
  role: string = '';
  userProfiles: Profile[] = [];
  username: string = "";

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private userStore: UserStoreService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.userStore.getUsernameFromStore().pipe(
      switchMap(val => {
        const usernameFromToken = this.auth.getUsernameFromToken();
        this.username = val || usernameFromToken;
        return this.profileService.getAllProfiles().pipe(
          catchError(error => {
            console.error('Error fetching profiles', error);
            return of([]);
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching username', error);
        return of([]);
      })
    ).subscribe(profiles => {
      this.userProfiles = profiles.filter((profile: Profile) => profile.username === this.username);
      if (this.userProfiles.length > 0) {
        this.userId = this.userProfiles[0].userId;
        this.role = this.auth.getRoleFromToken();
      }
    });
  }

}
