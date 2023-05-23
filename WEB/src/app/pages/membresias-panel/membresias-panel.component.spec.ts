import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiasPanelComponent } from './membresias-panel.component';

describe('MembresiasPanelComponent', () => {
  let component: MembresiasPanelComponent;
  let fixture: ComponentFixture<MembresiasPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembresiasPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembresiasPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
