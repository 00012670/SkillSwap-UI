import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { SkillsService } from 'src/app/services/skill.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { NgToastService } from 'ng-angular-popup';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SkillImageService } from 'src/app/services/skill-image.service';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-edit-skill',
  templateUrl: './edit-skill.component.html',
  styleUrls: ['./edit-skill.component.scss']
})

export class EditSkillComponent implements OnInit {

  @ViewChild('uploadImageRef', { static: false }) uploadImageRef!: ElementRef;

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

  userId: any;
  editSkillForm: FormGroup;
  submited = false;
  file!: File;
  imageUrl: SafeUrl | undefined;
  isImageChosen: boolean = false;
  isImageUploaded: boolean = false;
  isImageDeleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillsService,
    private requestService: RequestService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    private sanitizer: DomSanitizer,
    private skillImageService: SkillImageService,
  ) {
    this.editSkillForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      level: ['', Validators.required],
      prerequisity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.skillService.getSKillbyId(+id)
            .subscribe({
              next: (response) => {
                this.skillDetails = response;
                this.editSkillForm.patchValue(this.skillDetails);
                if (this.skillDetails.hasImage && !this.isImageDeleted) {
                  this.getImageBySkillId(this.skillDetails.skillId);
                }
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
          this.toast.success({ detail: 'SUCCESS', summary: 'Skill updated successfully', duration: 3000 });
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
          this.toast.error({ detail: "ERROR", summary: 'This skill cannot be deleted because it is associated with existing swap requests.', duration: 5000 });
        } else {
          this.deleteSkill(skillId);
        }
      },
      error: (error) => {
        console.error('Error checking swap requests:', error);
      }
    });
  }

  deleteSkill(skillId: number) {
    if (this.skillDetails.skillId && confirm('Are you sure you want to remove the skill?')) {
      this.skillService.removeSkill(skillId).subscribe({
        next: (response) => {
          this.router.navigate(['skills']);
        },
        error: (error) => {
          console.error('Error deleting skill:', error);
        }
      });
    }
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

  getImageBySkillId(skillId: number) {
    this.skillImageService.getImageBySkillId(skillId).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        const blobUrl = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        this.isImageUploaded = true;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          console.error('Failed to get image', error);
        }
      }
    });
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
          this.toast.success({ detail: 'SUCCESS', summary: 'Image uploaded successfully', duration: 3000 });
          this.isImageDeleted = false;
          this.skillDetails.hasImage = true;
          this.isImageUploaded = true;
          this.isImageChosen = false;
        }
      })
    ).subscribe();
  }


  removeImage() {
    if (this.skillDetails.skillId && confirm('Are you sure you want to remove the image?')) {
      this.skillImageService.removeImage(this.skillDetails.skillId).subscribe({
        next: () => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Image removed successfully', duration: 3000 });
          this.imageUrl = undefined;
          this.skillDetails.skillImage = undefined;
          this.isImageUploaded = false;
          this.isImageDeleted = true;
          this.isImageChosen = false;
          const uploadImageInput = this.uploadImageRef.nativeElement;
          if (uploadImageInput) {
            uploadImageInput.value = null;
          }
        },
        error: error => {
          console.error('Failed to remove image', error);
          this.toast.error({ detail: 'ERROR', summary: 'Failed to remove image', duration: 4000 });
        }
      });
    }
  }
}
