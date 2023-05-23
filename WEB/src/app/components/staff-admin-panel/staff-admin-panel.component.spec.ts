import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAdminPanelComponent } from './staff-admin-panel.component';

describe('StaffAdminPanelComponent', () => {
  let component: StaffAdminPanelComponent;
  let fixture: ComponentFixture<StaffAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffAdminPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
