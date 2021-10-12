import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadeiaDeHoteisComponent } from './cadeia-de-hoteis/cadeia-de-hoteis.component';
import { HotelComponent } from './hotel/hotel.component';
import { TipoDeQuartoComponent } from './tipo-de-quarto/tipo-de-quarto.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReservaComponent } from './reserva/reserva.component';
import { EditarReservaComponent } from './editar-reserva/editar-reserva.component';
import { ReservasComponent } from './reservas/reservas.component';
import { CriarReservaComponent } from './criar-reserva/criar-reserva.component';
import { CartaoReservaComponent } from './cartao-reserva/cartao-reserva.component';

const routes: Routes = [
	{ path: '', redirectTo: '/hoteis', pathMatch: 'full' },
	{ path: 'hoteis', component: CadeiaDeHoteisComponent },
	{ path: 'hotel/:id', component: HotelComponent },
	{ path: 'tipoDeQuarto/:id', component: TipoDeQuartoComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'reserva/:id', component: ReservaComponent },
	{ path: 'reserva/:id/editar', component: EditarReservaComponent },
	{ path: 'reservas/:id', component: ReservasComponent },
	{ path: 'hotel/:id/criar-reserva', component: CriarReservaComponent },
	{ path: 'reserva/:id/pagamento', component: CartaoReservaComponent },
];

@NgModule({
	declarations: [],
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
