import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SesionStorageService } from 'src/app/services/sesion-storage.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  constructor(private titleService:Title,private router:Router){}
ngOnInit(): void {
  this.cambiarTitulo("MiGimnasio | Inicio");
}

cambiarTitulo(nuevoTitulo: string) {
  this.titleService.setTitle(nuevoTitulo);
}

irDescarga() {
  this.router.navigate(['/'], { fragment: 'descargar' });
}

}
