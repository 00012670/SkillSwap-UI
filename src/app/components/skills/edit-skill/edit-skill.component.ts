import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
          this.skillService.getSKillbyId(id)
            .subscribe({
              next: (response) => {
                this.skillDetails = response;
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
    this.skillDetails.level = +this.skillDetails.level;

    this.skillService.updateSkill(this.skillDetails.skillId, this.skillDetails)
      .subscribe({
        next: (response) => {
          this.router.navigate(['skills'])
        }
      })
  }

  removeSkill(skillId: number) {
    this.skillService.removeSkill(skillId)
      .subscribe({
        next: (response) => {
          this.router.navigate(['skills']);
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
