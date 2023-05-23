import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminPanelService } from 'src/app/services/admin-panel.service';

@Component({
  selector: 'app-update-membresia-view',
  templateUrl: './update-membresia-view.component.html',
  styleUrls: ['./update-membresia-view.component.css']
})
export class UpdateMembresiaViewComponent {
  membresia:any={};

  updateMembresiaForm:FormGroup;

  constructor(private router: Router,private adminService:AdminPanelService,private snackBar:MatSnackBar) {

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
      const membresia = currentNavigation.extras.state["membresia"];
      this.membresia = membresia;
      console.log(membresia);

    
    } else {
      this.router.navigate(["/"]);
      
    } 

    this.updateMembresiaForm = new FormGroup({
      nombre: new FormControl(this.membresia.nombre, [Validators.required]),
      precio: new FormControl( this.membresia.precio,[Validators.required]),
     });
   }


    saveChanges(){

      let updatedMembresia ={
        nombre: this.updateMembresiaForm.value.nombre,
        precio: this.updateMembresiaForm.value.precio,
      };

     
      
      this.adminService.updateMembresia(this.membresia._id,updatedMembresia).subscribe({
        next: (v) => console.log(v),
        error: (e) => {console.log(e.error);
          this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
        complete: () => {console.log('Membresía actualizada con éxito');
        this.snackBar.open('Membresía actualizada', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
        this.router.navigate(["/membresiasPanel"]);}
    });

    }
}
