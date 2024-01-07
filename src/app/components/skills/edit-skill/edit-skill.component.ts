import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';

@Component({
  selector: 'app-edit-skill',
  templateUrl: './edit-skill.component.html',
  styleUrls: ['./edit-skill.component.scss']
})


export class EditSkillComponent {

  skillDetails: Skill ={
    id: '',
    name: '',
    description: '',
    category: '',
    level: '',
    prerequisites: '',
    picture: ''
  }

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if(id) {
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
    this.skillService.updateSkill(this.skillDetails.id, this.
      skillDetails)
      .subscribe({
        next: (response) =>{
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
}
