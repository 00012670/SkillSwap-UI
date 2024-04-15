import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skill.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile.model';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContent } from 'src/app/components/swap-request/swap-modal/swap-modal.component';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review.model';
import { NgToastService } from 'ng-angular-popup';
import { GetSwapRequest } from 'src/app/models/request.model';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';
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

  newReview: Review = {
    reviewId: 0,
    fromUserId: this.authService.getUserId(),
    fromUserName: '',
    toUserId: 0,
    skillId: 0,
    requestId: 0,
    rating: 0,
    text: ''
  };

  username: string | undefined;
  editSkillForm!: FormGroup
  submited = false;
  imageUrl: SafeUrl | undefined;
  loggedInUserId: number | null = null;
  acceptedSwapRequests: GetSwapRequest[] = [];
  reviews: Review[] = [];

  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  isSubmittingReview = false;
  averageRating: number = 0;

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
    private requestService: RequestService,
    private router: Router
  ) { }

  @ViewChild('content') addview !: ElementRef;


  ngOnInit(): void {
    this.loggedInUserId = this.authService.getUserId();

    this.requestService.getAcceptedSwapRequests(this.loggedInUserId || 0).subscribe(
      (requests) => {
        this.acceptedSwapRequests = requests;
        if (this.acceptedSwapRequests.length > 0) {
          this.newReview.requestId = this.acceptedSwapRequests[this.acceptedSwapRequests.length - 1].requestId;
        }
      },
      (error) => {
        console.error('Failed to get accepted swap requests', error);
      }
    );

    this.route.paramMap.subscribe(params => {
      const skillId = Number(params.get('id'));

      if (skillId) {
        this.skillService.getSkillAndUserById(skillId).subscribe(data => {
          this.skillDetails = data;
          this.fetchUserProfile(this.skillDetails.userId);
          this.newReview.skillId = this.skillDetails.skillId;
          this.newReview.toUserId = this.skillDetails.userId;
        });
      }
    });

    this.profileService.getUsername(this.loggedInUserId || 0).subscribe(username => {
      this.username = username;
    });
  }


  fetchUserProfile(userId: number): void {
    this.profileService.getProfileById(userId).subscribe(profile => {
      this.userProfile = profile;
      if (this.userProfile.hasImage) {
        this.getImageByUserId(this.userProfile.userId);
      }
      this.reviewService.getReviewsByUserIdAndSkillId(this.userProfile.userId, this.skillDetails.skillId).subscribe(reviews => {
        this.reviews = reviews;
        this.calculateAverageRating();
      });
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


  isOwnSkill(): boolean {
    return this.skillDetails.userId === Number(this.loggedInUserId);
  }


  hasAcceptedSwapRequest(userId: number): boolean {
    return this.acceptedSwapRequests.some(request => request.initiatorId === userId || request.receiverId === userId);
  }


  onSwapRequestAccepted(request: GetSwapRequest) {
    this.newReview.requestId = request.requestId;
    this.newReview.toUserId = request.receiverId;
    this.newReview.skillId = request.skillRequestedId;
    this.submitReview();
  }


  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = Math.round((totalRating / this.reviews.length) * 2) / 2;
    }
  }

  reviewSubmitted = false;

  submitReview(): void {
    if (this.isSubmittingReview) {
      return;
    }
    this.isSubmittingReview = true;
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.profileService.getUsername(userId).subscribe(username => {
        if (this.acceptedSwapRequests.some(request => request.requestId === this.newReview.requestId)) {
          const review: Review = {
            fromUserId: userId,
            fromUserName: username,
            toUserId: this.newReview.toUserId,
            skillId: this.newReview.skillId,
            requestId: this.newReview.requestId,
            rating: this.newReview.rating,
            text: this.newReview.text,
            reviewId: 0
          };
          this.reviewService.createReview(review).
            subscribe({
              next: (response) => {
                this.isSubmittingReview = false;
                this.reviewSubmitted = true; // Set the flag to true
                this.toast.success({ detail: "SUCCESS", summary: "Review created successfully", duration: 3000 });
                this.reviews.push(response);
                this.calculateAverageRating();
              },
              error: (error) => {
                this.isSubmittingReview = false;
                console.error('Error creating review:', error);
                if (error.status === 400) {
                  this.toast.error({ detail: "ERROR", summary: error.error.message, duration: 4000 });
                } else {
                  this.toast.error({ detail: "ERROR", summary: 'An unexpected error occurred', duration: 4000 });
                }
                this.toast.error({ detail: "ERROR", summary: error.error.message, duration: 4000 });
              }
            });
        }
      });
    }
  }

  navigateToChat(userId: number) {
    this.router.navigate(['/chat', userId]);
  }
}

