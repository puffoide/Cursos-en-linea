import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../../shared/local-storage.service';
import Swal from 'sweetalert2';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);

    // Configurar el mock para devolver un usuario ficticio
    localStorageServiceSpy.getItem.and.callFake((key: string) => {
      if (key === 'usuarioLogueado') {
        return { name: 'Test User', email: 'testuser@example.com', username: 'testuser' };
      }
      return [];
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PerfilComponent], // Mover de declarations a imports
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the form with current user data', () => {
    expect(component.profileForm.get('name')?.value).toBe('Test User');
    expect(component.profileForm.get('email')?.value).toBe('testuser@example.com');
  });

  it('should reset form and disable fields when edit mode is toggled off', () => {
    component.toggleEditMode(); // Activar modo edición
    component.profileForm.patchValue({
      name: 'New User',
      email: 'newuser@example.com',
    });

    component.toggleEditMode(); // Desactivar modo edición

    expect(component.profileForm.get('name')?.value).toBe('Test User');
    expect(component.profileForm.get('email')?.value).toBe('testuser@example.com');
    expect(component.profileForm.get('name')?.disabled).toBeTrue();
  });

  it('should update user data in localStorage on valid submit', () => {
    const swalSpy = spyOn(Swal, 'fire');
    
    // Mock data
    const mockUsuarios = [
      { name: 'Test User', email: 'testuser@example.com', username: 'testuser', password: 'OldPassword1!' },
      { name: 'Another User', email: 'anotheruser@example.com', username: 'anotheruser', password: 'OldPassword2!' },
    ];
  
    // Configure the mock
    localStorageServiceSpy.getItem.and.callFake((key: string) => {
      if (key === 'usuarios') return mockUsuarios;
      if (key === 'usuarioLogueado') return mockUsuarios[0];
      return null;
    });
  
    component.toggleEditMode(); // Activate edit mode
    component.profileForm.patchValue({
      name: 'Updated User',
      email: 'updateduser@example.com',
      password: 'NewPassword1!',
      confirmPassword: 'NewPassword1!',
    });
  
    component.onSubmit(); 
  
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith(
      'usuarios',
      jasmine.arrayContaining([
        jasmine.objectContaining({
          name: 'Updated User',
          email: 'updateduser@example.com',
          username: 'testuser',
          password: 'NewPassword1!',
        }),
      ])
    );
  
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith(
      'usuarioLogueado',
      jasmine.objectContaining({
        name: 'Updated User',
        email: 'updateduser@example.com',
        username: 'testuser',
        password: 'NewPassword1!',
      })
    );
  
    // Verify Swal.fire was called
    expect(swalSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
        title: 'Éxito',
        text: 'Perfil actualizado correctamente.',
      })
    );
  });
  
});
