import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

/**
 * @description
 * Componente de Login.
 * Permite a los usuarios autenticarse proporcionando un nombre de usuario o correo electrónico y contraseña.
 *
 * @usageNotes
 * Al iniciar sesión correctamente, el usuario es redirigido a la página principal.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
})
export class LoginComponent {
  /**
   * Formulario reactivo para manejar los datos del inicio de sesión.
   */
  loginForm!: FormGroup;

  /**
   * @description
   * Constructor para inicializar los servicios y el formulario reactivo.
   *
   * @param fb - Proveedor de formularios reactivos.
   * @param authService - Servicio de autenticación.
   * @param router - Servicio de enrutamiento para la navegación.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  /**
   * @description
   * Inicializa el formulario con los campos necesarios y sus validaciones.
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * @description
   * Verifica si un campo específico del formulario es inválido.
   *
   * @param field - Nombre del campo a validar.
   * @returns `true` si el campo es inválido, de lo contrario, `false`.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * @description
   * Maneja el envío del formulario.
   * Autentica al usuario utilizando el servicio de autenticación.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;
  
    const { usernameOrEmail, password } = this.loginForm.value;
  
    this.authService.login({ usernameOrEmail, password }).subscribe({
      next: (user) => {
        if (user) {
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: 'Redirigiendo...',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/index']);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Usuario o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la solicitud.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
  
}