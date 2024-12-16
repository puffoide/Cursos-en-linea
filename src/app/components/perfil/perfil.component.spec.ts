import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'updateUser']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PerfilComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('loadCurrentUser', () => {
    it('should load current user data into the form', () => {
      const mockLoggedInUser = { username: 'testuser', email: 'testuser@example.com' };
      const mockUsers = [
        { username: 'testuser', email: 'testuser@example.com', name: 'Test User' },
      ];

      mockAuthService.getUser.and.returnValue(mockLoggedInUser);
      mockUserService.getUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.currentUser).toEqual(mockUsers[0]);
      expect(component.profileForm.get('name')?.value).toBe('Test User');
      expect(component.profileForm.get('email')?.value).toBe('testuser@example.com');
    });

    it('should show an error if user is not found', () => {
      spyOn(Swal, 'fire');
      const mockLoggedInUser = { username: 'testuser', email: 'testuser@example.com' };

      mockAuthService.getUser.and.returnValue(mockLoggedInUser);
      mockUserService.getUsers.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.currentUser).toBeUndefined();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'El usuario no fue encontrado en el sistema.',
        })
      );
    });

    it('should show an error if user data cannot be loaded', () => {
      spyOn(Swal, 'fire');

      mockAuthService.getUser.and.returnValue({ username: 'testuser' });
      mockUserService.getUsers.and.returnValue(throwError(() => new Error('Error')));

      component.ngOnInit();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el perfil del usuario.',
        })
      );
    });
  });

  describe('onSubmit', () => {
    it('should successfully update user data', () => {
      spyOn(Swal, 'fire');
      const mockUser = { username: 'testuser', email: 'testuser@example.com', name: 'Test User' };

      mockAuthService.getUser.and.returnValue(mockUser);
      mockUserService.updateUser.and.returnValue(of({}));

      component.currentUser = mockUser;
      component.toggleEditMode();
      component.profileForm.patchValue({
        name: 'Updated User',
        email: 'updateduser@example.com',
        password: 'NewPassword1!',
        confirmPassword: 'NewPassword1!',
      });

      component.onSubmit();

      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        jasmine.objectContaining({
          username: 'testuser',
          name: 'Updated User',
          email: 'updateduser@example.com',
          password: 'NewPassword1!',
        })
      );

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Tus cambios han sido guardados exitosamente.',
        })
      );

      expect(component.isEditing).toBeFalse();
    });

    it('should show an error if update fails', () => {
      spyOn(Swal, 'fire');
      const mockUser = { username: 'testuser', email: 'testuser@example.com', name: 'Test User' };

      mockAuthService.getUser.and.returnValue(mockUser);
      mockUserService.updateUser.and.returnValue(throwError(() => new Error('Error')));

      component.currentUser = mockUser;
      component.toggleEditMode();
      component.profileForm.patchValue({
        name: 'Updated User',
        email: 'updateduser@example.com',
        password: 'NewPassword1!',
        confirmPassword: 'NewPassword1!',
      });

      component.onSubmit();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el perfil. Inténtalo nuevamente.',
        })
      );
    });
    
  });

  describe('toggleEditMode', () => {
    it('should enable form fields in edit mode', () => {
      component.toggleEditMode();

      expect(component.isEditing).toBeTrue();
      expect(component.profileForm.get('name')?.enabled).toBeTrue();
      expect(component.profileForm.get('email')?.enabled).toBeTrue();
    });

    it('should reset form and disable fields when edit mode is toggled off', () => {
      component.currentUser = { name: 'Test User', email: 'testuser@example.com' };
      component.toggleEditMode(); // Activate edit mode
      component.profileForm.patchValue({
        name: 'Updated User',
        email: 'updateduser@example.com',
      });

      component.toggleEditMode(); // Deactivate edit mode

      expect(component.profileForm.get('name')?.value).toBe('Test User');
      expect(component.profileForm.get('email')?.value).toBe('testuser@example.com');
      expect(component.profileForm.get('name')?.disabled).toBeTrue();
    });
  });
});
