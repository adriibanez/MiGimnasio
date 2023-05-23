import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminPanelService } from 'src/app/services/admin-panel.service';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  panelOpenState = false;

  solicitudes :any=[];

  infoUser:any = {};

  membresias : any = [];

  rutinas : any = [];

  plannings : any = [];

  staff:any=[];

  membresiaForm:FormGroup;

  solicitudForm:FormGroup;

  filtereSolicitudes:any = [];


  constructor(private titleService: Title,private router:Router,private serviceService:SesionStorageService,private userService:UserServiceService,private solicitudService:SolicitudesService,private adminService:AdminPanelService,private snackBar:MatSnackBar){
    this.membresiaForm = new FormGroup({
      membresiaChange: new FormControl('', [Validators.required]),
     });
     this.solicitudForm = new FormGroup({
      emailEmpleado: new FormControl('', [Validators.required]),
      mensaje: new FormControl( '',[Validators.required]),
     });
   
  }

  ngOnInit(): void {
    if(this.serviceService.getUser()){
      this.cambiarTitulo("MiGimnasio | Perfil");
      this.infoUser = JSON.parse(this.serviceService.getUser()|| '{}');
      console.log(this.infoUser);

      this.getMembresias();
      this.getUserRutinas();
      this.getUserPlannings();
      this.getUserSolicitudes();
      this.getEmpleados();

    }else{
      this.router.navigate(["/"]);
    }
  }

  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }

  sortRutinasByName(filtereSolicitudes: any[]) {
    return filtereSolicitudes.sort((a: any, b: any) => (a.fechaCreacion > b.fechaCreacion ? 1 : -1));
  }

  getMembresias(){
    this.userService.getMembresias().subscribe(res => {
      this.membresias = res;
      console.log(this.membresias);
     })
  }

  getUserRutinas(){
    this.userService.getUserRutinas(this.infoUser.email).subscribe(res => {
      this.rutinas = res;
      console.log(this.rutinas);
     })
  }

  getUserPlannings(){
    this.userService.getUserPlannings(this.infoUser.email).subscribe(res => {
      this.plannings = res;
      console.log(this.plannings);
     })
  }

  getUserSolicitudes(){
    this.solicitudService.getUserSolicitudes(this.infoUser.email).subscribe(res => {
      this.solicitudes = res;
      this.filtereSolicitudes = res;
      this.filtereSolicitudes = this.sortRutinasByName(this.filtereSolicitudes);

      console.log(this.solicitudes);
     })
  }

  getEmpleados(){
    this.adminService.getStaff().subscribe(res => {
        this.staff = res.filter((s: { cargo: string; }) => s.cargo !== 'admin');;      
     })
  }

  onSubmitCambiarMembresia(){
    let membresia = this.membresiaForm.value.membresiaChange;
    console.log("MEM");
    console.log(membresia);
    let user = {
      dni:this.infoUser.dni,
      email:this.infoUser.email,
      fechaInscripcion:this.infoUser.fechaInscripcion,
      fechaNacimiento:this.infoUser.fechaNacimiento,
      membresia:membresia,
      name:this.infoUser.name,
      numIban:this.infoUser.numIban,
      password:this.infoUser.password,

    };

    
    this.userService.actualizarUsuario(this.infoUser._id, user).subscribe({
      next: (v) => {console.log(v);this.ngOnInit();},
      error: (e) => {console.log(e.error.error);
        this.snackBar.open(e.error.error, undefined, { duration: 2000,panelClass:['orange-snackbar'] })},
      complete: () => {console.log('Ha cambiado su suscripción a :' + membresia);
      this.snackBar.open('Ha cambiado su suscripción a :' + membresia, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      this.serviceService.setUser(user);
      this.ngOnInit();
    }
  });
  }

  onSubmitSolicitud(){
    let newSolicitud = this.solicitudForm.value;
    newSolicitud.fecha = new Date().toLocaleDateString();
    newSolicitud.emailUsuario =this.infoUser.email;
    newSolicitud.estado = "Pendiente";
    if(!isNaN(newSolicitud.mensaje)){
      this.snackBar.open("El campo mensaje no puede ser un número", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
      return;
    }
    

    this.solicitudService.postNewSolicitud(newSolicitud).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error);
        this.snackBar.open(e.error, undefined, { duration: 2000,panelClass:['orange-snackbar'] })},
      complete: () => {console.log('Solicitud añadida con éxito');this.ngOnInit();
      this.snackBar.open('Nueva solicitud añadida', undefined, { duration: 2000,panelClass:['orange-snackbar'] });

    } 
  });
  }



}
