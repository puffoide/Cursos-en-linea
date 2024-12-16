import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing'; // Asegúrate de usarlo correctamente
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Necesario para HttpClient
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Mock para AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Componente standalone
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]), // Configura rutas de prueba
        HttpClientTestingModule, // Mock para HttpClient
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    const form = component.loginForm.value;
    expect(form.usernameOrEmail).toBe('');
    expect(form.password).toBe('');
  });

  it('should call AuthService.login and navigate on successful login', () => {
    const mockUser = { username: 'testuser', email: 'testuser@example.com' };
    mockAuthService.login.and.returnValue(of(mockUser));

    component.loginForm.setValue({ usernameOrEmail: 'testuser', password: 'password123' });
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      usernameOrEmail: 'testuser',
      password: 'password123',
    });
  });

  it('should display an error message if login fails', () => {
    spyOn(Swal, 'fire');
    mockAuthService.login.and.returnValue(of(null));

    component.loginForm.setValue({ usernameOrEmail: 'wronguser', password: 'wrongpassword' });
    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
        icon: 'error',
      })
    );
  });

  it('should display a server error message if login API throws an error', () => {
    spyOn(Swal, 'fire');
    mockAuthService.login.and.returnValue(throwError(() => new Error('Server Error')));

    component.loginForm.setValue({ usernameOrEmail: 'testuser', password: 'password123' });
    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Error',
        text: 'No se pudo completar la solicitud.',
        icon: 'error',
      })
    );
  });
});
