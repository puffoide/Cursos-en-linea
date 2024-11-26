import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: LocalStorageService, useValue: spy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(AuthService);
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should return true if user is logged in', () => {
    localStorageServiceSpy.getItem.and.returnValue({ username: 'testuser' }); 
    service = new AuthService(localStorageServiceSpy, 'browser'); 
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if no user is logged in', () => {
    localStorageServiceSpy.getItem.and.returnValue(null); 
    service = new AuthService(localStorageServiceSpy, 'browser'); 
    expect(service.isLoggedIn()).toBeFalse();
  });
});
