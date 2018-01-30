//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';


//Terceros
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';
import { MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AgmCoreModule } from '@agm/core';

//Rutas
import { APP_ROUTING }  from './app.routes'

//Referidos Component
import { AppComponent } from './app.component';
import { SplashComponent } from './components/splash/splash.component';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DialogNuevoReferidoComponent } from './components/dialog-nuevo-referido/dialog-nuevo-referido.component';
import { MisReferidosComponent } from './components/mis-referidos/mis-referidos.component';
import { MiProgresoComponent } from './components/mi-progreso/mi-progreso.component';
import { DialogDetalleReferidoComponent } from './components/dialog-detalle-referido/dialog-detalle-referido.component';
import { MatSelectModule } from '@angular/material/select';
import { DialogBasesComponent } from './components/dialog-bases/dialog-bases.component';
import { DialogDetallePromocionComponent } from './components/dialog-detalle-promocion/dialog-detalle-promocion.component';
import { DialogDetalleSucursalComponent } from './components/dialog-detalle-sucursal/dialog-detalle-sucursal.component';
import { DialogTerminosCondicionesComponent } from './components/dialog-terminos-condiciones/dialog-terminos-condiciones.component';

//Referidos Services
import { ReferidosService } from './services/referidos/referidos.service';
import { SesionService } from './services/referidos/sesion.service';
import { AutenticacionGuardService } from './services/referidos/autenticacion-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LoginComponent,
    InicioComponent,
    DialogNuevoReferidoComponent,
    MisReferidosComponent,
    MiProgresoComponent,
    DialogDetalleReferidoComponent,
    DialogBasesComponent,
    DialogDetallePromocionComponent,
    DialogDetalleSucursalComponent,
    DialogTerminosCondicionesComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    NoopAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAZmhdizMeixXQbmZu1qySmMCNh3hxZlhg'
    })
  ],
  providers: [ 
               ReferidosService,
               SesionService,
               AutenticacionGuardService,
               {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
             ],
  bootstrap: [AppComponent],
  entryComponents: [
                    DialogNuevoReferidoComponent,
                    DialogDetalleReferidoComponent,
                    DialogBasesComponent,
                    DialogDetallePromocionComponent,
                    DialogDetalleSucursalComponent,
                    DialogTerminosCondicionesComponent
                   ]
})
export class AppModule { }
