import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { CadeiaDeHoteisComponent } from './cadeia-de-hoteis/cadeia-de-hoteis.component';
import { HotelComponent } from './hotel/hotel.component';
import { TipoDeQuartoComponent } from './tipo-de-quarto/tipo-de-quarto.component';
import { ReservasComponent } from './reservas/reservas.component';
import { EditarReservaComponent } from './editar-reserva/editar-reserva.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CriarReservaComponent } from './criar-reserva/criar-reserva.component';
import { ReservaComponent } from './reserva/reserva.component';
import { CartaoReservaComponent } from './cartao-reserva/cartao-reserva.component';

@NgModule({
	declarations: [
		AppComponent,
		CadeiaDeHoteisComponent,
		HotelComponent,
		TipoDeQuartoComponent,
		ReservasComponent,
		EditarReservaComponent,
		LoginComponent,
		RegisterComponent,
		CriarReservaComponent,
		ReservaComponent,
		CartaoReservaComponent
	],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
	providers: [DatePipe],
	bootstrap: [AppComponent]
})
export class AppModule { }
