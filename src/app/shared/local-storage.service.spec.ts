import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

 // Mock de localStorage
 class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

beforeEach(() => {
  TestBed.configureTestingModule({});
  service = TestBed.inject(LocalStorageService);

  // Mockear localStorage en el entorno de pruebas
  Object.defineProperty(window, 'localStorage', {
    value: new MockLocalStorage(),
    writable: true,
  });
});

it('should be created', () => {
  expect(service).toBeTruthy();
});

it('should store an item in localStorage', () => {
  service.setItem('testKey', { name: 'testValue' });
  const storedItem = JSON.parse(localStorage.getItem('testKey') || '');
  expect(storedItem).toEqual({ name: 'testValue' });
});

it('should retrieve an item from localStorage', () => {
  localStorage.setItem('testKey', JSON.stringify({ name: 'testValue' }));
  const retrievedItem = service.getItem('testKey');
  expect(retrievedItem).toEqual({ name: 'testValue' });
});

it('should return null if item does not exist in localStorage', () => {
  const retrievedItem = service.getItem('nonExistentKey');
  expect(retrievedItem).toBeNull();
});

it('should remove an item from localStorage', () => {
  localStorage.setItem('testKey', JSON.stringify({ name: 'testValue' }));
  service.removeItem('testKey');
  const removedItem = localStorage.getItem('testKey');
  expect(removedItem).toBeNull();
});

it('should handle multiple removals gracefully', () => {
  localStorage.setItem('key1', JSON.stringify({ name: 'value1' }));
  localStorage.setItem('key2', JSON.stringify({ name: 'value2' }));
  service.removeItem('key1');
  service.removeItem('key2');

  expect(localStorage.getItem('key1')).toBeNull();
  expect(localStorage.getItem('key2')).toBeNull();
});

 
});