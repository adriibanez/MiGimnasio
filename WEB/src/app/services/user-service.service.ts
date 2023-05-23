import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { StaffResponse } from '../models/staff.response.model';
import { UserResponse } from '../models/user.response.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  
  constructor(private http: HttpClient) { }

  // public getStaff(): Observable<any>{
  //   return this.http.get<StaffResponse>(`${environment.API_URL}users`);
  // }

  registerUser(newUser :object) {
    return this.http.post(`${environment.API_URL}userAuth/register`, newUser);
  }
   deleteUserAccount(email :string): Observable<any>{
    return this.http.delete<UserResponse>(`${environment.API_URL}users/${email}`);
  }

   getMembresias(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}membresias`);
  }

  getUserRutinas(email:string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}routines/user/${email}`);
  }

  getUserPlannings(email:string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}plannings/user/${email}`);
  }

  actualizarUsuario(id: string, user: object): Observable<any> {
    return this.http.put(`${environment.API_URL}users/${id}`, user);
  }

  
}
