import { TestBed } from '@angular/core/testing';

import { HeroFakeBackendInterceptor } from './hero-fake-backend.interceptor';

describe('HeroFakeBackendInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HeroFakeBackendInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HeroFakeBackendInterceptor = TestBed.inject(HeroFakeBackendInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
