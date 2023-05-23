import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of,tap } from 'rxjs';
import { environment } from '../environment/environment';
import { UserResponse } from '../models/user.response.model';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  //getter y setter de usuario por token
   
  constructor(private http: HttpClient,private localService:LocalStorageService) { }

  

  // public getStaff(): Observable<any>{
  //   return this.http.get<StaffResponse>(`${environment.API_URL}users`);
  // }

  // loginUser(user :object) {
  //   return this.http.post<any>('http://localhost:8001/api/userAuth/login', user);
  // }

  loginUser(user:any): Observable<any> {


    const formHeaders = {
     headers: new HttpHeaders({
     'Content-Type': 'application/json'
  })};
  
    return this.http.post<any>(`${environment.API_URL}userAuth/login`, user, formHeaders).pipe(
     tap(jwt => {
     if (jwt.token) {
      console.log("SET TOKEN AUTH SERVICE");
     localStorage.setItem('token', jwt.token);
     }
     return jwt;
     })
    );

  }
  

  loginStaff(staff :object) {
    return this.http.post<any>(`${environment.API_URL}staffAuth/login`, staff);
  }

}


