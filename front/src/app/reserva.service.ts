import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoDeQuarto } from 'src/interfaces/tipo-de-quarto';
import { Hotel } from 'src/interfaces/hotel';

@Injectable({
    providedIn: 'root'
})
export class ReservaService {

    baseUrl = 'http://localhost:3066/';
    // baseUrl = 'http://appserver.alunos.di.fc.ul.pt:3066/';
    reservaUrl = this.baseUrl + 'reserva/';
    reservasUrl = this.baseUrl + 'reservas/';
    tipoDeQuartoUrl = this.baseUrl + 'tipoDeQuarto/quarto/';
    hotelUrl = this.baseUrl + 'hotel/tipoDeQuarto/';

    constructor(private http: HttpClient) { }

    getReserva(id: string) {
        return this.http.get(this.reservaUrl + id);
    }

    //gets todas as reservas de um cliente
    getCliente(id: string) {
        return this.http.get(this.reservasUrl + id);
    }

    //gets tipo de quarto pelo id do quarto
    getTipoQuartoByQuarto(id: string) {
        return this.http.get<TipoDeQuarto>(this.tipoDeQuartoUrl + id);
    }

    //gets hotel pelo id do tipo de quarto
    getHotelbyTipoQuarto(id: string) {
        return this.http.get<Hotel>(this.hotelUrl + id);
    }

    createReserva(dados, hotel, preco, clienteLogged) {
        return this.http.post(this.baseUrl + "criar-reserva", { 'cliente': clienteLogged, 'data': dados, 'hotel': hotel, 'preco': preco });
    }

    editReserva(reserva, values, price) {
        return this.http.post(this.baseUrl + "reserva-datas", { 'data': values, 'reserva': reserva, 'preco': price });
    }

    cartaoReserva(reserva, values) {
        return this.http.post(this.baseUrl + "reserva-cartao", { 'data': values, 'reserva': reserva });
    }
}
