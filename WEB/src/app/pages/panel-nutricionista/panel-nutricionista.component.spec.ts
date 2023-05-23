import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelNutricionistaComponent } from './panel-nutricionista.component';

describe('PanelNutricionistaComponent', () => {
  let component: PanelNutricionistaComponent;
  let fixture: ComponentFixture<PanelNutricionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelNutricionistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelNutricionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
