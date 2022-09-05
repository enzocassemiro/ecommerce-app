import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl:string = "http://localhost:3000/users"

  getUserInfoById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`)
  }

}
