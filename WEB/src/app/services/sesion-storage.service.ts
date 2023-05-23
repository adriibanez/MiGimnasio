import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SesionStorageService {

  constructor() { }

  getUser():any{
    return sessionStorage.getItem('user');
  }

  setUser(user:object){
    sessionStorage.setItem('user',JSON.stringify(user));
  }
  
  getStaff(){
    return sessionStorage.getItem('staff');
  }

  setStaff(staff:object){
    sessionStorage.setItem('staff',JSON.stringify(staff));
  }

  limpiarSesion(){
    sessionStorage.clear();
  }
  
}
