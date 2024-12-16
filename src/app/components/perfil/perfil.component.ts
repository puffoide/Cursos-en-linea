import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

/**
 * @description 
 * Componente para gestionar el perfil del usuario.
 * 
 * Este componente permite visualizar y editar el perfil del usuario,
 * incluyendo nombre, correo y contraseña.
 * 
 * @usageNotes
 * 1. Importar este componente en el módulo principal.
 * 2. Usar el selector `app-perfil` en la plantilla para mostrar el formulario de perfil.
 */

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PerfilComponent {
  /**
   * @description Formulario reactivo para gestionar los datos del perfil.
   */
  profileForm: FormGroup;

  /**
   * @description Indica si el formulario está en modo edición.
   */
  isEditing = false;

  /**
   * @description Almacena la información del usuario actual.
   */
  currentUser: any;

  /**
   * @description Constructor del componente.
   * Inicializa el formulario y carga los datos del usuario.
   * 
   * @param fb {FormBuilder} - Servicio para crear formularios reactivos.
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: [
        { value: this.currentUser?.name || '', disabled: true },
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/),
          Validators.minLength(10),
          Validators.maxLength(150),
        ],
      ],
      email: [
        { value: this.currentUser?.email || '', disabled: true },
        [
          Validators.required, 
          Validators.email,
          Validators.minLength(11),
          Validators.maxLength(254),
        ],
      ],
      password: [
        { value: '', disabled: true },
        [
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])/),
        ],
      ],
      confirmPassword: [{ value: '', disabled: true }],
    },
    {
      validators: this.matchPasswords('password', 'confirmPassword'),
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  /**
   * @description Carga el usuario logueado desde el bucket.
   */
  private loadCurrentUser(): void {
    const loggedInUser = this.authService.getUser(); // Obtener el usuario actual
    if (!loggedInUser) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró un usuario logueado.',
      });
      return;
    }
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.currentUser = users.find(
          (user: any) =>
            user.username === loggedInUser.username || user.email === loggedInUser.email
        );

        if (this.currentUser) {
          this.profileForm.patchValue({
            name: this.currentUser.name,
            email: this.currentUser.email,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El usuario no fue encontrado en el sistema.',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el perfil del usuario.',
        });
      },
    });
  }
  /**
   * @description Valida si las contraseñas coinciden.
   * 
   * @param password {string} - Campo de la contraseña.
   * @param confirmPassword {string} - Campo de la confirmación de contraseña.
   * @returns {ValidatorFn} Función de validación personalizada.
   */
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const pass = formGroup.get(password)?.value;
      const confirmPass = formGroup.get(confirmPassword)?.value;

      if (pass !== confirmPass) {
        formGroup.get(confirmPassword)?.setErrors({ noMatch: true });
      } else {
        formGroup.get(confirmPassword)?.setErrors(null);
      }
    };
  }

  /**
   * @description Alterna el modo edición del formulario.
   * Habilita o deshabilita los campos para edición.
   */
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.get('name')?.enable();
      this.profileForm.get('email')?.enable();
      this.profileForm.get('password')?.enable();
      this.profileForm.get('confirmPassword')?.enable();
    } else {
      this.resetForm();
    }
  }

  /**
   * @description Restablece los valores originales del formulario.
   */
  private resetForm(): void {
    this.profileForm.patchValue({
      name: this.currentUser?.name || '',
      email: this.currentUser?.email || '',
      password: '',
      confirmPassword: '',
    });

    this.profileForm.get('name')?.disable();
    this.profileForm.get('email')?.disable();
    this.profileForm.get('password')?.disable();
    this.profileForm.get('confirmPassword')?.disable();
  }

  /**
   * @description Verifica si un campo del formulario es inválido.
   * 
   * @param field {string} - Nombre del campo a verificar.
   * @returns {boolean} Indica si el campo es inválido.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * @description Maneja el envío del formulario.
   * Valida los datos, actualiza el usuario y muestra mensajes de éxito o error.
   */
  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const { name, email, password, confirmPassword } = this.profileForm.getRawValue();

    if (password && password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    const updatedUser = {
      ...this.currentUser,
      name,
      email,
      password: password || this.currentUser.password,
    };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Tus cambios han sido guardados exitosamente.',
        });
        this.toggleEditMode();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el perfil. Inténtalo nuevamente.',
        });
      },
    });
  }
}
