import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlanningViewComponent } from './update-planning-view.component';

describe('UpdatePlanningViewComponent', () => {
  let component: UpdatePlanningViewComponent;
  let fixture: ComponentFixture<UpdatePlanningViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePlanningViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePlanningViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
