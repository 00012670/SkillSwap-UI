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

@Component({
  selector: 'app-swap-request',
  templateUrl: './swap-request.component.html',
  styleUrls: ['./swap-request.component.scss'],
})
export class SwapRequestComponent {
  userProfile: Profile = { userId: 0, username: '', email: '', password: '', fullName: '', bio: '', skillInterested: '', token: '', role: '', skills: [] };
  skillDetails: Skill = { skillId: 0, name: '', description: '', category: '', level: SkillLevel.Competent, prerequisity: '', userId: 0 }
  levelOptions: SkillLevel[] = [SkillLevel.Foundational, SkillLevel.Competent, SkillLevel.Expert, SkillLevel.Master];
  newReview: Review = { reviewId: 0, fromUserId: this.authService.getUserId(), fromUserName: '', toUserId: 0, skillId: 0, requestId: 0, rating: 0, text: '' };
  username: string | undefined;
  editSkillForm!: FormGroup;
  submited = false;
  imageUrl: SafeUrl | undefined;
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
    private router: Router
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

  getSkillLevelString(level: SkillLevel): string {
    switch (level) {
      case SkillLevel.Foundational: return 'Foundational';
      case SkillLevel.Competent: return 'Competent';
      case SkillLevel.Expert: return 'Expert';
      case SkillLevel.Master: return 'Master';
      default: return '';
    }
  }

  isOwnSkill(): boolean {
    return this.skillDetails.userId === Number(this.loggedInUserId);
  }

  navigateToChat(userId: number): void {
    this.router.navigate(['/chat', userId]);
  }
}
