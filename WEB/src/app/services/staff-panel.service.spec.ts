import { TestBed } from '@angular/core/testing';

import { StaffPanelService } from './staff-panel.service';

describe('StaffPanelService', () => {
  let service: StaffPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
