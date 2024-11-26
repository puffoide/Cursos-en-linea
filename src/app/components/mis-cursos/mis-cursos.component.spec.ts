import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import { MisCursosComponent } from './mis-cursos.component';

describe('MisCursosComponent', () => {
  let component: MisCursosComponent;
  let fixture: ComponentFixture<MisCursosComponent>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const localStorageMock = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MisCursosComponent],
      providers: [
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MisCursosComponent);
    component = fixture.componentInstance;
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if user is not logged in', () => {
    localStorageServiceSpy.getItem.and.returnValue(null);
    component.loadCursosInscritos();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load enrolled courses for logged-in user', () => {
    const mockUser = { username: 'testuser' };
    const mockCourses = [
      { nombre: 'Curso 1', descripcion: 'Desc 1', profesor: 'Prof 1', precio: '1000' },
      { nombre: 'Curso 2', descripcion: 'Desc 2', profesor: 'Prof 2', precio: '2000' },
    ];

    localStorageServiceSpy.getItem.and.callFake((key: string) => {
      if (key === 'usuarioLogueado') return mockUser;
      if (key === 'inscripcionesPorUsuario') return { testuser: mockCourses };
      return null;
    });

    component.loadCursosInscritos();

    expect(component.cursosInscritos.length).toBe(2);
    expect(component.cursosInscritos).toEqual(mockCourses);
  });

  it('should log course entry on asistirCurso call', () => {
    spyOn(console, 'log');
    const mockCurso = { nombre: 'Curso de Prueba' };
    component.asistirCurso(mockCurso);

    expect(console.log).toHaveBeenCalledWith('Ingresando al curso: Curso de Prueba');
  });

  it('should remove a course and update localStorage on eliminarCurso call', () => {
    const mockUser = { username: 'testuser' };
    const mockCourses = [
      { nombre: 'Curso 1', descripcion: 'Desc 1', profesor: 'Prof 1', precio: '1000' },
      { nombre: 'Curso 2', descripcion: 'Desc 2', profesor: 'Prof 2', precio: '2000' },
    ];

    localStorageServiceSpy.getItem.and.callFake((key: string) => {
      if (key === 'usuarioLogueado') return mockUser;
      if (key === 'inscripcionesPorUsuario') return { testuser: mockCourses };
      return null;
    });

    component.loadCursosInscritos();
    component.eliminarCurso(0);

    expect(component.cursosInscritos.length).toBe(1);
    expect(component.cursosInscritos[0].nombre).toBe('Curso 2');
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith('inscripcionesPorUsuario', {
      testuser: [{ nombre: 'Curso 2', descripcion: 'Desc 2', profesor: 'Prof 2', precio: '2000' }],
    });
  });
});
