import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skill.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Skill } from 'src/app/models/skill.model';
import { RequestService } from 'src/app/services/request.service';
import { CreateSwapRequest } from 'src/app/models/request.model';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-swap-modal',
  templateUrl: './swap-modal.component.html',
  styleUrls: ['./swap-modal.component.scss']
})

export class ModalContent {

  @Input() skillRequestedId: number | null = null;
  @Input() receiverId: number | null = null;;


  userSkills: Skill[] = [];
  userId: number | null = null;
  skillList: any[] = [];
  selectedSkillId: number | null = null;
  details: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private skillsService: SkillsService,
    private authService: AuthService,
    private profileService: ProfileService,
    private requestService: RequestService,
    private toast: NgToastService,
  ) { }

  ngOnInit() {
    this.getUserIdAndFetchSkills();
  }

  getUserIdAndFetchSkills(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
      this.getSkills();
    }
  }

  getSkills(): void {
    if (this.userId !== null) {
      this.skillsService.getSkillsByUserId(this.userId).subscribe(skills => {
        this.skillList = skills;
      });
    }
  }

  sendRequest(skillId: number, details: string): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      forkJoin({
        skill: this.skillsService.getSKillbyId(skillId),
        initiator: this.profileService.getProfileById(userId),
        receiver: this.profileService.getProfileById(this.receiverId as number),
        requestedSkill: this.skillsService.getSKillbyId(this.skillRequestedId as number)
      }).subscribe(({ }) => {
        const request: CreateSwapRequest = {
          requestId: 0,
          initiatorId: userId,
          receiverId: this.receiverId as number,
          skillOfferedId: skillId,
          skillRequestedId: this.skillRequestedId as number,
          statusRequest: 0,
          details: details
        };
        this.createSwapRequest(request);
      });
    }
  }

  createSwapRequest(request: CreateSwapRequest): void {
    this.requestService.createSwapRequest(request).subscribe(
      (response) => {
        this.toast.success({ detail: "SUCCESS", summary: "Swap request created successfully", duration: 3000 });
        this.activeModal.close('Close click');
        window.location.reload();
      },
      error => {
        console.error('Error creating swap request:', error);
        this.toast.error({ detail: "ERROR", summary: 'Error creating swap request', duration: 4000 });
      }
    );
  }
}





