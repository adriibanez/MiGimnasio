import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAdminPanelComponent } from './users-admin-panel.component';

describe('UsersAdminPanelComponent', () => {
  let component: UsersAdminPanelComponent;
  let fixture: ComponentFixture<UsersAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAdminPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
