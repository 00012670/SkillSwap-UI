import { Component } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent {
  userId: any;
  role: string = '';
  userProfiles: Profile[] = [];
  username: string = "";

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private userStore: UserStoreService,
  ) { }

  ngOnInit(): void {
    this.userStore.getUsernameFromStore().subscribe(val => {
      const usernameFromToken = this.auth.getUsernameFromToken();
      this.username = val || usernameFromToken;
      this.profileService.getAllProfiles().subscribe(profiles => {
        this.userProfiles = profiles.filter((profile: Profile) => profile.username === this.username);
        if (this.userProfiles.length > 0) {
          this.userId = this.userProfiles[0].userId;
        }
      });
    });
  }
}
