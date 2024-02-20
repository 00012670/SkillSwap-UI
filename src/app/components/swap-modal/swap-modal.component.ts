import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app//services/skills.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Skill } from 'src/app/models/skill.model';
import { RequestService } from 'src/app/services/request.service';
import { SwapRequest, User } from 'src/app/models/request.model';
import { Profile } from 'src/app/models/profile.model';


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
    private requestService: RequestService

  ) { }

  ngOnInit() {
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
      this.skillsService.getSKillbyId(skillId).subscribe((skill: Skill) => {
        this.profileService.getProfileById(userId).subscribe((initiator: Profile) => {
          this.profileService.getProfileById(this.receiverId as number).subscribe((receiver: Profile) => {
            this.skillsService.getSKillbyId(this.skillRequestedId as number).subscribe((requestedSkill: Skill) => {
              const request: SwapRequest = {
                requestId: 0,
                initiatorId: userId,
                receiverId: this.receiverId as number,
                skillOfferedId: skillId,
                skillRequestedId: this.skillRequestedId as number,
                statusRequest: 0,
                details: details
              };
              this.requestService.createSwapRequest(request).subscribe(
                () => {},
                error => {
                  console.error('Error creating swap request:', error);
                }
              );
            });
          });
        });
      });
    }
  }


 }





