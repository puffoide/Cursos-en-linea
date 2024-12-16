import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CursosService } from './cursos.service';

describe('CursosService', () => {
  let service: CursosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
    });
    service = TestBed.inject(CursosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
