import { Component, OnInit } from '@angular/core';

import { Reserva, PaymentCard } from 'src/interfaces/reserva';
import { ReservaService } from '../reserva.service';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-cartao-reserva',
    templateUrl: './cartao-reserva.component.html',
    styleUrls: ['./cartao-reserva.component.css']
})
export class CartaoReservaComponent implements OnInit {

    reserva: Reserva;
    card: PaymentCard;
    oldPrice: Number;
    newPrice: Number;

    cartaoForm: FormGroup;
    number: Number;
    expDate: Date;
    cvv: Number;

    data: Date;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private reservaService: ReservaService
    ) { }

    ngOnInit(): void {
        this.getReserva();
        this.oldPrice = JSON.parse(localStorage.getItem("antigo"));
        this.cartaoForm = this.formBuilder.group({
            numeroCartaoCredito: '',
            dataValidade: '',
            cvv: '',
        });
    }

    cartaoReserva(values): void {
        this.reservaService.cartaoReserva(this.reserva, values).subscribe(response => {
            if (response['success']) {
                localStorage.removeItem("antigo");
                this.router.navigate(["/reserva/" + this.reserva._id]);
            } else {
                window.alert(response['message'][0].msg);
            }
        });
    }

    getReserva() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id)
            this.reservaService.getReserva(id).subscribe((reserva) => {
                this.reserva = reserva as Reserva
                this.card = this.reserva.card as PaymentCard;
                this.data = JSON.parse(JSON.stringify(this.card.date)).split('T')[0];
                this.newPrice = this.reserva.preco;
            });
    }

    showForm() {
        return this.oldPrice < this.newPrice;
    }

    getExpDate() {
        if (this.card == null || this.card.date == null)
            return;

        const date = new Date(this.card.date);
        return date.getMonth() + 1 + "/" + date.getFullYear();
    }

}
