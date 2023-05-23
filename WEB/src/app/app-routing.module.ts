import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { AreaPersonalComponent } from './pages/area-personal/area-personal.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { MembresiasPanelComponent } from './pages/membresias-panel/membresias-panel.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PanelEntrenadorComponent } from './pages/panel-entrenador/panel-entrenador.component';
import { PanelNutricionistaComponent } from './pages/panel-nutricionista/panel-nutricionista.component';
import { UpdateRutinaViewComponent } from './components/update-rutina-view/update-rutina-view.component';
import { UpdatePlanningViewComponent } from './components/update-planning-view/update-planning-view.component';
import { UpdateMembresiaViewComponent } from './components/update-membresia-view/update-membresia-view.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {path: '', component: LandingComponent },
  {path: 'contact', component: ContactComponent },
  {path: 'about', component: AboutComponent },
  {path: 'userLogin', component: LoginComponent },
  {path: 'perfil', component: PerfilComponent },
  {path: 'userRegister', component: RegistroComponent },
  {path: 'personal',component: AreaPersonalComponent},
  {path: 'entrenador',component: PanelEntrenadorComponent},
  {path: 'nutricionista',component: PanelNutricionistaComponent},
  {path: 'adminPanel',component:AdminPanelComponent},
  {path: 'membresiasPanel',component:MembresiasPanelComponent},
  {path: 'updateRutina',component:UpdateRutinaViewComponent},
  {path: 'updatePlanning',component:UpdatePlanningViewComponent},
  {path: 'updateMembresia',component:UpdateMembresiaViewComponent},
   {path: '**',component: PagenotfoundComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: false,
    onSameUrlNavigation: "reload",
  anchorScrolling:'enabled',
  scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
