import { TestBed } from '@angular/core/testing';

import { Parallax } from './parallax';

describe('Parallax', () => {
  let service: Parallax;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Parallax);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
