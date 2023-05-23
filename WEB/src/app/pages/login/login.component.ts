import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first, map } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // hide = true;
  userLoginForm :FormGroup;

  constructor(private titleService:Title,private authService:AuthServiceService,private localService :LocalStorageService,private sessionService: SesionStorageService,private router:Router,private sharedService: SharedService,private snackBar: MatSnackBar) { 
    
    this.userLoginForm = new FormGroup({
     email: new FormControl('adrian@gmail.com', [Validators.required,Validators.email]),
     password: new FormControl('password', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.cambiarTitulo("MiGimnasio | ¡Inicia Sesión!");
    
  }
  
  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }

  onSubmit() {

    const user = this.userLoginForm.value;
   
    this.authService.loginUser(user).pipe(first()).subscribe({

      next: (v) => {
       
        console.log("SET ITEM--->1");
        console.log("TOKEN "  + v.token);
        this.localService.setToken(v.token);
        console.log(v.token);
        this.sessionService.setUser(v.user);
        console.log("USER "  + v.user);
        // location.reload();
        console.log("Se llama al servicio");
        this.sharedService.emitNgInit();
        this.router.navigate(['/perfil']);
        this.snackBar.open('Iniciaste sesión como ' + v.user.email, undefined, { duration: 1500,panelClass: ['orange-snackbar'] },);

            
        },
    error: (e) => {console.log(e.error.error);        
      this.snackBar.open( e.error.error, undefined, { duration: 1500 ,panelClass:['orange-snackbar'] });
  },
    complete: () => {console.log('Usuario logueado con éxito');
  }
  });

 
 
  }
}
