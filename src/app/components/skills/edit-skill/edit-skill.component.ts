import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';


@Component({
  selector: 'app-edit-skill',
  templateUrl: './edit-skill.component.html',
  styleUrls: ['./edit-skill.component.scss']
})

export class EditSkillComponent {

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

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private requestService: RequestService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.editSkillForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      level: ['', Validators.required],
      prerequisity: ['', Validators.required],
    });
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.skillService.getSKillbyId(+id)
          .subscribe({
            next: (response) => {
              this.skillDetails = response;
              this.editSkillForm.patchValue(this.skillDetails);
            }
          })
        }
      }
    });
  }

  updateSkill() {
    this.submited = true;
    if (this.editSkillForm.invalid) {
      return
    }

    const requestBody = {
      skillId: this.skillDetails.skillId,
      userId: this.skillDetails.userId,
      name: this.editSkillForm.get('name')?.value,
      description: this.editSkillForm.get('description')?.value,
      category: this.editSkillForm.get('category')?.value,
      level: +this.editSkillForm.get('level')?.value,
      prerequisity: this.editSkillForm.get('prerequisity')?.value
    };

    this.skillService.updateSkill(this.skillDetails.skillId, requestBody)
      .subscribe({
        next: (response) => {
          this.router.navigate(['skills'])
        },
        error: (error) => {
          console.error('Error adding skill:', error);
        }
      });
  }


  checkSKillBeforeDeleting(skillId: number) {
  this.requestService.getSwapRequestsBySkillId(skillId).subscribe({
    next: (swapRequests) => {
      if (swapRequests && swapRequests.length > 0) {
        // Show error message to the user
        alert('This skill cannot be deleted because it is associated with existing swap requests.');
      } else {
        this.deleteSkill(skillId);
      }
    },
    error: (error) => {
      // Log and handle other errors
      console.error('Error checking swap requests:', error);
    }
  });
}

deleteSkill(skillId: number) {
  this.skillService.removeSkill(skillId).subscribe({
    next: (response) => {
      this.router.navigate(['skills']);
    },
    error: (error) => {
      console.error('Error deleting skill:', error);
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
}
