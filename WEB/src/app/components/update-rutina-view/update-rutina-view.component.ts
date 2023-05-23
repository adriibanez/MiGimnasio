import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StaffPanelService } from 'src/app/services/staff-panel.service';

@Component({
  selector: 'app-update-rutina-view',
  templateUrl: './update-rutina-view.component.html',
  styleUrls: ['./update-rutina-view.component.css']
})
export class UpdateRutinaViewComponent {

  rutina:any={};

  updateRutinaForm:FormGroup;

  constructor(private router: Router,private staffService:StaffPanelService,private snackBar:MatSnackBar) {

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
      const rutina = currentNavigation.extras.state["rutina"];
      this.rutina = rutina;
      console.log(rutina);

    
    } else {
      this.router.navigate(["/"]);
      
    } 

    this.updateRutinaForm = new FormGroup({
      nombre: new FormControl(this.rutina.nombre, [Validators.required]),
      descripcion: new FormControl( this.rutina.descripcion,[Validators.required]),
     });
   }


    saveChanges(){

      let updatedRutina ={
        nombre: this.updateRutinaForm.value.nombre,
        descripcion: this.updateRutinaForm.value.descripcion,
      };

     
      
      this.staffService.updateRutina(this.rutina._id,updatedRutina).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
        complete: () => {console.log('Rutina actualizada con éxito');
        this.snackBar.open('Rutina actualizada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        this.router.navigate(["/entrenador"]);}
    });

    }

}
