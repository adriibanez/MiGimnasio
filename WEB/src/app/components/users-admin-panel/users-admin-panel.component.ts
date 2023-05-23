import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminPanelService } from 'src/app/services/admin-panel.service';

@Component({
  selector: 'users-admin-panel',
  templateUrl: './users-admin-panel.component.html',
  styleUrls: ['./users-admin-panel.component.css']
})
export class UsersAdminPanelComponent {

  users : any = [];

  filteredUsers : any = [];

  displayedColumns: string[] = ['name', 'email', 'dni','delete'];

  constructor(private adminService : AdminPanelService,private snackBar:MatSnackBar){
  

  }
  
  //SHOW STAFF AND DELETE
  
  ngOnInit(): void {
  this.getUsersData();
  }
  
  getUsersData(){
    this.adminService.getUsers().subscribe(res => {
      this.users = res;
      this.filteredUsers = res;
      this.filteredUsers = this.sortUsersByName(this.filteredUsers);
      console.log(this.users);
     })
      
  }

  filtrarPorNombre(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filteredUsers = this.users.filter((user: { name: string }) => 
    user.name.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  sortUsersByName(filteredUsers: any[]) {
    return filteredUsers.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
  }
  
  eliminarUser(email:string){
    this.adminService.deleteUser(email).subscribe({
      next: (v) => console.log(v),
      error: (e) => {console.log(e.error);
        this.snackBar.open(e.error, undefined, { duration: 2000 ,panelClass:['orange-snackbar']});},
      complete: () => {console.log('Usuario eliminado con éxito');
      this.snackBar.open("Usuario eliminado", undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      this.ngOnInit();}
  });
  }

  
}
