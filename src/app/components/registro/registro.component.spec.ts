import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './registro.component';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [
        RegistroComponent, // Componente standalone
        ReactiveFormsModule,
        RouterTestingModule, // Sustituye RouterModule por RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      const form = component.registerForm;
      expect(form.get('name')?.value).toBe('');
      expect(form.get('email')?.value).toBe('');
      expect(form.get('username')?.value).toBe('');
      expect(form.get('password')?.value).toBe('');
      expect(form.get('confirmPassword')?.value).toBe('');
    });
  });

  describe('onSubmit', () => {
    it('should show error if the form is invalid', () => {
      spyOn(Swal, 'fire');
      component.registerForm.setValue({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });

      component.onSubmit();

      expect(Swal.fire).not.toHaveBeenCalled();
      expect(userServiceSpy.registerUser).not.toHaveBeenCalled();
    });

    it('should validate matching passwords', () => {
      const form = component.registerForm;
      form.setValue({
        name: 'Test User',
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'Password1!',
        confirmPassword: 'MismatchPassword1!',
        role: 'user',
      });

      const confirmPasswordControl = form.get('confirmPassword');
      component.matchPasswords('password', 'confirmPassword')(form);

      expect(confirmPasswordControl?.errors).toEqual({ noMatch: true });
    });
  });
});
