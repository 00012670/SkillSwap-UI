import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { map } from 'rxjs';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { SkillImageService } from 'src/app/services/skill-image.service';
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

  @ViewChild('uploadImageRef', { static: false }) uploadImageRef!: ElementRef;

  public skillDetails: Skill = {
    skillId: 0,
    name: '',
    description: '',
    category: '',
    level: SkillLevel.Foundational,
    prerequisity: '',
    userId: 0,
    hasImage: false,
    imageUrl: undefined,
  }

  addSkillForm!: FormGroup
  submited = false;
  userId: any;
  EditSkillCode = '';
  file!: File;
  imageUrl: SafeUrl | undefined;
  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  constructor(
    private authService: AuthService,
    private skillService: SkillsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private skillImageService: SkillImageService,
    private toast: NgToastService
  ) {
    this.addSkillForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      level: ['', Validators.required],
      prerequisity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
    }
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
          // After the skill is created, upload the image
          if (this.file) {
            this.skillDetails.skillId = skill.skillId; // Assuming the response contains the created skill
            this.uploadImage();
          }
          this.router.navigate(['/skills']);
          this.toast.success({ detail: 'SUCCESS', summary: 'Skill added successfully', duration: 3000 });

        }
      });
  }

  getLevel(level: SkillLevel): string {
    const levels = {
      [SkillLevel.Foundational]: 'Foundational',
      [SkillLevel.Competent]: 'Competent',
      [SkillLevel.Expert]: 'Expert',
      [SkillLevel.Master]: 'Master'
    };
    return levels[level] || '';
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      this.isImageChosen = true;
    };
  }

  uploadImage() {
    this.skillImageService.uploadImage(this.skillDetails.skillId, this.file).pipe(
      map(event => {
        if (event.type === HttpEventType.Response) {
          this.isImageDeleted = false;
          this.skillDetails.hasImage = true;
          this.isImageUploaded = true;
          this.isImageChosen = false;
        }
      })
    ).subscribe();
  }
}


