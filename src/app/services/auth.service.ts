/**
 * Servicio de autenticación para la gestión de usuarios logueados.
 * Proporciona métodos para iniciar sesión, cerrar sesión y obtener información del usuario actual.
 */
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../shared/local-storage.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'usuarioLogueado'; // Clave de almacenamiento para el usuario logueado
  private loggedInSubject: BehaviorSubject<boolean>; // Estado de autenticación

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const isLoggedIn = this.isBrowser() && !!this.localStorageService.getItem(this.userKey);
    this.loggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);
  }

  initialize(): void {
    if (this.isBrowser()) {
      this.initializeSuperuser();
    }
  }

  /**
   * Inicializa un super usuario.
   */
  private initializeSuperuser(): void {
    if (!this.localStorageService.getItem('superuser')) {
      this.localStorageService.setItem('superuser', {
        username: 'admin',
        password: 'adminadmin',
        role: 'admin',
      });
    }
  }

  /**
   * Verifica si la aplicación se está ejecutando en el navegador.
   * @returns {boolean} Verdadero si es navegador, falso en otro caso.
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Devuelve un Observable con el estado de autenticación.
   * @returns {Observable<boolean>} Observable del estado de autenticación.
   */
  isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns {boolean} Verdadero si está autenticado, falso en otro caso.
   */
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  /**
   * Inicia sesión con las credenciales proporcionadas.
   * @param credentials Objeto con `usernameOrEmail` y `password`.
   * @returns {any | null} El usuario autenticado o null si falló.
   */
  login(credentials: { usernameOrEmail: string; password: string }): any | null {
    if (!this.isBrowser()) return null;

    const usuarios = this.localStorageService.getItem('usuarios') || [];
    const superuser = this.localStorageService.getItem('superuser');

    const allUsers = [...usuarios, superuser].filter(Boolean);

    const user = allUsers.find(
      (u: any) =>
        (u.email === credentials.usernameOrEmail || u.username === credentials.usernameOrEmail) &&
        u.password === credentials.password
    );

    if (user) {
      this.localStorageService.setItem(this.userKey, user);
      this.loggedInSubject.next(true); // Actualiza el estado de autenticación
      return user;
    }

    return null;
  }

  /**
   * Cierra sesión eliminando el usuario logueado del almacenamiento.
   */
  logout(): void {
    if (this.isBrowser()) {
      this.localStorageService.removeItem(this.userKey);
      this.loggedInSubject.next(false); // Actualiza el estado de autenticación
    }
  }

  /**
   * Obtiene la información del usuario logueado.
   * @returns {any | null} El usuario actual o null si no hay usuario logueado.
   */
  getUser(): any {
    if (!this.isBrowser()) return null;
    return this.localStorageService.getItem(this.userKey);
  }
}
