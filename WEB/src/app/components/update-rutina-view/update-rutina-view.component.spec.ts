import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRutinaViewComponent } from './update-rutina-view.component';

describe('UpdateRutinaViewComponent', () => {
  let component: UpdateRutinaViewComponent;
  let fixture: ComponentFixture<UpdateRutinaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRutinaViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRutinaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
