import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, of } from 'rxjs';
import { Skill, SkillLevel } from 'src/app/models/skill.model';
import { ImageService } from 'src/app/services/image.service';
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
    id: '',
    name: '',
    description: '',
    category: '',
    level: SkillLevel.Competent,
    prerequisity: '',
  };

  skillList: any;
  skillImage: any;
  EditSkillCode = '';
  Result: any;
  file!: File;
  progressvalue = 0;

  constructor(
    private skillService: SkillsService,
    private imageService: ImageService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  @ViewChild('content') addview !: ElementRef;
  @ViewChild('fileupload') fileupload !: ElementRef;

  ngOnInit(): void { }

  addSkill() {

    this.addSkillRequest.level = +this.addSkillRequest.level;

    this.skillService.addSkill(this.addSkillRequest)
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
   // this.open();
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

    RemoveImage(code: any, name: any) {
      if (confirm("Do you want remove the image : " + name + " ?")) {
        this.imageService.removeImage(code).subscribe(result => {
          alert("Upload completed"); // Use alertify instead of alertifyjs
          this.GetImage();
        });
      }
    }

    ProceedUpload() {
      let formdata = new FormData();
      formdata.append("file", this.file, this.EditSkillCode)
      this.imageService.uploadImage(formdata).pipe(

        map(events => {
          switch (events.type) {
            case HttpEventType.UploadProgress:
              this.progressvalue = Math.round(events.loaded / events.total! * 100);
              break;
            case HttpEventType.Response:
              this.GetImage();
              alert("Upload completed");
              setTimeout(() => {
                this.progressvalue = 0;
              }, 2500);
              break;

          }
        }),
        catchError((error: HttpErrorResponse) => {
          alert('Failed to upload')
          return of("failed");
        })

      ).subscribe(() => {
        // this.Getallproducts();
        // alertifyjs.success("Upload completed");
      });
    }

    GetImage() {
      this.imageService.getAllImages().subscribe(result => {
        this.skillList = result;
      });
    }

    GetProfileInfo(code: any, prodimage: any, name: any) {
      this.skillImage = prodimage;
      this.EditSkillCode = code;
     // this.open();
    }

    // open() {
    //   this.modalService.open(this.addview, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    //   }, (reason) => {
    //   });
    // }

    // private getDismissReason(reason: any): string {
    //   if (reason === ModalDismissReasons.ESC) {
    //     return 'by pressing ESC';
    //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //     return 'by clicking on a backdrop';
    //   } else {
    //     return `with: ${reason}`;
    //   }
    // }

  }


