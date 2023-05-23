import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setToken(token:string){
    localStorage.setItem('token',token);
  }

  getToken(): Observable<string | null> {
    return from(
      new Promise<string | null>((resolve) => {
        const token = localStorage.getItem('token');
        resolve(token);
      })
    );
  }
 
  limpiarLocal(){
    localStorage.clear();
  }


}
