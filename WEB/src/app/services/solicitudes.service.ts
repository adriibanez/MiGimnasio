import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(private http: HttpClient) { }

  public getSolicitudes(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}solicitudes/`);
  }
  public getEmpleadoSolicitudes(emailEmpleado:string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}solicitudes/empleado/${emailEmpleado}`);
  }
  public getUserSolicitudes(emailUsuario:string): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}solicitudes/user/${emailUsuario}`);
  }

  postNewSolicitud(newSolicitud :object) {
    return this.http.post(`${environment.API_URL}solicitudes/`, newSolicitud);
  }

  actualizarEstadoSolicitud(idSolicitud: string, solicitud: any) {
    return this.http.put(`${environment.API_URL}solicitudes/${idSolicitud}`, solicitud);
  }
}
