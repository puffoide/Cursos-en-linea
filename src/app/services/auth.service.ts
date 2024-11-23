import { Injectable } from '@angular/core';
import { LocalStorageService } from '../shared/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'usuarioLogueado';

  constructor(private localStorageService: LocalStorageService) {}

  isLoggedIn(): boolean {
    return !!this.localStorageService.getItem(this.userKey);
  }

  login(user: any): void {
    this.localStorageService.setItem(this.userKey, user);
  }

  logout(): void {
    this.localStorageService.removeItem(this.userKey);
  }

  getUser(): any {
    return this.localStorageService.getItem(this.userKey);
  }
}
