import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  private jsonUrl = 'https://mibucketfullstackiis3.s3.us-east-1.amazonaws.com/cursos.json';

  constructor(private http: HttpClient) {}

  /**
   * @description Obtiene la lista completa de categorías y cursos desde el JSON.
   */
  getCursos(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }

  /**
   * @description Actualiza el archivo JSON completo.
   * Utilizado para actualizar varias categorías o cursos a la vez.
   */
  updateCursos(categories: any[]): Observable<any> {
    return this.http.put(this.jsonUrl, categories, this.httpOptions);
  }

  /**
   * @description Agrega un nuevo curso en una categoría específica.
   */
  addCurso(categoryId: string, course: any): Observable<any> {
    return this.getCursos().pipe(
      switchMap((categories: any[]) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category) {
          category.courses.push(course);
        }
        return this.updateCursos(categories);
      })
    );
  }

  /**
   * @description Edita un curso en una categoría específica.
   */
  editCurso(categoryId: string, courseId: number, updatedCourse: any): Observable<any> {
    return this.getCursos().pipe(
      switchMap((categories: any[]) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category && category.courses[courseId]) {
          category.courses[courseId] = updatedCourse;
        }
        return this.updateCursos(categories);
      })
    );
  }

  /**
   * @description Elimina un curso en una categoría específica.
   */
  deleteCurso(categoryId: string, courseId: number): Observable<any> {
    return this.getCursos().pipe(
      switchMap((categories: any[]) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category && category.courses[courseId]) {
          category.courses.splice(courseId, 1);
        }
        return this.updateCursos(categories);
      })
    );
  }
}
