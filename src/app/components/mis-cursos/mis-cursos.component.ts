import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../shared/local-storage.service';
import { RouterModule, Router } from '@angular/router';

/**
 * @description 
 * Componente para gestionar y visualizar los cursos inscritos por el usuario.
 * 
 * Este componente muestra la lista de cursos inscritos y permite al usuario
 * eliminarlos o simular el acceso a ellos.
 * 
 * @usageNotes
 * 1. Importar este componente en el módulo principal.
 * 2. Usar el selector `app-mis-cursos` en la plantilla para mostrar los cursos inscritos.
 */

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.css'],
  imports: [CommonModule, RouterModule],
})
export class MisCursosComponent {
  /**
   * @description Lista de cursos en los que el usuario está inscrito.
   */
  cursosInscritos: any[] = [];

  /**
   * @description Nombre de usuario del usuario logueado.
   */
  username: string = '';

  /**
   * @description Constructor del componente.
   * Inicializa los datos del usuario logueado y los cursos inscritos.
   * 
   * @param localStorageService {LocalStorageService} - Servicio para manejar el almacenamiento local.
   * @param router {Router} - Servicio para manejar la navegación.
   */
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loadCursosInscritos();
  }

  /**
   * @description Carga los cursos inscritos del usuario desde el almacenamiento local.
   * Redirige al login si no hay un usuario logueado.
   */
  public loadCursosInscritos(): void {
    const usuarioLogueado = this.localStorageService.getItem('usuarioLogueado');
    if (!usuarioLogueado) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = usuarioLogueado.username;
    const inscripciones = this.localStorageService.getItem('inscripcionesPorUsuario') || {};
    this.cursosInscritos = inscripciones[this.username] || [];
  }

  /**
   * @description Simula la acción de asistir a un curso.
   * 
   * @param curso {any} - Objeto del curso seleccionado.
   */
  asistirCurso(curso: any): void {
    console.log(`Ingresando al curso: ${curso.nombre}`);
  }

  /**
   * @description Elimina un curso de la lista de cursos inscritos del usuario.
   * Actualiza el almacenamiento local con la lista actualizada.
   * 
   * @param index {number} - Índice del curso a eliminar.
   */
  eliminarCurso(index: number): void {
    this.cursosInscritos.splice(index, 1); 
    const inscripciones = this.localStorageService.getItem('inscripcionesPorUsuario') || {};
    inscripciones[this.username] = this.cursosInscritos; 
    this.localStorageService.setItem('inscripcionesPorUsuario', inscripciones);

    console.log(`Curso eliminado. Lista actualizada:`, this.cursosInscritos);
  }
}
