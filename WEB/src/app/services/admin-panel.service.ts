import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environment/environment';
import { StaffResponse } from '../models/staff.response.model';
import { UserResponse } from '../models/user.response.model';
import { Staff } from '../models/staff.model';
import { StaffCreate } from '../models/staff.create.model';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {


  constructor(private http: HttpClient) { }

//-----------------STAFF--------------------

  public getStaff(): Observable<any>{
    return this.http.get<StaffResponse>(`${environment.API_URL}staff`);
  }

  postNewStaff(newStaff :object) {
    return this.http.post(`${environment.API_URL}staffAuth/register`, newStaff);
  }
  public deleteStaff(email :string): Observable<any>{
    return this.http.delete<StaffResponse>(`${environment.API_URL}staff/${email}`);
  }

//-----------------USERS--------------------


  public getUsers(): Observable<any>{
    return this.http.get<UserResponse>(`${environment.API_URL}users`);
  }


  public deleteUser(email :string): Observable<any>{
    return this.http.delete<UserResponse>(`${environment.API_URL}users/${email}`);
  }

  //-----------------MEMBRESIAS--------------------

  public getMembresias(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}membresias`);
  }

  postNewMembresia(newMembresia :object) {
    return this.http.post(`${environment.API_URL}membresias`, newMembresia);
  }

  updateMembresia(idMembresia:string,updatedMembresia :any) {
    return this.http.patch(`${environment.API_URL}membresias/${idMembresia}`, updatedMembresia);
  }

  public deleteMembresia(nombre :string): Observable<any>{
    return this.http.delete<any>(`${environment.API_URL}membresias/${nombre}`);
  }

  public deleteVentajaDeMembresia(membresia :string,ventaja:string): Observable<any>{
    return this.http.delete<any>(`${environment.API_URL}membresias/${membresia}/ventajas/${ventaja}`);
  }


  public getVentajasDeMembresia(nombre :string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}membresias/${nombre}/ventajas`);
  }

  postNewVentaja(nombreMembresia:string,ventaja :any) {
    return this.http.post(`${environment.API_URL}membresias/${nombreMembresia}/ventajas`, ventaja);
  }
  

  
}
