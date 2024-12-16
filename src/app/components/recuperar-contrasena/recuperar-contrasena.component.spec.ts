import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('RecuperarContrasenaComponent', () => {
  let component: RecuperarContrasenaComponent;
  let fixture: ComponentFixture<RecuperarContrasenaComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [RecuperarContrasenaComponent, ReactiveFormsModule], // Importar el componente standalone
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancel', () => {
    it('should navigate to login when cancel is clicked', () => {
      component.onCancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('onSubmit', () => {
    it('should show error if the email is invalid', () => {
      spyOn(Swal, 'fire');
      component.forgotPasswordForm.setValue({ email: 'invalidemail' });

      component.onSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, introduce un correo electrónico válido.',
        })
      );
    });

    it('should show success alert and navigate to login if email exists', async () => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

      const mockUsers = [{ email: 'test@example.com' }];
      mockUserService.getUsers.and.returnValue(of(mockUsers));

      component.forgotPasswordForm.setValue({ email: 'test@example.com' });
      await component.onSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Se ha enviado un enlace para recuperar tu contraseña.',
        })
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show error alert if email does not exist', () => {
      spyOn(Swal, 'fire');

      mockUserService.getUsers.and.returnValue(of([]));

      component.forgotPasswordForm.setValue({ email: 'notfound@example.com' });
      component.onSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Correo no encontrado',
          text: 'El correo ingresado no está registrado.',
        })
      );
    });

    it('should show error alert if getUsers throws an error', () => {
      spyOn(Swal, 'fire');

      mockUserService.getUsers.and.returnValue(throwError(() => new Error('Error')));

      component.forgotPasswordForm.setValue({ email: 'test@example.com' });
      component.onSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo procesar la solicitud. Inténtalo más tarde.',
        })
      );
    });
  });

  it('should validate email field correctly', () => {
    const emailControl = component.forgotPasswordForm.get('email');
  
    emailControl?.setValue('invalidemail');
    emailControl?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBeTrue();
  
    emailControl?.setValue('valid@example.com');
    emailControl?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBeFalse();
  });  
});
