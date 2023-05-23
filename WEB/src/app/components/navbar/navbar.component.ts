import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'gym-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isLogued:boolean= false;
  isAdmin:boolean = false;
  isUser:boolean= false;
  isNutricionista:boolean= false;
  isEntrenador:boolean= false;
  
  constructor(private sessionService: SesionStorageService,private localService:LocalStorageService,private router :Router,private sharedService: SharedService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.checkIsLogued();
    this.checkIsAdmin();
    this.checkIsUser();
    this.checkIsNutri();
    this.checkIsEntrenador();
    console.log(this.isLogued);
    console.log(this.isAdmin);
    console.log(this.isUser);
    console.log(this.isNutricionista);
    console.log(this.isEntrenador);

    this.sharedService.ngInit$.subscribe(() => {
      // Llama al método ngOnInit del componente Navbar
      console.log("ngoninit");
      this.ngOnInit();
    });
  }


  checkIsLogued(){
    if( this.localService.getToken() && (this.sessionService.getStaff() || this.sessionService.getUser())){
      this.isLogued = true;
      console.log("logued");
    }
    else{
      this.sessionService.limpiarSesion();
      this.localService.limpiarLocal();
      this.isLogued = false;
      console.log("no logued");
    }
  }

  checkIsAdmin():void{
     let admin = this.sessionService.getStaff();

     if (admin !== null) {
     let cargo = (JSON.parse(admin).cargo);
        if (cargo === 'admin') {
          console.log("admin");
          this.isAdmin = true;
        }else{
          this.isAdmin = false;
          this.router.navigate(["/adminPanel"]);
        }
     } else {
      console.log("no admin");
      this.isAdmin = false;
       
     }
  }

  checkIsUser():void{
    let user = this.sessionService.getUser();

    if (user !== null) {
      console.log("user");
      this.isUser = true;
      this.router.navigate(["/perfil"]);

    } else {
      console.log("no user");
      this.isUser = false;
      
    }
 }

 checkIsNutri():void{
  let staff = this.sessionService.getStaff();

  if (staff !== null) {
    let cargo = (JSON.parse(staff).cargo);
    // console.log(cargo);
        if (cargo === 'nutricionista') {
          console.log("nutri");
          this.isNutricionista = true;
          this.router.navigate(["/nutricionista"]);
        }else{
          this.isNutricionista = false;
        }
  } else {
    console.log("no nutri");
    this.isNutricionista = false;
    
  }
}

checkIsEntrenador():void{
  let staff = this.sessionService.getStaff();

  if (staff !== null) {
    let cargo = (JSON.parse(staff).cargo);
    console.log(cargo);
        if (cargo === 'entrenador') {
          console.log("entren");
          this.isEntrenador = true;
          this.router.navigate(["/entrenador"]);
        }else{
          this.isEntrenador = false;
        }
  } else {
    console.log("no entre");
    this.isEntrenador = false;
    
  }
}

  logOut(){
    if(this.isLogued){
      this.sessionService.limpiarSesion();
      this.localService.limpiarLocal();
      this.router.navigate(['/userLogin']);
      this.ngOnInit();
      this.snackBar.open('Se ha cerrado su sesión', undefined, { duration: 1000, panelClass:['orange-snackbar']});

    }
  }


   
    
  
}
