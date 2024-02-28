import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile.model';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContent } from 'src/app/components/swap-modal/swap-modal.component';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review.model';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-swap-request',
  templateUrl: './swap-request.component.html',
  styleUrls: ['./swap-request.component.scss'],
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

  skillDetails: Skill = {
    skillId: 0,
    name: '',
    description: '',
    category: '',
    level: SkillLevel.Competent,
    prerequisity: '',
    userId: 0
  }

  levelOptions: SkillLevel[] = [
    SkillLevel.Foundational,
    SkillLevel.Competent,
    SkillLevel.Expert,
    SkillLevel.Master
  ];

  reviews: Review[] = [];

  newReview: Review = {
    reviewId: 0,
    fromUserId: this.authService.getUserId(),
    toUserId: 0,
    skillId: 0,
    requestId: 0,
    rating: 0,
    text: ''
  };


  editSkillForm!: FormGroup
  submited = false;
  imageUrl: SafeUrl | undefined;
  loggedInUserId: number | null = null;

  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private profileService: ProfileService,
    private authService: AuthService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private reviewService: ReviewService,
    private toast: NgToastService,
  ) { }

  @ViewChild('content') addview !: ElementRef;


  ngOnInit(): void {
    this.loggedInUserId = this.authService.getUserId();

    this.route.paramMap.subscribe(params => {
      const skillId = Number(params.get('id'));

      if (skillId) {
        this.skillService.getSkillAndUserById(skillId).subscribe(data => {
          this.skillDetails = data;
          this.fetchUserProfile(this.skillDetails.userId);
          this.cd.detectChanges();
        });
      }
    });

    this.reviewService.getReviewsByUserId(this.authService.getUserId()).subscribe(reviews => {
      this.reviews = reviews;
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

  open() {
    const modalRef = this.modalService.open(ModalContent);
    modalRef.componentInstance.skillRequestedId = this.skillDetails.skillId;
    modalRef.componentInstance.receiverId = this.userProfile.userId;
  }

  isOwnSkill(): boolean {
    return this.skillDetails.userId === Number(this.loggedInUserId);
  }


  //Review Section

  submitReview(skillId: number, toUserId: number, rating: number, text: string): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.skillService.getSKillbyId(skillId).subscribe((skill: Skill) => {
        this.profileService.getProfileById(userId).subscribe((fromUser: Profile) => {
          this.profileService.getProfileById(toUserId).subscribe((toUser: Profile) => {
            const review: Review = {
              reviewId: 0,
              fromUserId: userId,
              toUserId: toUserId,
              skillId: skillId,
              requestId: 0,
              rating: rating,
              text: text
            };
            this.reviewService.createReview(review).subscribe(
              (response) => {
                this.toast.success({ detail: "SUCCESS", summary: "Review created successfully", duration: 3000 });
              }, error => {
                console.error('Error creating review:', error);
                this.toast.error({ detail: "ERROR", summary: 'Error creating review', duration: 4000 });
              });
          });
        });
      });
    }
  }

}

