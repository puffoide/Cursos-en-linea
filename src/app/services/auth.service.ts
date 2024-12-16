/**
 * Servicio de autenticación para la gestión de usuarios logueados.
 * Proporciona métodos para iniciar sesión, cerrar sesión y obtener información del usuario actual.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '';
  private loggedInSubject = new BehaviorSubject<boolean>(false); // Estado de autenticación
  private currentUser: any = null;

  constructor(private http: HttpClient, private userService: UserService) {}

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
   * @returns {any} El usuario autenticado.
   */
  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.userService.checkUserCredentials(credentials).pipe(
        tap((user) => {
            if (user) {
                this.currentUser = user;
                this.loggedInSubject.next(true);
            }
        })
    );
}


  /**
   * Cierra sesión eliminando el usuario logueado del almacenamiento.
   */
 logout(): void {
    this.currentUser = null;
    this.loggedInSubject.next(false);
  }

  /**
   * Obtiene la información del usuario logueado.
   * @returns {any | null} El usuario actual o null si no hay usuario logueado.
   */
  getUser(): any {
    return this.currentUser;
  }
}
