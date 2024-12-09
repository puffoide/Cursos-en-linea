import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

/**
 * Componente raíz de la aplicación.
 * 
 * Este componente actúa como el contenedor principal de la aplicación.
 * Incluye el componente de navegación y el área para mostrar las rutas.
 * 
 * @usageNotes
 * - Este componente es el punto de entrada de la aplicación Angular.
 * - Importa el `NavbarComponent` para la barra de navegación.
 * - Utiliza el `RouterOutlet` para mostrar las rutas configuradas.
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  /**
   * Título de la aplicación.
   * Este valor se utiliza principalmente en las vistas y puede ser dinámico.
   */
  title = 'coureka !';

  constructor(private authService: AuthService) {
    // Inicializa el superusuario
    this.authService.initialize();
  }
}
