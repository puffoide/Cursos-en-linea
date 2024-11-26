import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn$', 'logout']);
    authServiceSpy.isLoggedIn$.and.returnValue(of(false)); 

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent, 
        RouterTestingModule, 
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to isLoggedIn$ on init', () => {
    expect(authServiceSpy.isLoggedIn$).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse(); 
  });

  it('should call logout on authService when logout is triggered', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should set isLoggedIn to true if the user is logged in', () => {
    
    authServiceSpy.isLoggedIn$.and.returnValue(of(true));
    component.ngOnInit(); 
    expect(component.isLoggedIn).toBeTrue();
  });
});
