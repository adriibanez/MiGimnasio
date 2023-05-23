import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { StaffResponse } from 'src/app/models/staff.response.model';
import { AdminPanelService } from 'src/app/services/admin-panel.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  constructor(private titleService:Title ){}

  ngOnInit(): void {
    this.cambiarTitulo("MiGimnasio | Panel Admin");
    
  }
  
  cambiarTitulo(nuevoTitulo: string) {
    this.titleService.setTitle(nuevoTitulo);
  }
  

  }

  

