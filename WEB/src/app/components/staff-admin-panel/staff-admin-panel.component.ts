import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminPanelService } from 'src/app/services/admin-panel.service';
import { isValid, isNIF, isNIE, ctrlChar } from "better-dni";
import { Router } from '@angular/router';


@Component({
  selector: 'staff-admin-panel',
  templateUrl: './staff-admin-panel.component.html',
  styleUrls: ['./staff-admin-panel.component.css'],
})
export class StaffAdminPanelComponent {

staff : any = [];

filteredStaff : any = [];

addEmpleadoForm: FormGroup;

displayedColumns: string[] = ['name', 'email', 'cargo','delete'];

  
constructor(private router: Router,private adminService : AdminPanelService,private snackBar:MatSnackBar){

  this.addEmpleadoForm = new FormGroup({
    dni: new FormControl('30701498V', [Validators.required]),
   name: new FormControl('Paco Angular', [Validators.required]),
   email: new FormControl('paco@gmail.com', [Validators.required,Validators.email]),
   password: new FormControl('2319238sdfgs', [Validators.required]),
   fechaNacimiento: new FormControl('2023-05-01', [Validators.required]),
    cargo: new FormControl('', [Validators.required])
  });
}

//SHOW STAFF 

ngOnInit(): void {
this.getStaffData();
this.filteredStaff.forEach((e:any) => {

    console.log(e);
  
});

}

sortStaffByName(filteredStaff: any[]) {
  return filteredStaff.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
}

filtrarPorNombre(event: Event) {
  const filtro = (event.target as HTMLInputElement).value;
  this.filteredStaff = this.staff.filter((staff: { name: string }) => 
  staff.name.toLowerCase().includes(filtro.toLowerCase())
  )
}


irAgregarEmpleados() {
  this.router.navigate(['/adminPanel'], { fragment: 'agregarEmpleados' });
}

getStaffData(){
  this.adminService.getStaff().subscribe(res => {
    this.staff = res;
    this.filteredStaff = res;
    this.filteredStaff = this.sortStaffByName(this.filteredStaff);

    console.log(this.filteredStaff);
   });

    
}




eliminarStaff(email:string){
  this.adminService.deleteStaff(email).subscribe({
    next: (v) => console.log(v),
    error: (e) => {console.log(e.error.error);
      this.snackBar.open(e.error.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
    complete: () => {console.log('Empleado eliminado con éxito');
    this.snackBar.open("Empleado eliminado", undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
    this.ngOnInit();}
});
}



//ADD STAFF
  onSubmit() {
    let newStaff = this.addEmpleadoForm.value;

    const fechaInscripcion = new Date().toLocaleDateString();

    newStaff.fechaInscripcion = fechaInscripcion;
    
    if (
      !(isNIF(newStaff.dni) || isNIE(newStaff.dni)) &&
      !isValid(newStaff.dni)
    ){
      this.snackBar.open('El dni no es válio', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }
  
    if (!isNaN(newStaff.name)){
      this.snackBar.open('El nombre no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }
  
    if (!isNaN(newStaff.numIban)){
      this.snackBar.open('El nombre no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }
    if (this.esMayorDe18(newStaff.fechaNacimiento) === false){
      this.snackBar.open('La edad no llega a los 18 años', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }


    this.adminService.postNewStaff(newStaff).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error.error);
        this.snackBar.open(e.error.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
      complete: () => {console.log('Empleado registrado con éxito');
      this.snackBar.open("Empleado registrado con éxito", undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      this.ngOnInit();
     }
  });
 
  }

  esMayorDe18(fechaStr: string): boolean {
    const fechaNacimiento = new Date(fechaStr);
    const edadEnMilisegundos = Date.now() - fechaNacimiento.getTime();
    const edadEnAnios = Math.floor(edadEnMilisegundos / (1000 * 60 * 60 * 24 * 365));
    return edadEnAnios >= 18;
  }

  
}
