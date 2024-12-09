import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CursosService } from '../../services/cursos.service';
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [CursosService]
})
export class IndexComponent implements OnInit {

  categories: any[] = [];
  selectedCategory: { id: string; name: string; courses: any[] } | null = null;
  editingCourse: any = {};
  newCourse: any = null;
  editCourseForm!: FormGroup;
  addCourseForm!: FormGroup;
  editMode = { enabled: false, index: null as number | null };
  addMode: boolean = false;

  /**
    * @description
    * Constructor del componente. 
    * Inicializa las dependencias necesarias para el manejo de autenticación, navegación y almacenamiento local.
    * 
    * @param authService Servicio para manejar la autenticación del usuario.
    * @param router Servicio para manejar la navegación entre rutas.
    * @param localStorageService Servicio para manejar el almacenamiento local.
    * @param cursosService Servicio para gestionar las operaciones relacionadas con los cursos.
    */
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private cursosService: CursosService,
    private fb: FormBuilder
  ) { }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Sincroniza el estado de inscripción de los cursos con los datos del usuario autenticado.
   */
  ngOnInit(): void {
    this.loadCursos();
    this.syncInscribedCourses();
    this.initializeForm();
  }

  /**
   * Inicializa el formulario reactivo para agregar un nuevo curso con validaciones.
   */
  private initializeForm(): void {
    this.addCourseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(46)]],
      profesor: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
      precio: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
    });
    this.editCourseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(46)]],
      profesor: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(50)]],
      precio: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
    });
  }


  /**
   * @description Verifica si un campo específico del formulario de agregar curso es inválido.
   */
  isAddFieldInvalid(field: string): boolean {
    const control = this.addCourseForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
 * @description
 * Verifica si un campo específico del formulario es inválido.
 *
 * @param field - Nombre del campo a validar.
 * @returns `true` si el campo es inválido, de lo contrario, `false`.
 */
  isEditFieldInvalid(field: string): boolean {
    const control = this.editCourseForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }


  /**
   * @description
   * Carga los cursos desde el servicio `cursosService` y sincroniza los datos de inscripción con el estado del usuario autenticado.
   * En caso de error, muestra un mensaje de alerta al usuario indicando que no se pudo cargar la información.
   */
  loadCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información de los cursos.',
        });
      },
    });
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
        category.courses.forEach((course: any) => {
          course.isEnrolled = userCourses.some(
            (inscrito: any) => inscrito.nombre === course.name
          );
        });
      });
    }
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

  isSuperuser(): boolean {
    const user = this.authService.getUser();
    return user?.role === 'admin';
  }

  /**
   * @description
   * Métodos CRUD para cursos.json 
   * 
   * Método para guardar curso
   */

  addCourse(): void {
    if (this.addMode) return;

    this.addMode = true;
    this.newCourse = {
      name: '',
      description: '',
      profesor: '',
      precio: '',
      isEnrolled: false,
    };

    this.selectedCategory?.courses.push(this.newCourse);
  }


  /**
  * @description
  * Enviar al servicio el nuevo curso.
  */

  saveNewCourse(): void {
    if (this.addCourseForm.invalid || !this.selectedCategory) {
      return;
    }

    const newCourse = this.addCourseForm.value;

    this.cursosService.addCurso(this.selectedCategory.id, newCourse).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Curso agregado',
          text: 'El curso ha sido agregado exitosamente.',
        });

        const category = this.categories.find(cat => cat.id === this.selectedCategory?.id);
        if (category) {
          const tempIndex = category.courses.indexOf(this.newCourse);
          if (tempIndex !== -1) {
            category.courses[tempIndex] = { ...newCourse };
          }
          this.selectedCategory = { ...category };
        }

        this.addMode = false;
        this.addCourseForm.reset();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el curso.',
        });
        this.deleteNewCourse()
        this.addMode = false;
        this.addCourseForm.reset();
      },
    });
  }

  cancelNewCourse(): void {
    this.deleteNewCourse()
    this.addMode = false;
    this.addCourseForm.reset();
  }

  deleteNewCourse(): void {
    const category = this.categories.find(cat => cat.id === this.selectedCategory?.id);
    if (category) {
      const tempIndex = category.courses.indexOf(this.newCourse);
      if (tempIndex !== -1) {
        category.courses.splice(tempIndex, 1);
      }
      this.selectedCategory = { ...category };
    }
  }



  /**
   * @description
   * Logica para editar un curso
   */
  editCourse(index: number): void {
    this.editMode = { enabled: true, index };
    this.editCourseForm.patchValue(this.selectedCategory?.courses[index]);
  }


  /**
   * @description
   * Enviar al servicio el curso editado.
   */
  saveCourse(): void {
    if (this.editMode.index === null || !this.selectedCategory || this.editCourseForm.invalid) {
      return;
    }

    const courseIndex = this.editMode.index;
    const updatedCourse = this.editCourseForm.value;

    this.cursosService
      .editCurso(this.selectedCategory.id, courseIndex, updatedCourse)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Curso editado',
          text: 'El curso ha sido editado exitosamente.',
        });

        const category = this.categories.find(
          (cat) => cat.id === this.selectedCategory?.id
        );
        if (category) {
          category.courses[courseIndex] = { ...updatedCourse };
          this.selectedCategory = { ...category };
        }
      });

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editMode = { enabled: false, index: null };
    this.editingCourse = null;
  }

  /**
   * @description
   * Lógica para eliminar un curso en el servicio.
   */

  deleteCourse(index: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el curso permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursosService
          .deleteCurso(this.selectedCategory?.id!, index)
          .subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Curso eliminado',
              text: 'El curso ha sido eliminado exitosamente.',
            });
            const category = this.categories.find(cat => cat.id === this.selectedCategory?.id);
            if (category) {
              category.courses.splice(index, 1);
              this.selectedCategory = { ...category };
            }
          });
      }
    });
  }

}