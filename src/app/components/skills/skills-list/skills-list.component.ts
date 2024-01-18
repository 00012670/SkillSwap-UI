import { Component, OnInit } from '@angular/core';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SkillsService } from 'src/app/services/skills.service';
import { UserStoreService } from 'src/app/services/user-store.service';
@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillsListComponent implements OnInit {

  skills: Skill[] = [];
  searchText: any;

  public userProfiles: any = [];
  public username: string = "";
  public role!:string;


  constructor(
    private skillsService: SkillsService,
    private imageService: ImageService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private profileService: ProfileService
    ) {}

  ngOnInit(): void {
    this.skillsService.getAllSkills()
    .subscribe({
      next: (skills) => {
        this.skills = skills;
      },
      error: (response) => {
        console.log(response);
      }
    });

    this.userStore.getUsernameFromStore().subscribe(val => {
      const usernameFromToken = this.auth.getUsernameFromToken();
      this.username = val || usernameFromToken;
      this.profileService.getAllProfiles().subscribe(profiles => {
        this.userProfiles = profiles.filter(profile => profile.username === this.username);
      });
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });

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

