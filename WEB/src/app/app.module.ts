import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AreaPersonalComponent } from './pages/area-personal/area-personal.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AboutComponent } from './pages/about/about.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { StaffAdminPanelComponent } from './components/staff-admin-panel/staff-admin-panel.component';
import { UsersAdminPanelComponent } from './components/users-admin-panel/users-admin-panel.component';
import { MembresiasPanelComponent } from './pages/membresias-panel/membresias-panel.component';
import { AuthTokenInterceptor } from './services/auth-token.interceptor';
import { PanelEntrenadorComponent } from './pages/panel-entrenador/panel-entrenador.component';
import { PanelNutricionistaComponent } from './pages/panel-nutricionista/panel-nutricionista.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateRutinaViewComponent } from './components/update-rutina-view/update-rutina-view.component';
import { MatInputModule } from '@angular/material/input';
import { UpdatePlanningViewComponent } from './components/update-planning-view/update-planning-view.component';
import { UpdateMembresiaViewComponent } from './components/update-membresia-view/update-membresia-view.component';
import {MatTableModule} from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ContactComponent,
    AreaPersonalComponent,
    PerfilComponent,
    AboutComponent,
    NavbarComponent,
    FooterComponent,
    RegistroComponent,
    LoginComponent,
    AdminPanelComponent,
    StaffAdminPanelComponent,
    UsersAdminPanelComponent,
    MembresiasPanelComponent,
    PanelEntrenadorComponent,
    PanelNutricionistaComponent,
    UpdateRutinaViewComponent,
    UpdatePlanningViewComponent,
    UpdateMembresiaViewComponent,
    PagenotfoundComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatDividerModule
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
