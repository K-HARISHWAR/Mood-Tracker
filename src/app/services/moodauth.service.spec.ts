import { TestBed } from '@angular/core/testing';

import { MoodauthService } from './moodauth.service';

describe('MoodauthService', () => {
  let service: MoodauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
