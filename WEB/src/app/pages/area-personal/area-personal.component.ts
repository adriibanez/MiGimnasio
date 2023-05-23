import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-area-personal',
  templateUrl: './area-personal.component.html',
  styleUrls: ['./area-personal.component.css']
})
export class AreaPersonalComponent {

  empleadoLoginForm :FormGroup;

  constructor(private titleService:Title,private authService:AuthServiceService,private localService :LocalStorageService,private sessionService:SesionStorageService,private router:Router,private sharedService:SharedService,private snackBar:MatSnackBar) { 
    
    this.empleadoLoginForm = new FormGroup({
     email: new FormControl('admin@gmail.com', [Validators.required,Validators.email]),
     password: new FormControl('password', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.cambiarTitulo("MiGimnasio | Área de empleados");
  }

  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }
  

  onSubmit() {

    const staff = this.empleadoLoginForm.value;
   
    this.authService.loginStaff(staff).subscribe({
      next: (v) => {
        // this.localService.limpiarLocal();
        this.localService.limpiarLocal();
        this.sessionService.limpiarSesion();
        this.localService.setToken(v.token);
        this.sessionService.setStaff(v.staff);
        // location.reload();
        this.sharedService.emitNgInit();

        this.router.navigate(['/']);
        this.snackBar.open('Iniciaste sesión como ' + v.staff.email, undefined, { duration: 1000 ,panelClass:['orange-snackbar']});
        
      console.log(v.staff);
    },
    error: (e) => {console.log(e.error.error);
      this.snackBar.open(e.error.error, undefined, { duration: 1000 ,panelClass:['orange-snackbar']});},
    complete: () => {console.log('Empleado logueado con éxito');}
  });
  }

}
