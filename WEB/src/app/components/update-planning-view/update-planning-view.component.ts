import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StaffPanelService } from 'src/app/services/staff-panel.service';

@Component({
  selector: 'app-update-planning-view',
  templateUrl: './update-planning-view.component.html',
  styleUrls: ['./update-planning-view.component.css']
})
export class UpdatePlanningViewComponent {

  planning:any={};

  updatePlanningForm:FormGroup;

  constructor(private router: Router,private staffService:StaffPanelService,private snackBar:MatSnackBar) {

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
      const planning = currentNavigation.extras.state["planning"];
      this.planning = planning;
      console.log(planning);

    
    } else {
      this.router.navigate(["/"]);
      
    } 

    this.updatePlanningForm = new FormGroup({
      nombre: new FormControl(this.planning.nombre, [Validators.required]),
      descripcion: new FormControl( this.planning.descripcion,[Validators.required]),
     });
   }


    saveChanges(){

      let updatedPlanning ={
        nombre: this.updatePlanningForm.value.nombre,
        descripcion: this.updatePlanningForm.value.descripcion,
        fechaCreacion: this.planning.fechaCreacion,
        emailUser: this.planning.emailUser,
        emailEmpleado: this.planning.emailEmpleado,
      };

      
      this.staffService.updatePlanning(this.planning._id,updatedPlanning).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
        complete: () => {console.log('Planning actualizado con éxito');
        this.snackBar.open('Planning actualizado', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        this.router.navigate(["/nutricionista"]);}
    });

    }

}
