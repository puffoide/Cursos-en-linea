import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { IndexComponent } from './index.component';
import { CursosService } from '../../services/cursos.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCursosService: jasmine.SpyObj<CursosService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser', 'isLoggedIn']);
    mockCursosService = jasmine.createSpyObj('CursosService', ['getCursos', 'updateCursos', 'addCurso', 'editCurso', 'deleteCurso']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IndexComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CursosService, useValue: mockCursosService },
        { provide: Router, useValue: mockRouter },
        CursosService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if user is not authenticated when enrolling a course', () => {
    mockAuthService.getUser.and.returnValue(null);

    component.inscribirCurso({ name: 'Curso Test', inscritos: [] });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display a selected category correctly', () => {
    const mockCategories = [
      { id: 'programacion', name: 'Programación', courses: [] },
      { id: 'arte', name: 'Arte', courses: [] },
    ];
    component.categories = mockCategories;

    component.showCategory('arte');

    expect(component.selectedCategory?.id).toBe('arte');
  });
});
