import { Component, OnInit } from '@angular/core';

import { Reserva } from 'src/interfaces/reserva';
import { ReservaService } from '../reserva.service';
import { TipoDeQuarto } from 'src/interfaces/tipo-de-quarto';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'app-editar-reserva',
    templateUrl: './editar-reserva.component.html',
    styleUrls: ['./editar-reserva.component.css']
})
export class EditarReservaComponent implements OnInit {

    reserva: Reserva;

    editForm: FormGroup;
    checkin: Date;
    checkout: Date;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private reservaService: ReservaService
    ) { }

    ngOnInit(): void {
        this.getReserva();

        this.editForm = this.formBuilder.group({
            checkin: '',
            checkout: '',
        });
    }

    editarReserva(values): void {
        const oldPrice = this.reserva.preco;
        localStorage.setItem("antigo", JSON.stringify(oldPrice));

        const id = this.route.snapshot.paramMap.get('id');
        const price = this.getPrice();
        this.reservaService.editReserva(this.reserva, values, price).subscribe(response => {
            if (response['success'])
                this.router.navigate(["/reserva/" + id + "/pagamento"]);
            else {
                localStorage.removeItem("antigo");
                window.alert(response['message'][0].msg);
            }
        });
    }

    getReserva() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id)
            this.reservaService.getReserva(id).subscribe((reserva) =>
                this.reserva = reserva as Reserva
            );
    }

    showPrice() {
        const date1 = new Date((document.getElementById("check-in") as HTMLInputElement).value);
        const date2 = new Date((document.getElementById("check-out") as HTMLInputElement).value);
        return date1 && date2 && date1 < date2;
    }

    getPrice() {
        var date1 = new Date((document.getElementById("check-in") as HTMLInputElement).value);
        var date2 = new Date((document.getElementById("check-out") as HTMLInputElement).value);
        return this.getPreçoEstimadoBetween(date1, date2, this.reserva.tipodequarto);
    }

    // 2000 is leap year 
    year = 2000;
    epocaBaixaInicio1 = new Date("1/15/" + this.year);
    epocaBaixaFim1 = new Date("5/31/" + this.year);
    epocaBaixaInicio2 = new Date("9/30/" + this.year);
    epocaBaixaFim2 = new Date("12/15/" + this.year);

    epocas = [this.epocaBaixaInicio1, this.epocaBaixaFim1, this.epocaBaixaInicio2, this.epocaBaixaFim2];

    getPreçoEstimadoBetween(check_in: Date, check_out: Date, tipoQuarto: TipoDeQuarto) {
        check_in.setHours(0, 0, 0, 0);
        check_out.setHours(0, 0, 0, 0);

        if (check_in >= check_out)
            return 0;

        this.epocaBaixaInicio1.setHours(0, 0, 0, 0);
        this.epocaBaixaFim1.setHours(0, 0, 0, 0);
        this.epocaBaixaInicio2.setHours(0, 0, 0, 0);
        this.epocaBaixaFim2.setHours(0, 0, 0, 0);

        // Inicial date
        var date = new Date(check_in);
        // Final date
        var final_date = new Date(check_out);

        var price = 0;
        const milDay = 1000 * 60 * 60 * 24;
        while (date < final_date) {
            price += (this.isInEpocaBaixa(date) ? tipoQuarto.lowPrice : tipoQuarto.highPrice);
            date = new Date(date.getTime() + milDay);
        }

        return price;
    }

    // Epoca baixa : 15/1 até 31/5 : 30/9 até 15/12
    isInEpocaBaixa(date: Date) {

        var date1 = new Date(date);
        date1.setFullYear(this.year);        // Predefined

        var epocas = this.epocas;
        return (epocas[0] <= date1 && date1 <= epocas[1]) ||
            (epocas[2] <= date1 && date1 <= epocas[3]);
    }

    // // Epoca baixa : 15/1 até 31/5 : 30/9 até 15/12
    // getPreçoEstimadoBetween(check_in: Date, check_out: Date, tipoQuarto: TipoDeQuarto) {
    //     if (check_in >= check_out)
    //         return 0;

    //     var price = 0;
    //     var date: Date = check_in;
    //     check_out.setHours(0, 0, 0, 0);
    //     while (date < check_out) { // se o checkout nao é pago
    //         price += this.isInEpocaBaixa(date) ? tipoQuarto.lowPrice : tipoQuarto.highPrice;
    //         date = new Date(date.getTime() + (1000 * 60 * 60 * 24)); //adicionar um dia em ms
    //     }

    //     return price;
    // }

    // isInEpocaBaixa(date: Date) {
    //     date.setHours(0, 0, 0, 0);
    //     var epocaBaixaInicio1 = new Date("1/15/" + date.getFullYear());// year is useless
    //     var epocaBaixaFim1 = new Date("5/31/" + date.getFullYear());
    //     var epocaBaixaInicio2 = new Date("9/30/" + date.getFullYear());
    //     var epocaBaixaFim2 = new Date("12/15/" + date.getFullYear());
    //     return ((date >= epocaBaixaInicio1 && date <= epocaBaixaFim1) ||
    //         (date >= epocaBaixaInicio2 && date <= epocaBaixaFim2))
    // }
}
