import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisCursosComponent } from './mis-cursos.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CursosService } from '../../services/cursos.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('MisCursosComponent', () => {
  let component: MisCursosComponent;
  let fixture: ComponentFixture<MisCursosComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockCursosService: jasmine.SpyObj<CursosService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);
    mockCursosService = jasmine.createSpyObj('CursosService', ['getCursos', 'updateCursos']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MisCursosComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: CursosService, useValue: mockCursosService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MisCursosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('loadCursosInscritos', () => {
    it('should redirect to login if no user is logged in', () => {
      mockAuthService.getUser.and.returnValue(null);
      component.loadCursosInscritos();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should load enrolled courses for the logged-in user', () => {
      const mockUser = { username: 'testuser' };
      const mockCategories = [
        {
          id: '1',
          name: 'Category 1',
          courses: [
            { name: 'Course 1', inscritos: ['testuser'] },
            { name: 'Course 2', inscritos: [] },
          ],
        },
        {
          id: '2',
          name: 'Category 2',
          courses: [{ name: 'Course 3', inscritos: ['testuser'] }],
        },
      ];

      mockAuthService.getUser.and.returnValue(mockUser);
      mockUserService.getUsers.and.returnValue(of([]));
      mockCursosService.getCursos.and.returnValue(of(mockCategories));

      component.loadCursosInscritos();

      expect(component.cursosInscritos.length).toBe(2);
      expect(component.cursosInscritos).toEqual([
        { name: 'Course 1', inscritos: ['testuser'] },
        { name: 'Course 3', inscritos: ['testuser'] },
      ]);
    });

    it('should show an error if courses cannot be loaded', () => {
      spyOn(Swal, 'fire');
      mockAuthService.getUser.and.returnValue({ username: 'testuser' });
      mockUserService.getUsers.and.returnValue(of([]));
      mockCursosService.getCursos.and.returnValue(throwError(() => new Error('Error')));

      component.loadCursosInscritos();

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los cursos inscritos.',
        })
      );
    });
  });  

  describe('eliminarCurso', () => {
    it('should remove a course and update the backend', () => {
      spyOn(Swal, 'fire');
      const mockUser = { username: 'testuser' };
      const mockCategories = [
        {
          id: '1',
          name: 'Category 1',
          courses: [
            { name: 'Course 1', inscritos: ['testuser'] },
            { name: 'Course 2', inscritos: [] },
          ],
        },
      ];

      mockAuthService.getUser.and.returnValue(mockUser);
      mockCursosService.getCursos.and.returnValue(of(mockCategories));
      mockCursosService.updateCursos.and.returnValue(of({}));

      component.cursosInscritos = [{ name: 'Course 1', inscritos: ['testuser'] }];
      component.eliminarCurso(0);

      expect(component.cursosInscritos.length).toBe(0);
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'success',
          title: 'Curso eliminado',
          text: `Has eliminado el curso: Course 1`,
        })
      );
    });

    it('should show an error if course cannot be removed', () => {
      spyOn(Swal, 'fire');
      const mockUser = { username: 'testuser' };
      const mockCategories = [
        {
          id: '1',
          name: 'Category 1',
          courses: [{ name: 'Course 1', inscritos: ['testuser'] }],
        },
      ];

      mockAuthService.getUser.and.returnValue(mockUser);
      mockCursosService.getCursos.and.returnValue(of(mockCategories));
      mockCursosService.updateCursos.and.returnValue(throwError(() => new Error('Error')));

      component.cursosInscritos = [{ name: 'Course 1', inscritos: ['testuser'] }];
      component.eliminarCurso(0);

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el curso. Inténtalo nuevamente.',
        })
      );
    });
  });
});
