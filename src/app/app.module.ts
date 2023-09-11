import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { IngresoComponent } from './componentes/ingreso/ingreso.component';
import { EncabezadoComponent } from './componentes/encabezado/encabezado.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { PiepaginaComponent } from './componentes/piepagina/piepagina.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    IngresoComponent,
    EncabezadoComponent,
    MenuComponent,
    PiepaginaComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp ( environment . firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
