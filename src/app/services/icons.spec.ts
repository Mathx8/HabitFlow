import { TestBed } from '@angular/core/testing';

import { Icons } from './icons';

describe('Icons', () => {
  let service: Icons;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Icons);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
