import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';

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
    id: '',
    name: '',
    description: '',
    category: '',
    level: SkillLevel.Competent,
    prerequisity: '',
  };


  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.skillService.getSKill(id)
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
    this.skillDetails.level = +this.skillDetails.level;

    this.skillService.updateSkill(this.skillDetails.id, this.
      skillDetails)
      .subscribe({
        next: (response) => {
          this.router.navigate(['skills'])
        }
      })
  }

  deleteSkill(id: string) {
    this.skillService.deleteSkill(id)
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
