import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import Swal from 'sweetalert2';

/**
 * @description
 * Componente principal de la página de inicio de la aplicación.
 * 
 * Este componente muestra categorías de cursos y permite a los usuarios autenticados inscribirse en ellos.
 * Además, sincroniza el estado de inscripción de los cursos con los datos almacenados en localStorage.
 */
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  /**
   * @description
   * Categoría seleccionada actualmente.
   */
  selectedCategory: any = null;

  /**
   * @description
   * Arreglo de categorías de cursos, cada una con sus respectivos cursos.
   */

  categories = [
    {
      id: 'programacion',
      name: 'Programación',
      icon: './assets/img/iconcode.png',
      courses: [
        {
          name: 'Python para Principiantes',
          description: 'Aprende a programar en Python desde cero.',
          profesor: 'Prof. Laura Gómez',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
        {
          name: 'JavaScript Básico',
          description: 'Fundamentos de JavaScript para desarrollo web.',
          profesor: 'Prof. Carlos Pérez',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: './assets/img/iconmarketing.png',
      courses: [
        {
          name: 'Marketing Digital',
          description: 'Conceptos y estrategias de marketing digital.',
          profesor: 'Prof. María López',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
      ],
    },
    {
      id: 'ventas',
      name: 'Ventas',
      icon: './assets/img/iconventa.png',
      courses: [
        {
          name: 'Técnicas de Ventas',
          description: 'Aprende técnicas avanzadas de ventas.',
          profesor: 'Prof. Javier Ortega',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
      ],
    },
    {
      id: 'cloud',
      name: 'Cloud Computing',
      icon: './assets/img/iconcloud.png',
      courses: [
        {
          name: 'Introducción a AWS',
          description: 'Conoce los servicios de Amazon Web Services.',
          profesor: 'Prof. Javier Ortega',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
      ],
    },
    {
      id: 'ing',
      name: 'Ingeniería',
      icon: './assets/img/iconeng.png',
      courses: [
        {
          name: 'Ingeniería de Datos',
          description: 'Introducción a la ingeniería de datos.',
          profesor: 'Prof. Javier Ortega',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
      ],
    },
    {
      id: 'arcr',
      name: 'Arte/Creativo',
      icon: './assets/img/iconarte.png',
      courses: [
        {
          name: 'Fotografía Básica',
          description: 'Fundamentos de fotografía y uso de cámaras.',
          profesor: 'Prof. Javier Ortega',
          precio: this.getRandomPrecio(),
          isEnrolled: false,
        },
      ],
    },
  ];

  /**
    * @description
    * Constructor del componente. 
    * Inicializa las dependencias necesarias para el manejo de autenticación, navegación y almacenamiento local.
    * 
    * @param authService Servicio para manejar la autenticación del usuario.
    * @param router Servicio para manejar la navegación entre rutas.
    * @param localStorageService Servicio para manejar el almacenamiento local.
    */
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Sincroniza el estado de inscripción de los cursos con los datos del usuario autenticado.
   */
  ngOnInit(): void {
    this.syncInscribedCourses();
  }

  /**
   * @description
   * Sincroniza el estado de inscripción de los cursos con los datos almacenados en localStorage.
   * 
   * @private
   */
  private syncInscribedCourses(): void {
    const user = this.authService.getUser();
    if (!user) return;

    const inscripciones = this.localStorageService.getItem('inscripcionesPorUsuario') || {};

    if (inscripciones[user.username]) {
      const userCourses = inscripciones[user.username];

      this.categories.forEach((category) => {
        category.courses.forEach((course) => {
          course.isEnrolled = userCourses.some(
            (inscrito: any) => inscrito.nombre === course.name
          );
        });
      });
    }
  }

  /**
   * @description
   * Genera un precio aleatorio para los cursos.
   * 
   * @returns {string} Precio en formato de moneda chilena.
   */
  getRandomPrecio(): string {
    const precio = Math.floor(Math.random() * (30000 - 5000) + 5000);
    return `$${precio.toLocaleString('es-CL')} CLP`;
  }

  /**
   * @description
   * Cambia la categoría seleccionada para mostrar sus cursos.
   * 
   * @param {string} categoryId ID de la categoría seleccionada.
   */
  showCategory(categoryId: string): void {
    this.selectedCategory = this.categories.find(
      (category) => category.id === categoryId
    );
  }

  /**
   * @description
   * Permite al usuario autenticado inscribirse en un curso.
   * Actualiza el estado de inscripción y almacena los datos en localStorage.
   * 
   * @param {any} course Curso en el que el usuario desea inscribirse.
   */
  inscribirCurso(course: any): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!course.isEnrolled) {
      course.isEnrolled = true;

      const inscripciones = this.localStorageService.getItem('inscripcionesPorUsuario') || {};
      if (!inscripciones[user.username]) {
        inscripciones[user.username] = [];
      }

      const isAlreadyEnrolled = inscripciones[user.username].some(
        (inscrito: any) => inscrito.nombre === course.name
      );

      if (!isAlreadyEnrolled) {
        inscripciones[user.username].push({
          nombre: course.name,
          descripcion: course.description,
          profesor: course.profesor,
          precio: course.precio,
        });
      }

      this.localStorageService.setItem('inscripcionesPorUsuario', inscripciones);

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Te has inscrito exitosamente",
        text: `Curso: ${course.name}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  /**
   * @description
   * Verifica si el usuario está autenticado.
   * 
   * @returns {boolean} `true` si el usuario está autenticado, de lo contrario `false`.
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}