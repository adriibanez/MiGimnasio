import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  contactForm:FormGroup;
 

  constructor(private titleService:Title,private fb: FormBuilder,private contactService: ContactService,private snackBar:MatSnackBar) {
    this.contactForm = this.fb.group({
      nombre: ['Paco',Validators.compose([Validators.required])],
      email: ['adrian@gmail.com', Validators.compose([Validators.required,Validators.email])],
      asunto: ['Asunto', Validators.compose([Validators.required,Validators.maxLength(10)])],
      mensaje: ['Mensaje de prueba', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(150)])],
   
    });
   }

   ngOnInit(): void {
    this.cambiarTitulo("MiGimnasio | Contáctanos");
   }

   cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }
  

  onSubmit() {
    let objContact = this.contactForm.value;

    if (!isNaN(objContact.nombre)){
      this.snackBar.open('El nombre no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }

    
    else if (!isNaN(objContact.asunto)){
      this.snackBar.open('El asunto no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }
    else if (!isNaN(objContact.mensaje)){
      this.snackBar.open('El mensaje no puede ser un número', undefined, { duration: 2000 ,panelClass:['orange-snackbar']});
      return;
    }
    
    this.contactService.sendContactForm(objContact)
    .subscribe(
      response => {
        location.href = 'https://mailthis.to/confirm';
        console.log('Email enviado correctamente');
        this.snackBar.open('Email enviado correctamente' + response, undefined, { duration: 1000 ,panelClass:['orange-snackbar']});
        
      },
      error => {
        console.error('Se ha producido un error, inténtelo más tarde');
        this.snackBar.open('Se ha producido un error, inténtelo más tarde', undefined, { duration: 1000 ,panelClass:['orange-snackbar']});
      }
    );

    console.log(objContact);
  }
}
