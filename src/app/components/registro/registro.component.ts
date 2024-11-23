import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  formData = {
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  // Mostrar alerta (puede adaptarse a un componente de alerta si es necesario)
  mostrarAlerta(mensaje: string, tipo: string): void {
    alert(`${tipo.toUpperCase()}: ${mensaje}`);
  }

  // Validaciones de contraseña
  validarPassword(): boolean {
    const { password, confirmPassword } = this.formData;
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      this.mostrarAlerta(
        'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.',
        'danger'
      );
      return false;
    }

    if (password !== confirmPassword) {
      this.mostrarAlerta('Las contraseñas no coinciden.', 'danger');
      return false;
    }

    return true;
  }

  // Registro del usuario
  registrarUsuario(): void {
    const { name, email, username, password } = this.formData;

    // Validación
    if (!name || !email || !username || !password) {
      this.mostrarAlerta(
        'Por favor completa todos los campos correctamente.',
        'danger'
      );
      return;
    }

    if (!this.validarPassword()) {
      return;
    }

    // Verificar si el usuario ya existe
    const usuarios = this.localStorageService.getItem('usuarios') || [];
    const usuarioExistente = usuarios.find(
      (user: any) => user.email === email || user.username === username
    );

    if (usuarioExistente) {
      this.mostrarAlerta('El usuario ya existe.', 'danger');
      return;
    }

    // Registrar usuario
    usuarios.push({ name, email, username, password });
    this.localStorageService.setItem('usuarios', usuarios);

    this.mostrarAlerta('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
    this.router.navigate(['/login']);
  }
}
