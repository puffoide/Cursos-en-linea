import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import Swal from 'sweetalert2';

/**
 * @description
 * Componente de Registro.
 * Permite a los usuarios registrarse proporcionando un nombre, correo electrónico, nombre de usuario y contraseña.
 *
 * @usageNotes
 * Este componente incluye validaciones personalizadas para contraseñas y confirmación de contraseñas.
 * Al registrarse con éxito, los datos se almacenan en el localStorage y el usuario es redirigido a la página de inicio de sesión.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  /**
   * Formulario reactivo para manejar los datos del registro.
   */
  registerForm!: FormGroup;

  /**
   * @description
   * Constructor para inicializar el formulario y los servicios requeridos.
   *
   * @param fb - Proveedor de formularios reactivos.
   * @param router - Servicio de enrutamiento para la navegación.
   * @param localStorageService - Servicio para interactuar con el almacenamiento local.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.initializeForm();
  }

  /**
   * @description
   * Inicializa el formulario con los campos necesarios y sus validaciones.
   */
  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.matchPasswords('password', 'confirmPassword'),
      }
    );
  }

  /**
   * @description
   * Muestra una alerta utilizando SweetAlert2.
   *
   * @param title - Título de la alerta.
   * @param text - Mensaje de la alerta.
   * @param icon - Tipo de alerta (success, error, warning, info).
   */
  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK',
    });
  }

  /**
   * @description
   * Validación personalizada para verificar que la contraseña y su confirmación coincidan.
   *
   * @param password - Nombre del control de contraseña.
   * @param confirmPassword - Nombre del control de confirmación de contraseña.
   * @returns Una función de validación.
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
   * @description
   * Verifica si un campo específico del formulario es inválido.
   *
   * @param field - Nombre del campo a validar.
   * @returns `true` si el campo es inválido, de lo contrario, `false`.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * @description
   * Maneja el evento de envío del formulario.
   * Registra un nuevo usuario si el formulario es válido y no existe ya en el localStorage.
   */
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { name, email, username, password } = this.registerForm.value;

    const usuarios = this.localStorageService.getItem('usuarios') || [];
    const usuarioExistente = usuarios.find(
      (user: any) => user.email === email || user.username === username
    );

    if (usuarioExistente) {
      this.showAlert('Usuario Existente', 'El usuario ya está registrado.', 'error');
      return;
    }

    usuarios.push({ name, email, username, password });
    this.localStorageService.setItem('usuarios', usuarios);

    Swal.fire({
      title: 'Registro Exitoso',
      text: 'Ahora puedes iniciar sesión.',
      icon: 'success',
      confirmButtonText: 'Ir al Login',
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
