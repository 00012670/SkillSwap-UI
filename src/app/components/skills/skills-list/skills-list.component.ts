import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillsListComponent implements OnInit {

  searchText: any;
  userProfiles: any = [];
  username: string = "";
  role!: string;
  skillList : any[] = [];


  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {

    this.userStore.getUsernameFromStore().subscribe(val => {
      const usernameFromToken = this.auth.getUsernameFromToken();
      this.username = val || usernameFromToken;
      this.profileService.getAllProfiles().subscribe(profiles => {
        this.userProfiles = profiles.$values.filter((profile: Profile) => profile.username === this.username);
        this.getSkills();
      });
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  getSkills(): void {
    if(this.userProfiles.length > 0) {
      this.skillList = this.userProfiles[0].skills.$values;
    }
  }

  getLevel(level: SkillLevel): string {
    switch (level) {
      case SkillLevel.Foundational:
        return 'Foundational';
      case SkillLevel.Competent:
        return 'Competent';
      case SkillLevel.Expert:
        return 'Expert';
      case SkillLevel.Master:
        return 'Master';
      default:
        return '';
    }
  }

  logout() {
    this.auth.signOut();
  }
}

