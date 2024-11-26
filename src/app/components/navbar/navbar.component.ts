import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente Navbar de la aplicación Coureka.
 * 
 * Este componente maneja la barra de navegación, mostrando opciones
 * dinámicas basadas en el estado de inicio de sesión del usuario.
 */

/**
 * @usageNotes
 * - Importar el componente como un módulo independiente en la aplicación.
 * - Incluye un enlace a las rutas del sistema y controla la autenticación.
 * - El estado de inicio de sesión se actualiza automáticamente al observar el `AuthService`.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  /**
   * @description
   * Indica si el usuario está logueado. 
   * Se utiliza para controlar la visibilidad de opciones en el navbar.
   */
  isLoggedIn: boolean = false;

  /**
   * @description
   * Constructor para inicializar dependencias.
   * 
   * @param authService Servicio de autenticación para manejar el estado del usuario.
   */
  constructor(private authService: AuthService) {}

  /**
   * @description
   * Ciclo de vida `ngOnInit` que inicializa el estado de inicio de sesión.
   * Se suscribe al observable `isLoggedIn$` para actualizar dinámicamente.
   */
  ngOnInit(): void {
    this.authService.isLoggedIn$().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  /**
   * @description
   * Maneja el cierre de sesión del usuario y actualiza el estado de autenticación.
   */
  logout(): void {
    this.authService.logout();
  }
}
