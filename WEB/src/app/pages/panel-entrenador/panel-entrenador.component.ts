import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { StaffPanelService } from 'src/app/services/staff-panel.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-panel-entrenador',
  templateUrl: './panel-entrenador.component.html',
  styleUrls: ['./panel-entrenador.component.css']
})
export class PanelEntrenadorComponent {

  panelOpenState = false;

  infoStaff:any;

  rutinas : any = [];

  solicitudes:any = [];

  users:any =[];

  ejercicios : any = [];

  addRutinaForm: FormGroup;

  addEjerciciosForm: FormGroup;

  emailEmpleado:string="";

  emailUser:string ="";

  filteredRoutines:any = [];


  constructor(private titleService:Title,private staffService : StaffPanelService,private sessionStorage:SesionStorageService,private snackBar :MatSnackBar,private serviceService:SesionStorageService,private solicitudService:SolicitudesService,private router:Router){

    if(this.serviceService.getStaff()){
      this.infoStaff = JSON.parse(this.serviceService.getStaff()|| '{}');
      console.log(this.infoStaff);
    }
    else{
      router.navigate(["/"]);
    }
  
  
    this.addRutinaForm = new FormGroup({
     nombre: new FormControl('Rutina de biceps', [Validators.required]),
      descripcion: new FormControl('Descripción de rutina', [Validators.required]),
      emailUser: new FormControl('',[Validators.required]),

    });
    this.addEjerciciosForm = new FormGroup({
      nombreRutina:new FormControl('Rutina de biceps', [Validators.required]),
      nombreEjercicio: new FormControl('Curl de biceps', [Validators.required]),
       series: new FormControl(4, [Validators.required]),
       repeticiones: new FormControl(12, [Validators.required]),
       descanso: new FormControl(180, [Validators.required])

     });
  }


  ngOnInit(): void {
  this.cambiarTitulo("MiGimnasio | Entrenamiento");
  this.getRutinasData();
  this.getUsers();
  this.emailEmpleado = JSON.parse(this.sessionStorage.getStaff()||"{}").email;
  this.getSolicitudes();
  }

  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }

  sortRutinasByName(filteredRoutines: any[]) {
    return filteredRoutines.sort((a: any, b: any) => (a.nombre > b.nombre ? 1 : -1));
  }
  
  filtrarPorNombre(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filteredRoutines = this.rutinas.filter((rutinas: { nombre: string }) => 
    rutinas.nombre.toLowerCase().includes(filtro.toLowerCase())
    )
  }
  
  //------------------------------RUTINAS------------------------------
//OBTENER RUTINAS
  getRutinasData(){
    this.staffService.getRutinasPorEmpleado(this.infoStaff.email).subscribe(res => {
      this.rutinas = res;
      this.filteredRoutines = res;
      this.filteredRoutines = this.sortRutinasByName(this.filteredRoutines);
      console.log(this.rutinas);
     })
  }

//OBTENER USUARIOS
  getUsers(){
    this.staffService.getUsers().subscribe(res => {
      this.users = res;
      console.log(this.users);
     })
  }

    //ADD RUTINA
    onSubmit() {
      let newRutina = this.addRutinaForm.value;
      newRutina.fechaCreacion = new Date().toLocaleDateString();
      newRutina.ejercicios =[];
      console.log(this.emailUser);
      let emailUser: string = this.addRutinaForm.get('emailUser')!.value;
      console.log("EmailUSER");
      console.log(emailUser);
      newRutina.emailEmpleado =this.emailEmpleado;

      if(!isNaN(newRutina.nombre)){
        this.snackBar.open("El campo nombre tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
        return;
      }else if(!isNaN(newRutina.descripcion)){
        this.snackBar.open("El campo descripción tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
        return;
      }
      console.log(newRutina);
  
      this.staffService.postNewRoutine(newRutina).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']})},
        complete: () => {console.log('Rutina añadida con éxito');this.ngOnInit();
        this.snackBar.open('Nueva rutina añadida', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
  
      } 
    });
    }
//ACTUALIZAR RUTINA
  updateRutina(rutina:any){
    this.router.navigate(['updateRutina'], { state: { rutina: rutina } });
  }
//ELIMINAR RUTINA
  eliminarRutina(nombre:string){
    this.staffService.deleteRutina(nombre).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.log(e.error.error),
      complete: () => {console.log('Rutina eliminada con éxito');
      this.snackBar.open('Rutina eliminada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      this.ngOnInit();}
  });
  }

//------------------------------EJERCICIOS------------------------------

    //ADD EJERCICIO
    onSubmitEjercicio(){
      console.log(this.addEjerciciosForm.value);
      let nombreRutina = this.addEjerciciosForm.value.nombreRutina;
      let ejercicio = {
        nombre:this.addEjerciciosForm.value.nombreEjercicio,
        series:this.addEjerciciosForm.value.series,
        repeticiones:this.addEjerciciosForm.value.repeticiones,
        descanso:this.addEjerciciosForm.value.descanso
      };

      if(!isNaN(this.addEjerciciosForm.value.nombreRutina)){
        this.snackBar.open("El campo nombre de la rutina tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
        return;
      }else if(!isNaN(this.addEjerciciosForm.value.nombreEjercicio)){
        this.snackBar.open("El campo nombre del ejercicio tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
        return;
      }

      this.staffService.postNewEjercicio(nombreRutina,ejercicio).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']})},
        complete: () => {console.log('Ejercicio añadido con éxito') ;this.ngOnInit();
        this.snackBar.open('Nuevo ejercicio añadido', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})}
    });
    }

    //ELIMINAR EJERCICIOS
    eliminarEjercicioDeRutina(nombreRutina:string,ejercicio:string){
      this.staffService.deleteEjercicioDeRutina(nombreRutina,ejercicio).subscribe({
        next: (v) => console.log(v),
        error: (e) => console.log(e.error.error),
        complete: () => {console.log('Ejercicio eliminado con éxito');
        this.snackBar.open('Ejercicio eliminado', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        this.ngOnInit();}
    });
    }

    //OBTENER SOLICITUDES
getSolicitudes(){
  this.solicitudService.getEmpleadoSolicitudes(this.infoStaff.email).subscribe(res => {
    this.solicitudes = res;
    console.log(this.solicitudes);
   })
}

    //ACTUALIZAR SOLICITUDES
    checkDone(solicitud:any){

      let soliActualizada = {
        fecha:solicitud.fecha,
        emailUsuario:solicitud.emailUsuario,
        emailEmpleado:solicitud.emailEmpleado,
        mensaje:solicitud.mensaje,
        estado:solicitud.estado = "Hecho"
      };
      console.log(soliActualizada);
      this.solicitudService.actualizarEstadoSolicitud(solicitud._id,soliActualizada).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
        complete: () => {console.log('Solicitud marcada como hecha') ;
        this.snackBar.open('Solicitud marcada como hecha', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});this.ngOnInit();}
    });
    }

    refuse(solicitud:any){
      let soliActualizada = {
        fecha:solicitud.fecha,
        emailUsuario:solicitud.emailUsuario,
        emailEmpleado:solicitud.emailEmpleado,
        mensaje:solicitud.mensaje,
        estado:solicitud.estado = "Rechazada"
      };
      console.log(soliActualizada);

      this.solicitudService.actualizarEstadoSolicitud(solicitud._id,soliActualizada).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        },
        complete: () => {console.log('Solicitud rechazada') ;this.ngOnInit();
        this.snackBar.open('Solicitud rechazada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})}
    });
    }
}
