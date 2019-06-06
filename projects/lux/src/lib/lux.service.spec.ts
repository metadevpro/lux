import { TestBed } from '@angular/core/testing';

import { LuxService } from './lux.service';

describe('LuxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LuxService = TestBed.get(LuxService);
    expect(service).toBeTruthy();
  });
});
