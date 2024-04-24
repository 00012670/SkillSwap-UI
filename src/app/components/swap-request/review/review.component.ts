import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { Profile } from 'src/app/models/profile.model';
import { Review } from 'src/app/models/review.model';
import { GetSwapRequest } from 'src/app/models/request.model';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skill.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ReviewService } from 'src/app/services/review.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  userProfile: Profile = { userId: 0, username: '', email: '', password: '', fullName: '', bio: '', skillInterested: '', token: '', role: '', skills: [], unreadMessageCount: 0};
  skillDetails: Skill = { skillId: 0, name: '', description: '', category: '', level: SkillLevel.Competent, prerequisity: '', userId: 0 }
  newReview: Review = { reviewId: 0, fromUserId: this.authService.getUserId(), fromUserName: '', toUserId: 0, skillId: 0, requestId: 0, rating: 0, text: '' };
  username: string | undefined;
  submited = false;
  loggedInUserId: number | null = null;
  acceptedSwapRequests: GetSwapRequest[] = [];
  reviews: Review[] = [];
  isSubmittingReview = false;
  averageRating: number = 0;
  reviewSubmitted = false;

  @ViewChild('content') addview !: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private profileService: ProfileService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private toast: NgToastService,
    private requestService: RequestService,
  ) { }

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getUserId();
    this.getAcceptedSwapRequests();
    this.getSkillAndUser();
    this.getUsername();
  }

  getAcceptedSwapRequests(): void {
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
  }

  getSkillAndUser(): void {
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
  }

  getUsername(): void {
    this.profileService.getUsername(this.loggedInUserId || 0).subscribe(username => {
      this.username = username;
    });
  }

  fetchUserProfile(userId: number): void {
    this.profileService.getProfileById(userId).subscribe(profile => {
      this.userProfile = profile;
      this.getReviews();
    });
  }

  getReviews(): void {
    this.reviewService.getReviewsByUserIdAndSkillId(this.userProfile.userId, this.skillDetails.skillId).subscribe(reviews => {
      this.reviews = reviews;
      this.calculateAverageRating();
    });
  }


  isOwnSkill(): boolean {
    return this.skillDetails.userId === Number(this.loggedInUserId);
  }

  hasAcceptedSwapRequest(userId: number): boolean {
    return this.acceptedSwapRequests.some(request => request.initiatorId === userId || request.receiverId === userId);
  }

  onSwapRequestAccepted(request: GetSwapRequest): void {
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
          this.createReview(review);
        }
      });
    }
  }

  createReview(review: Review): void {
    this.reviewService.createReview(review).subscribe({
      next: (response) => {
        this.isSubmittingReview = false;
        this.reviewSubmitted = true;
        this.toast.success({ detail: "SUCCESS", summary: "Review created successfully", duration: 3000 });
        this.reviews.push(response);
        this.calculateAverageRating();
      },
      error: (error) => {
        this.isSubmittingReview = false;
        if (error.status === 400) {
          this.toast.error({ detail: "ERROR", summary: error.error.message, duration: 4000 });
        } else {
          this.toast.error({ detail: "ERROR", summary: 'An unexpected error occurred', duration: 4000 });
        }
        this.toast.error({ detail: "ERROR", summary: error.error.message, duration: 4000 });
      }
    });
  }

}
