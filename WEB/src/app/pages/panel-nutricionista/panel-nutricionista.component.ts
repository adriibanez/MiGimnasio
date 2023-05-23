import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { StaffPanelService } from 'src/app/services/staff-panel.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-panel-nutricionista',
  templateUrl: './panel-nutricionista.component.html',
  styleUrls: ['./panel-nutricionista.component.css']
})
export class PanelNutricionistaComponent {

  panelOpenState = false;

  infoStaff:any;
  
  plannings : any = [];

  solicitudes:any = [];

  users:any =[];

  comidas : any = [];

  addPlanningForm: FormGroup;

  addComidasForm: FormGroup;

  emailEmpleado:string="";

  emailUser:string ="";


  filteredPlannings:any = [];

  
  
  constructor(private titleService:Title,private staffService : StaffPanelService,private sessionStorage:SesionStorageService,private snackBar:MatSnackBar,private serviceService:SesionStorageService,private solicitudService:SolicitudesService,private router:Router){

    if(this.serviceService.getStaff()){
      this.infoStaff = JSON.parse(this.serviceService.getStaff()|| '{}');
      console.log(this.infoStaff);
    }
    else{
      router.navigate(["/"]);
    }
  
  
    this.addPlanningForm = new FormGroup({
     nombre: new FormControl('Planning bajar peso', [Validators.required]),
      descripcion: new FormControl('Descripción del planning', [Validators.required]),
      emailUser: new FormControl('',[Validators.required]),

    });

    
    this.addComidasForm = new FormGroup({
      nombrePlanning:new FormControl('Planning bajar peso', [Validators.required]),
      nombreComida: new FormControl('Comida equilibrada', [Validators.required]),
       calorias: new FormControl(400, [Validators.required]),
       descripcion: new FormControl("Descripción de la comida", [Validators.required]),

     });
    
  }
  

  
  ngOnInit(): void {
    this.cambiarTitulo("MiGimnasio | Nutrición");
  this.getPlanningsData();
  this.getUsers();
  this.emailEmpleado = JSON.parse(this.sessionStorage.getStaff()||"{}").email;
  this.getSolicitudes();
  }

  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }

  sortPlanningByName(filteredPlannings: any[]) {
    return this.filteredPlannings.sort((a: any, b: any) => (a.nombre > b.nombre ? 1 : -1));
  }
  
  filtrarPorNombre(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filteredPlannings = this.plannings.filter((plannings: { nombre: string }) => 
    plannings.nombre.toLowerCase().includes(filtro.toLowerCase())
    )
  }
  

  //--------------------------------PLANNINGS--------------------------------
  
  getPlanningsData(){
    this.staffService.getPlanningsPorEmpleado(this.infoStaff.email).subscribe(res => {
      this.plannings = res;
      this.filteredPlannings = res;
      this.filteredPlannings = this.sortPlanningByName(this.filteredPlannings);

      console.log(this.plannings);
     })
  }


  getUsers(){
    this.staffService.getUsers().subscribe(res => {
      this.users = res;
      console.log(this.users);
     })
  }

  //ADD PLANNING
    onSubmit() {
      let newPlanning = this.addPlanningForm.value;
      newPlanning.fechaCreacion = new Date().toLocaleDateString();
      newPlanning.comidas =[];
      console.log(this.emailUser);
      let emailUser: string = this.addPlanningForm.get('emailUser')!.value;
      console.log("EmailUSER");
      console.log(emailUser);
      newPlanning.emailEmpleado =this.emailEmpleado;

      if(!isNaN(this.addPlanningForm.value.nombre)){
        this.snackBar.open("El campo nombre del planning tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
        return;
      }else if(!isNaN(this.addPlanningForm.value.descripcion)){
        this.snackBar.open("El campo descripcion del planning tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
        return;
      }

      console.log(newPlanning);
  
      this.staffService.postNewPlanning(newPlanning).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
        complete: () => {console.log('Planning añadida con éxito');this.ngOnInit();
        this.snackBar.open('Nuevo planning añadido', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})} 
    });
    // this.adminService.actualizar();
    }


  
  updatePlanning(planning:any){
    this.router.navigate(['updatePlanning'], { state: { planning: planning } });
  }
  
  eliminarPlanning(nombre:string){
    this.staffService.deletePlanning(nombre).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error.error);
        this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
      complete: () => {console.log('Planning eliminada con éxito');
      this.snackBar.open('Planning eliminado', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
      this.ngOnInit();}
  });
  }



  //--------------------------------COMIDAS--------------------------------

 //ADD COMIDA

 onSubmitComida(){
  console.log(this.addComidasForm.value);
  let nombrePlanning = this.addComidasForm.value.nombrePlanning;
  let comida = {
    nombre:this.addComidasForm.value.nombreComida,
    descripcion:this.addComidasForm.value.descripcion,
    calorias:this.addComidasForm.value.calorias,
  };

  if(!isNaN(this.addComidasForm.value.nombrePlanning)){
    this.snackBar.open("El campo nombre del planning tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
    return;
  }else if(!isNaN(this.addComidasForm.value.nombreComida)){
    this.snackBar.open("El campo nombre de la comida tiene que ser de tipo texto", undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
    return;
  }


  
  this.staffService.postNewComida(nombrePlanning,comida).subscribe({
    next: (v) => console.log(v),
    error: (e) => {console.log(e.error);
      this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
    complete: () => {console.log('Comida añadida con éxito') ;this.ngOnInit();
    this.snackBar.open('Nueva comida añadida', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})}
});
}


  eliminarComidaDePlanning(nombrePlanning:string,comida:string){
    this.staffService.deleteComidaDePlanning(nombrePlanning,comida).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error.error);
        this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
      complete: () => {console.log('Comida eliminada con éxito');
      this.snackBar.open('Comida eliminada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
      this.ngOnInit();}
  });
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
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        this.ngOnInit();},
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

    getSolicitudes(){
      this.solicitudService.getEmpleadoSolicitudes(this.infoStaff.email).subscribe(res => {
        this.solicitudes = res;
        console.log(this.solicitudes);
       })
    }


}
