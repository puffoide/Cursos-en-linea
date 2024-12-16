import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CursosService } from '../../services/cursos.service';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
   * @param authService {authService} - Servicio para manejar la autenticación.
   * @param router {Router} - Servicio para manejar la navegación.
   */
  constructor(
    private cursosService: CursosService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadCursosInscritos();
  }

  ngOnInit(): void {
    this.loadCursosInscritos();
  } 

  /**
   * @description Carga los cursos inscritos del usuario.
   * Redirige al login si no hay un usuario logueado.
   */
  loadCursosInscritos(): void {
    const loggedInUser = this.authService.getUser(); // Obtener usuario logueado
    if (!loggedInUser) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.username = loggedInUser.username;
  
        // Obtener los cursos del backend
        this.cursosService.getCursos().subscribe({
          next: (categories) => {
            this.cursosInscritos = [];
            categories.forEach((category: any) => {
              category.courses.forEach((course: any) => {
                if (course.inscritos.includes(this.username)) {
                  this.cursosInscritos.push(course);
                }
              });
            });
            console.log('Cursos inscritos:', this.cursosInscritos);
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar los cursos inscritos.',
            });
          },
        });        
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del usuario.',
        });
      },
    });
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
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
  
    const cursoAEliminar = this.cursosInscritos[index];
    this.cursosInscritos.splice(index, 1);
  
    // Actualizar el backend
    this.cursosService.getCursos().subscribe({
      next: (categories) => {
        // Buscar y actualizar el curso correspondiente en el backend
        categories.forEach((category: any) => {
          const curso = category.courses.find((c: any) => c.name === cursoAEliminar.name);
          if (curso) {
            const userIndex = curso.inscritos.indexOf(user.username);
            if (userIndex !== -1) {
              curso.inscritos.splice(userIndex, 1); // Eliminar usuario del array inscritos
            }
          }
        });
  
        // Guardar cambios en el backend
        this.cursosService.updateCursos(categories).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Curso eliminado',
              text: `Has eliminado el curso: ${cursoAEliminar.name}`,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el curso. Inténtalo nuevamente.',
            });
          },
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los cursos.',
        });
      },
    });
  }
  
}
