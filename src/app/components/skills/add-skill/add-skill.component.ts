import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { SkillsService } from 'src/app/services/skill.service';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent implements OnInit {

  levelOptions: SkillLevel[] = [
    SkillLevel.Foundational,
    SkillLevel.Competent,
    SkillLevel.Expert,
    SkillLevel.Master
  ];

  addSkillForm!: FormGroup
  submited = false;

  userId: any;
  skillImage: any;
  EditSkillCode = '';
  file!: File;
  progressvalue = 0;

  constructor(
    private authService: AuthService,
    private skillService: SkillsService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
    } else {
      console.error('Error: userId is null');
    }

    this.addSkillForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      level: ['', Validators.required],
      prerequisity: ['', Validators.required],
    });
  }

  addSkill() {
    this.submited = true;
    if (this.addSkillForm.invalid) {
      return
    }

    const requestBody = {
      name: this.addSkillForm.get('name')?.value,
      description: this.addSkillForm.get('description')?.value,
      category: this.addSkillForm.get('category')?.value,
      level: +this.addSkillForm.get('level')?.value,
      prerequisity: this.addSkillForm.get('prerequisity')?.value
    };

    this.skillService.addSkill(this.userId, requestBody)
    .subscribe({
      next: (skill) => {
        this.router.navigate(['/skills']);
      },
      error: (error) => {
        console.error('Error adding skill:', error);
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

  UploadImage(code: any, image: any) {
    this.skillImage = image;
    this.EditSkillCode = code;
  }

  onChange(event: any) {
    let reader = new FileReader();
    this.file = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.skillImage = reader.result;
    };
  }
}


