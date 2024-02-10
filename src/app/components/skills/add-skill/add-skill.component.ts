import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SkillsService } from 'src/app/services/skills.service';

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


  addSkillRequest: Skill = {
    skillId: '',
    name: '',
    description: '',
    category: '',
    level: SkillLevel.Competent,
    prerequisity: '',
    userId: 0
  }

  addSkillForm!: FormGroup
  submited = false;

  userId: any;
  skillList: any;
  skillImage: any;
  EditSkillCode = '';
  Result: any;
  file!: File;
  progressvalue = 0;

  constructor(
    private authService: AuthService,
    private skillService: SkillsService,
    private imageService: ImageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  @ViewChild('content') addview !: ElementRef;
  @ViewChild('fileupload') fileupload !: ElementRef;

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
    this.addSkillRequest.level = +this.addSkillRequest.level;
    this.addSkillRequest.userId = this.userId;

    const requestBody = {
      name: this.addSkillRequest.name,
      description: this.addSkillRequest.description,
      category: this.addSkillRequest.category,
      level: this.addSkillRequest.level,
      prerequisity: this.addSkillRequest.prerequisity
    };

    this.skillService.addSkill(this.addSkillRequest.userId, requestBody)
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



  // ProceedUpload() {
  //   let formdata = new FormData();
  //   formdata.append("file", this.file, this.EditSkillCode)
  //   this.imageService.uploadImage(formdata).pipe(
  //     map(events => {
  //       switch (events.type) {
  //         case HttpEventType.UploadProgress:
  //           this.progressvalue = Math.round(events.loaded / events.total! * 100);
  //           break;
  //         case HttpEventType.Response:
  //           this.GetImage();
  //           alert("Upload completed");
  //           setTimeout(() => {
  //             this.progressvalue = 0;
  //           }, 2500);
  //           break;

  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       alert('Failed to upload')
  //       return of("failed");
  //     })
  //   ).subscribe(() => {
  //   });
  // }

}


