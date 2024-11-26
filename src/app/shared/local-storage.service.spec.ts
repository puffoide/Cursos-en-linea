import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    // Mock del localStorage
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => mockStorage[key] || null);
    spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockStorage[key] = value;
    });
    spyOn(window.localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockStorage[key];
    });
  });

  const mockStorage: { [key: string]: string } = {};

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if localStorage is not available in getItem', () => {
    spyOn(service as any, 'isLocalStorageAvailable').and.returnValue(false);
    const result = service.getItem('testKey');
    expect(result).toBeNull();
  });

  it('should retrieve an item from localStorage', () => {
    mockStorage['testKey'] = JSON.stringify({ data: 'testValue' });
    const result = service.getItem('testKey');
    expect(result).toEqual({ data: 'testValue' });
  });

  it('should return null for non-existent keys', () => {
    const result = service.getItem('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should save an item to localStorage', () => {
    service.setItem('newKey', { data: 'newValue' });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('newKey', JSON.stringify({ data: 'newValue' }));
    expect(mockStorage['newKey']).toEqual(JSON.stringify({ data: 'newValue' }));
  });

  it('should not save an item if localStorage is not available', () => {
    spyOn(service as any, 'isLocalStorageAvailable').and.returnValue(false);
    service.setItem('key', { data: 'value' });
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should remove an item from localStorage', () => {
    mockStorage['testKey'] = JSON.stringify({ data: 'testValue' });
    service.removeItem('testKey');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('testKey');
    expect(mockStorage['testKey']).toBeUndefined();
  });

  it('should not remove an item if localStorage is not available', () => {
    spyOn(service as any, 'isLocalStorageAvailable').and.returnValue(false);
    service.removeItem('testKey');
    expect(window.localStorage.removeItem).not.toHaveBeenCalled();
  });
});
