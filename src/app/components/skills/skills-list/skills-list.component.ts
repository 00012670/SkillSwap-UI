import { Component, OnInit } from '@angular/core';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skills.service';


@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent implements OnInit {

  skills: Skill[] = [];
  images: any[] = [];

  SkillList: any;
  SkillImage: any;
  editImageCode = '';
  Result: any;
  file!: File;
  Progress = 0
  EditImageCode: any;

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.skillsService.getAllSkills()
    .subscribe({
      next: (skills) => {
        this.skills = skills;
      },
      error: (response) => {
        console.log(response);
      }
    });

    //this.GetAllImages();

  }

  getLevel(level: SkillLevel): string {
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

  GetAllImages() {
    this.skillsService.getAllImages().subscribe(result => {
      this.SkillList = result;
    });
  }

  GetSkillInfo(code: any, prodimage: any, name: any) {
    this.SkillImage = prodimage;
    this.EditImageCode = code;

   // this.open();
  }
}

