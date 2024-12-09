import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { Router } from '@angular/router';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser', 'isLoggedIn']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize categories correctly', () => {
    expect(component.categories.length).toBeGreaterThan(0);
  });

  it('should sync enrolled courses on initialization', () => {
    const mockUser = { username: 'testuser' };
    const mockCourses = [
      { nombre: 'Python para Principiantes', descripcion: '', profesor: '', precio: '' },
    ];

    mockAuthService.getUser.and.returnValue(mockUser);
    mockLocalStorageService.getItem.and.returnValue({ testuser: mockCourses });

    component.ngOnInit();

    const enrolledCourse = component.categories[0].courses.find(
      (course: any) => course.name === 'Python para Principiantes'
    );
    expect(enrolledCourse?.isEnrolled).toBeTrue();
  });

  it('should enroll a course and save it in localStorage', () => {
    const mockUser = { username: 'testuser' };
    mockAuthService.getUser.and.returnValue(mockUser);
    mockLocalStorageService.getItem.and.returnValue({});

    const courseToEnroll = component.categories[0].courses[0]; 
    component.inscribirCurso(courseToEnroll);

    expect(courseToEnroll.isEnrolled).toBeTrue();
    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('inscripcionesPorUsuario', {
      testuser: [
        {
          nombre: courseToEnroll.name,
          descripcion: courseToEnroll.description,
          profesor: courseToEnroll.profesor,
          precio: courseToEnroll.precio,
        },
      ],
    });
  });

  it('should select a category and display it correctly', () => {
    const categoryId = 'programacion';
    component.showCategory(categoryId);

    expect(component.selectedCategory?.id).toBe(categoryId);
  });
});