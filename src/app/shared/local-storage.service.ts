import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getItem(key: string): any {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available.');
      return null;
    }
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, value: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available.');
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available.');
      return;
    }
    localStorage.removeItem(key);
  }
}
