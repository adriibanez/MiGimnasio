import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';
import { isValid, isNIF, isNIE, ctrlChar } from "better-dni";
import { Title } from '@angular/platform-browser';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
const IBAN = require('iban');


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  user : any = [];


addUserForm: FormGroup;

membresia : any = [];

membresiaElegida:any ={};

constructor(private serviceService:SesionStorageService,private titleService:Title,private userService : UserServiceService,private snackBar:MatSnackBar,private router:Router){

  this.addUserForm = new FormGroup({
    dni: new FormControl('97517534H', [Validators.required]),
    name: new FormControl('Juan Ibañez', [Validators.required]),
   email: new FormControl('juan@gmail.com', [Validators.required,Validators.email]),
   password: new FormControl('password', [Validators.required]),
   fechaNacimiento: new FormControl('1998-05-01', [Validators.required]),
   numIban: new FormControl('ES9121000418450200051332', [Validators.required])
  });
}



ngOnInit(): void {
  if(this.serviceService.getUser() || this.serviceService.getStaff()){

    this.router.navigate(["/"]);
    this.snackBar.open("Ya has iniciado sesión, no puedes registrate", undefined, { duration: 2000 ,panelClass:['orange-snackbar']});


  }else{
    this.cambiarTitulo("MiGimnasio | Registro");
    this.getMembresiasData();
  }
  }

  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }

  irFormulario() {
    this.router.navigate(['/userRegister'], { fragment: 'formulario' });
  }


getMembresiasData(){
  this.userService.getMembresias().subscribe(res => {
    this.membresia = res;
   })
    
}

//CHOOSE MEMBRESIA
elegirMembresia(membresiaElegida:any){
  this.membresiaElegida = membresiaElegida;
  this.snackBar.open("Elegiste la suscripción " + membresiaElegida.nombre, undefined, { duration: 500 ,panelClass:['orange-snackbar']});
}


//REGISTER USER
onSubmit() {
  let newUser = this.addUserForm.value;

  if (
    !(isNIF(newUser.dni) || isNIE(newUser.dni)) &&
    !isValid(newUser.dni)
  ){
    this.snackBar.open('El dni no es válio', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    return;
  }

  if (!isNaN(newUser.name)){
    this.snackBar.open('El nombre no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    return;
  }

  if (!isNaN(newUser.numIban)){
    this.snackBar.open('El iban no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    return;
  }
  if (this.esMayorDe16(newUser.fechaNacimiento) === false){
    this.snackBar.open('La edad no llega a los 16 años', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    return;
  }
  if (!IBAN.isValid(newUser.numIban)){
    this.snackBar.open('El IBAN no es válido', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    return;
  }
  
  const fechaInscripcion = new Date().toLocaleDateString();
  newUser.fechaInscripcion = fechaInscripcion;
  newUser.membresia = this.membresiaElegida.nombre;


  this.userService.registerUser(newUser).subscribe({
    next: (v) => console.log(v),
    error: (e) => {console.log(e.error.error);
      this.snackBar.open(e.error.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    },
    complete: () => {console.log('Usuario registrado con éxito');
    this.snackBar.open('Te has registrado con éxito', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    this.router.navigate(["/userLogin"]);
    }
  });

}


esMayorDe16(fechaStr: string): boolean {
  const fechaNacimiento = new Date(fechaStr);
  const edadEnMilisegundos = Date.now() - fechaNacimiento.getTime();
  const edadEnAnios = Math.floor(edadEnMilisegundos / (1000 * 60 * 60 * 24 * 365));
  return edadEnAnios >= 16;
}
}
