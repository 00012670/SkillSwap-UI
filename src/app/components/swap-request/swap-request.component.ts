import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-swap-request',
  templateUrl: './swap-request.component.html',
  styleUrls: ['./swap-request.component.scss']
})

export class SwapRequestComponent {

  userProfile: Profile = {
    userId: 0,
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
    skillInterested: '',
    token: '',
    role: '',
    skills: []
  };

  levelOptions: SkillLevel[] = [
    SkillLevel.Foundational,
    SkillLevel.Competent,
    SkillLevel.Expert,
    SkillLevel.Master
  ];


  skillDetails: Skill = {
    skillId: 0,
    name: '',
    description: '',
    category: '',
    level: SkillLevel.Competent,
    prerequisity: '',
    userId: 0
  }

  editSkillForm!: FormGroup
  submited = false;
  imageUrl: SafeUrl | undefined;
  //userProfile: any;
  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private profileService: ProfileService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const skillId = Number(params.get('id'));

      if (skillId) {
        this.skillService.getSkillAndUserById(skillId).subscribe(data => {
          this.skillDetails = data;
          this.fetchUserProfile(this.skillDetails.userId);
        });
      }
    });
  }

  fetchUserProfile(userId: number): void {
    this.profileService.getProfileById(userId).subscribe(profile => {
      this.userProfile = profile;
      this.getImageByUserId(this.userProfile.userId);
    });
  }

  getSkillLevelString(level: SkillLevel): string {
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

  getImageByUserId(userId: number): void {
    if (!this.isImageDeleted) {
      this.imageService.getImageByUserId(userId).subscribe(
        (response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/jpeg' });
          const blobUrl = URL.createObjectURL(blob);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        } 
      );
    }
    else {
      this.imageUrl = undefined;
    }
  }
}



