import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AdminPanelService } from 'src/app/services/admin-panel.service';

@Component({
  selector: 'membresias-panel',
  templateUrl: './membresias-panel.component.html',
  styleUrls: ['./membresias-panel.component.css']
})
export class MembresiasPanelComponent {



  membresia : any = [];

  ventajas : any = [];

  addMembresiaForm: FormGroup;

  addVentajasForm: FormGroup;

  nombreMemCard: string ='';

  
  
  constructor(private router : Router,private titleService:Title,private adminService : AdminPanelService,private snackBar:MatSnackBar){
  
    this.addMembresiaForm = new FormGroup({
     nombre: new FormControl('Basica', [Validators.required]),
      precio: new FormControl('123', [Validators.required])
    });

    this.addVentajasForm = new FormGroup({
      nombreMembresia: new FormControl('Basica', [Validators.required]),
       descripcion: new FormControl('Ventajas', [Validators.required])
     });
  }
  
  ngOnInit(): void {
  this.cambiarTitulo("MiGimnasio | Membresías");
  this.getMembresiasData();
  }

  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }
  
  //------------------------------MEMBRESÍAS------------------------------
  getMembresiasData(){
    this.adminService.getMembresias().subscribe(res => {
      this.membresia = res;
      console.log(this.membresia);
     })
  }

   onSubmit() {
    let newMembresia = this.addMembresiaForm.value;
    newMembresia.ventajas =[];

    if (!isNaN(newMembresia.nombre)){
      this.snackBar.open('El nombre no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }


    this.adminService.postNewMembresia(newMembresia).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error);
        this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
      complete: () => {console.log('Membresía añadida con éxito');
      this.snackBar.open('Nueva membresía añadida', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      this.ngOnInit();}
  });
  }

  //ACTUALIZAR MEMBRESIA
  updateMembresia(membresia:any){
    this.router.navigate(['updateMembresia'], { state: { membresia: membresia } });
  }


  eliminarMembresia(nombre:string){
    this.adminService.deleteMembresia(nombre).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error.error);
        this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
      complete: () => {console.log('Membresía eliminada con éxito');
      this.snackBar.open('Membresia eliminada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']})
      this.ngOnInit();}
  });
  }

  //------------------------------VENTAJAS------------------------------
  
    //ADD VENTAJA
    onSubmitVentaja(){
      console.log(this.addVentajasForm.value);
      let nombreMembresia = this.addVentajasForm.value.nombreMembresia;
      let ventaja = {descripcion:this.addVentajasForm.value.descripcion};

      
      if (!isNaN(this.addVentajasForm.value.nombreMembresia)){
        this.snackBar.open('El nombre no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        return;
      }

      if (!isNaN(this.addVentajasForm.value.descripcion)){
        this.snackBar.open('La ventaja no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        return;
      }

      this.adminService.postNewVentaja(nombreMembresia,ventaja).subscribe({
        next: (v) => console.log(v),
        error: (e) =>{ console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        },
        complete: () => {console.log('Ventaja añadida con éxito');
        this.snackBar.open('Nueva ventaja añadida', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        this.ngOnInit(); }
    });
    }


  eliminarVentajaDeMembresia(nombreMembresia:string,ventaja:string){
    this.adminService.deleteVentajaDeMembresia(nombreMembresia,ventaja).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error.error);
        this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']})},
      complete: () => {console.log('Ventaja eliminada con éxito');
      this.snackBar.open('Ventaja eliminada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      this.ngOnInit();}
  });
  }

}
