import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule],
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = usuarios.find(
      (u: any) =>
        (u.email === this.usernameOrEmail || u.username === this.usernameOrEmail) &&
        u.password === this.password
    );

    if (user) {
      this.authService.login(user);
      alert('Inicio de sesión exitoso. Redirigiendo...');
      this.router.navigate(['/index']);
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }
}
