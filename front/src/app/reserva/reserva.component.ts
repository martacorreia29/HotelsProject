import { Component, OnInit } from '@angular/core';

import { Reserva, PaymentCard } from 'src/interfaces/reserva';
import { ReservaService } from '../reserva.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reserva',
    templateUrl: './reserva.component.html',
    styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

    reserva: Reserva = null;

    card: PaymentCard = null;

    constructor(
        private route: ActivatedRoute,
        private reservaService: ReservaService
    ) { }

    ngOnInit(): void {
        this.getReservaAndCard();
    }

    getReservaAndCard() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.reservaService.getReserva(id).subscribe((reserva) => {
                this.reserva = reserva as Reserva;
                this.card = this.reserva.card as PaymentCard
            });
        }
    }

    getCheckIn() {
        if (this.reserva == null)
            return;

        const date = new Date(this.reserva.checkin);
        return this.getDate(date);
    }

    getCheckOut() {
        if (this.reserva == null)
            return;

        const date = new Date(this.reserva.checkout);
        return this.getDate(date);
    }

    getExpDate() {
        if (this.card == null || this.card.date == null)
            return;

        const date = new Date(this.card.date);
        return date.getMonth() + 1 + "/" + date.getFullYear();
    }

    getDate(date: Date) {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }

    getHotel() {
        if (this.reserva != null && this.reserva.hotel != null)
            return this.reserva.hotel.name;
    }

    getTQuarto() {
        if (this.reserva != null && this.reserva.tipodequarto != null)
            return this.reserva.tipodequarto.name;
    }

    canEdit() {
        const dateNow = new Date();
        const date = new Date(this.reserva.checkin);
        
        if (date == null)
            return false;

        dateNow.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return dateNow < date;
    }
}
