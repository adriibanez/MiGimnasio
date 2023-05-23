import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMembresiaViewComponent } from './update-membresia-view.component';

describe('UpdateMembresiaViewComponent', () => {
  let component: UpdateMembresiaViewComponent;
  let fixture: ComponentFixture<UpdateMembresiaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMembresiaViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMembresiaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
