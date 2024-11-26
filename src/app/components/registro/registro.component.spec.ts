import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistroComponent } from './registro.component';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../shared/local-storage.service';
import { Router } from '@angular/router';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
      'setItem',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, RegistroComponent], 
      providers: [{ provide: LocalStorageService, useValue: localStorageSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    localStorageServiceSpy = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.registerForm;
    expect(form.get('name')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('username')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('confirmPassword')?.value).toBe('');
  });

  it('should navigate to login after successful registration', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false })
    );
  
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
  
    localStorageServiceSpy.getItem.and.returnValue([]);
    component.registerForm.setValue({
      name: 'Test User',
      email: 'testuser@example.com',
      username: 'testuser',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    });
  
    await component.onSubmit();
  
    expect(Swal.fire).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });


});
