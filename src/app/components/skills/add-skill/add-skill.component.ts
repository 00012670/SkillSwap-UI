import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Skill } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})

export class AddSkillComponent {

  addSkillRequest: Skill = {
    id: '',
    name: '',
    description: '',
    category: '',
    level: '',
    prerequisity: '',
    picture: ''
  }

  constructor(
    private skillService: SkillsService,
    private router: Router) {

  }

  ngOnit(): void {

  }

  addSkill() {
    this.skillService.addSkill(this.addSkillRequest)
    .subscribe({
      next: (skill) => {
        this.router.navigate(['/skills'])
      }
    })
  }
}
