import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { UserResponse } from '../models/user.response.model';

@Injectable({
  providedIn: 'root'
})
export class StaffPanelService {

  constructor(private http: HttpClient) { }

   getUsers(): Observable<any>{
    return this.http.get<UserResponse>(`${environment.API_URL}users`);
  }

  //ENTRENADOR
   getRutinas(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}routines`);
  }

  getRutinasPorEmpleado(emailEmpleado:string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}routines/emp/${emailEmpleado}`);
  }

  postNewRoutine(newRoutine:object) {
    return this.http.post(`${environment.API_URL}routines`, newRoutine);
  }
  updateRutina(idRutina:string,updatedRutina :any) {
    return this.http.patch(`${environment.API_URL}routines/${idRutina}`, updatedRutina);
  }

   deleteRutina(nombre :string): Observable<any>{
    return this.http.delete<any>(`${environment.API_URL}routines/${nombre}`);
  }

   deleteEjercicioDeRutina(rutina :string,ejercicio:string): Observable<any>{
    return this.http.delete<any>(`${environment.API_URL}routines/${rutina}/exercises/${ejercicio}`);
  }

  postNewEjercicio(nombreRutina:string,ejercicio :any) {
    return this.http.post(`${environment.API_URL}routines/${nombreRutina}/exercises`, ejercicio);
  }
  

  
  //NUTRICIONISTA
   getPlannings(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}plannings`);
  }

  getPlanningsPorEmpleado(emailEmpleado:string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}plannings/emp/${emailEmpleado}`);
  }

  postNewPlanning(newPlanning:object) {
    return this.http.post(`${environment.API_URL}plannings`, newPlanning);
  }

  updatePlanning(idPlanning:string,updatedPlanning :any) {
    return this.http.patch(`${environment.API_URL}plannings/${idPlanning}`, updatedPlanning);
  }

   deletePlanning(nombre :string): Observable<any>{
    return this.http.delete<any>(`${environment.API_URL}plannings/${nombre}`);
  }

   deleteComidaDePlanning(planning :string,comida:string): Observable<any>{
    return this.http.delete<any>(`${environment.API_URL}plannings/${planning}/foods/${comida}`);
  }

  postNewComida(nombrePlanning:string,comida :any) {
    return this.http.post(`${environment.API_URL}plannings/${nombrePlanning}/foods`, comida);
  }
}
