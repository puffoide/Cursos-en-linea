import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {

  selectedCategory: any = null;
  
  constructor(private authService: AuthService, private router: Router) {}
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

  getRandomPrecio(): string {
    const precio = Math.floor(Math.random() * (30000 - 5000) + 5000); 
    return `$${precio.toLocaleString('es-CL')} CLP`; 
  }

  // Mostrar la categoría seleccionada
  showCategory(categoryId: string): void {
    this.selectedCategory = this.categories.find(
      (category) => category.id === categoryId
    );
  }

  // Inscribir al usuario en un curso
  inscribirCurso(course: any): void {
    const user = this.authService.getUser();
    if (!user) {
      // Si no está autenticado, redirige al registro
      this.router.navigate(['/registro']);
      return;
    }

    if (course.isEnrolled) {
      alert('Ya estás inscrito en este curso.');
    } else {
      course.isEnrolled = true;
      alert(`Te has inscrito exitosamente en el curso: ${course.name}`);
    }
  }

  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
}
