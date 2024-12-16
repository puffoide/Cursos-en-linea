import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://mibucketfullstackiis3.s3.us-east-1.amazonaws.com/user.json';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Registrar un nuevo usuario
  registerUser(user: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) => {
        users.push(user);
        return users;
      }),
      switchMap((updatedUsers) => {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(this.apiUrl, updatedUsers, { headers });
      })
    );
  }
  
  updateUser(updatedUser: any): Observable<any> {
    return this.getUsers().pipe(
      map((users) => {
        const userIndex = users.findIndex((u: any) => u.username === updatedUser.username);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
        }
        return users;
      }),
      switchMap((updatedUsers) => {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(this.apiUrl, updatedUsers, { headers });
      })
    );
  }
  

  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users) =>
        users.find(
          (u) =>
            (u.email === credentials.usernameOrEmail || u.username === credentials.usernameOrEmail) &&
            u.password === credentials.password
        )
      )
    );
  }
  
  // Verificar si un usuario existe (opcional, dependiendo del backend)
  checkUserExists(email: string, username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/exists?email=${email}&username=${username}`);
  }

  checkUserCredentials(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
        map((users) =>
            users.find(
                (u) =>
                    (u.email === credentials.usernameOrEmail || u.username === credentials.usernameOrEmail) &&
                    u.password === credentials.password
            )
        )
    );
}

}
