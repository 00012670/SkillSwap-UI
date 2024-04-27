import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skill.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { SearchService } from 'src/app/services/search.service';

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
  skillList: any[] = [];
  userId: number | null = null;


  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private profileService: ProfileService,
    private skillsService: SkillsService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.getUsername();
    this.getSearchText();
  }

  getSearchText(): void {
    this.searchService.currentSearchText.subscribe(searchText => this.searchText = searchText);
  }

  getUsername(): void {
    this.userStore.getUsernameFromStore().subscribe(val => {
      this.username = val || this.auth.getUsernameFromToken();
      this.getProfiles();
    });
  }

  getProfiles(): void {
    this.profileService.getAllProfiles().subscribe(profiles => {
      this.userProfiles = profiles.filter((profile: Profile) => profile.username === this.username);
      if (this.userProfiles.length > 0) {
        this.userId = this.userProfiles[0].userId;
        this.role = this.auth.getRoleFromToken();
        this.getSkills();
      }
    });
  }

  getSkills(): void {
    if (this.role === 'Admin') {
      this.skillsService.getAllSkills().subscribe(skills => {
        this.skillList = skills;
      });
    } else if (this.role === 'User' && this.userId !== null) {
      this.skillsService.getSkillsByUserId(this.userId).subscribe(skills => {
        this.skillList = skills;
      });
    }
  }

  getLevel(level: SkillLevel): string {
    const levels = {
      [SkillLevel.Foundational]: 'Foundational',
      [SkillLevel.Competent]: 'Competent',
      [SkillLevel.Expert]: 'Expert',
      [SkillLevel.Master]: 'Master'
    };
    return levels[level] || '';
  }
}

