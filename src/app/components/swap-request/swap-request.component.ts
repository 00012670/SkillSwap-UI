import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { Profile } from 'src/app/models/profile.model';
import { Review } from 'src/app/models/review.model';
import { GetSwapRequest } from 'src/app/models/request.model';
import { FormGroup } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContent } from 'src/app/components/swap-request/swap-modal/swap-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skill.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ImageService } from 'src/app/services/image.service';
import { SkillImageService } from 'src/app/services/skill-image.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-swap-request',
  templateUrl: './swap-request.component.html',
  styleUrls: ['./swap-request.component.scss'],
})
export class SwapRequestComponent {
  userProfile: Profile = { userId: 0, username: '', email: '', password: '', fullName: '', bio: '', skillInterested: '', token: '', role: '', skills: [], unreadMessageCount: 0 };
  skillDetails: Skill = { skillId: 0, name: '', description: '', category: '', level: SkillLevel.Competent, prerequisity: '', userId: 0 }
  levelOptions: SkillLevel[] = [SkillLevel.Foundational, SkillLevel.Competent, SkillLevel.Expert, SkillLevel.Master];
  newReview: Review = { reviewId: 0, fromUserId: this.authService.getUserId(), fromUserName: '', toUserId: 0, skillId: 0, requestId: 0, rating: 0, text: '' };
  username: string | undefined;
  editSkillForm!: FormGroup;
  submited = false;
  imageUrl: SafeUrl | undefined;
  imageSkillUrl: SafeUrl | undefined;
  loggedInUserId: number | null = null;
  acceptedSwapRequests: GetSwapRequest[] = [];
  reviews: Review[] = [];
  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  @ViewChild('content') addview !: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private profileService: ProfileService,
    private authService: AuthService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private router: Router,
    private skillImageService: SkillImageService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getUserId();
    this.getSkillAndUser();
  }

  getSkillAndUser(): void {
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
      if (this.userProfile.hasImage) {
        this.getImageByUserId(this.userProfile.userId);
      }
      if(this.skillDetails.hasImage) {
        this.getImageBySkillId(this.skillDetails.skillId);
      }
    });
  }

  getImageBySkillId(skillId: number) {
    this.skillImageService.getImageBySkillId(skillId).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        const blobUrl = URL.createObjectURL(blob);
        this.imageSkillUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        this.isImageUploaded = true;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          console.error('Failed to get image', error);
        }
      }
    });
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
    } else {
      this.imageUrl = undefined;
    }
  }

  open(): void {
    const modalRef = this.modalService.open(ModalContent);
    modalRef.componentInstance.skillRequestedId = this.skillDetails.skillId;
    modalRef.componentInstance.receiverId = this.userProfile.userId;
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

  isOwnSkill(): boolean {
    return this.skillDetails.userId === Number(this.loggedInUserId);
  }

  navigateToChat(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }
}
