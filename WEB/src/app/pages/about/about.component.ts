import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

constructor(private titleService:Title ){}

ngOnInit(): void {
  this.cambiarTitulo("MiGimnasio | Sobre Nosotros");
  
}

cambiarTitulo(nuevoTitulo: string) {
  this.titleService.setTitle(nuevoTitulo);
}

}
