import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';

/**
 * @description
 * Componente para la recuperación de contraseñas.
 * 
 * Este componente permite a los usuarios solicitar un enlace de recuperación
 * de contraseña mediante su correo electrónico.
 */

/**
 * @usageNotes
 * - Importar este componente como módulo independiente en la aplicación.
 * - Incluye validación de correo electrónico para garantizar el formato correcto.
 * - Usa `SweetAlert2` para proporcionar retroalimentación visual a los usuarios.
 */

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class RecuperarContrasenaComponent {
  /**
   * @description
   * Formulario reactivo para la recuperación de contraseñas.
   */
  forgotPasswordForm!: FormGroup;

  /**
   * @description
   * Constructor para inicializar dependencias y configurar el formulario.
   * 
   * @param fb Constructor de formularios reactivos.
   * @param router Router para manejar la navegación.
   * @param localStorageService Servicio para gestionar datos en `localStorage`.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * @description
   * Verifica si un campo del formulario es inválido.
   * 
   * @param field Nombre del campo a validar.
   * @returns `true` si el campo es inválido, de lo contrario `false`.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * @description
   * Maneja el envío del formulario para procesar la recuperación de contraseña.
   */
  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, introduce un correo electrónico válido.',
      });
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value;

    const usuarios = this.localStorageService.getItem('usuarios') || [];
    const user = usuarios.find((u: any) => u.email === email);

    if (user) {
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Se ha enviado un enlace para recuperar tu contraseña.',
      }).then(() => {
        this.router.navigate(['/login']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Correo no encontrado',
        text: 'El correo ingresado no está registrado.',
      });
    }
  }

  /**
   * @description
   * Maneja la acción de cancelar y redirige al usuario al login.
   */
  onCancel(): void {
    this.router.navigate(['/login']);
  }
}
