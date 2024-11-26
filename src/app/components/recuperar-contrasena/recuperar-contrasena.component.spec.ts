import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import Swal from 'sweetalert2';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';

describe('RecuperarContrasenaComponent', () => {
  let component: RecuperarContrasenaComponent;
  let fixture: ComponentFixture<RecuperarContrasenaComponent>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const localStorageMock = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecuperarContrasenaComponent, ReactiveFormsModule], // Importar el componente standalone
      providers: [
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaComponent);
    component = fixture.componentInstance;
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error alert if email is invalid', () => {
    const swalSpy = spyOn(Swal, 'fire');
    component.forgotPasswordForm.setValue({ email: 'invalidemail' });

    component.onSubmit();

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, introduce un correo electrónico válido.',
      })
    );
  });

  it('should show success alert and navigate to login if email exists', async () => {
    // Mockear Swal.fire para devolver una promesa resuelta
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );
  
    // Mockear LocalStorageService para devolver un correo registrado
    localStorageServiceSpy.getItem.and.returnValue([
      { email: 'test@example.com' },
    ]);
  
    // Establecer un correo válido en el formulario
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
  
    // Ejecutar el método onSubmit y esperar a que las promesas se resuelvan
    await component.onSubmit();
  
    // Verificar que Swal.fire fue llamado con los parámetros correctos
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Se ha enviado un enlace para recuperar tu contraseña.',
      })
    );
  
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
  

  it('should show error alert if email does not exist', () => {
    const swalSpy = spyOn(Swal, 'fire');
    localStorageServiceSpy.getItem.and.returnValue([]);
    component.forgotPasswordForm.setValue({ email: 'notfound@example.com' });

    component.onSubmit();

    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Correo no encontrado',
        text: 'El correo ingresado no está registrado.',
      })
    );
  });
});
