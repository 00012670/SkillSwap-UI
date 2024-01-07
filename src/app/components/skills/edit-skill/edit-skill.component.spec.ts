import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillComponent } from './edit-skill.component';

describe('EditSkillComponent', () => {
  let component: EditSkillComponent;
  let fixture: ComponentFixture<EditSkillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSkillComponent]
    });
    fixture = TestBed.createComponent(EditSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
