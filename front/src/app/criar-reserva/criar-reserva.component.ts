import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/interfaces/cliente';
import { TipoDeQuarto } from '../../interfaces/tipo-de-quarto';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ReservaService } from '../reserva.service';
import { HotelService } from '../hotel.service';
import { Hotel } from '../../interfaces/hotel';

@Component({
    selector: 'app-criar-reserva',
    templateUrl: './criar-reserva.component.html',
    styleUrls: ['./criar-reserva.component.css']
})
export class CriarReservaComponent implements OnInit {

    hotel: Hotel;
    listTQuartos: TipoDeQuarto[] = [];
    currentClient: Cliente;
    reservationForm: FormGroup;
    checkin: Date;
    checkout: Date;
    tipoquarto: TipoDeQuarto;
    currentTab = 0; // Current tab is set to be the first tab (0)

    constructor(
        private hotelService: HotelService,
        private reservaService: ReservaService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
    ) {

        this.authenticationService.currentClient.subscribe(cliente => {
            this.currentClient = cliente;
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.hotelService.getHotel(id).subscribe((hotel) => {
                // Load Hotel
                this.hotel = hotel as Hotel;
                // Loads list to show and filter
                this.listTQuartos = this.hotel.tQuartos;
            });
        }

        this.reservationForm = this.formBuilder.group({
            checkin: '',
            checkout: '',
            tipoDeQuarto: {},
            name: '',
            email: '',
            phone: '',
            morada: '',
            nif: '',
            numeroCartaoCredito: '',
            dataValidade: '',
            cvv: '',
            preco: ''
        });
        this.showTab(this.currentTab); // Display the current tab

        // redirect to home if already logged in
        if (!this.authenticationService.currentClientValue) {
            this.router.navigate(['/login']);
        }

        if (localStorage.getItem("checkin") != null) {
            this.checkin = JSON.parse(localStorage.getItem("checkin")).split('T')[0];
            localStorage.removeItem("checkin");
        }

        if (localStorage.getItem("checkout") != null) {
            this.checkout = JSON.parse(localStorage.getItem("checkout")).split('T')[0];
            localStorage.removeItem("checkout");
        }

        if (localStorage.getItem("tipoquarto") != null) {
            this.tipoquarto = JSON.parse(localStorage.getItem("tipoquarto"));
        }

    };

    getDefault() {
        var i = null;
        for (i = 0; i < this.listTQuartos.length; i++) {
            if (this.listTQuartos[i]._id === this.tipoquarto._id) {
                return i;
            }
        }

        return null;
    }

    criarReserva(values): void {
        localStorage.removeItem("tipoquarto");
        const id = this.route.snapshot.paramMap.get('id');
        const preco = this.getPreçoEstimadoBetween(new Date(this.checkin), new Date(this.checkout), this.tipoquarto);
        this.reservaService.createReserva(values, this.hotel, preco, this.currentClient).subscribe(response => {
            if (response['success']) {
                this.router.navigate(['/reservas/' + this.currentClient._id]);
            } else {
                window.alert(response['message'][0].msg);
            }
        });
    }

    showTab(n) {

        var x = document.getElementsByClassName("tab") as HTMLCollectionOf<HTMLElement>;
        // This function will display the specified tab of the form ...
        if (n < x.length) {
            x[n].style.display = "block";
            // ... and fix the Previous/Next buttons:
            if (n == 0) {
                document.getElementById("prevBtn").style.display = "none";
            } else {
                document.getElementById("prevBtn").style.display = "inline";
            }
            if (n == (x.length - 1)) {

                let bt = document.getElementById("nextBtn") as HTMLButtonElement;
                bt.innerHTML = "Reservar";
            }

            if (n != (x.length - 1)) {
                document.getElementById("nextBtn").style.display = "inline-block";
                document.getElementById("nextBtn").innerHTML = "Próximo";
            }
            // ... and run a function that displays the correct step indicator:
            this.fixStepIndicator(n);
        }
    }

    nextPrev(n) {
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab") as HTMLCollectionOf<HTMLElement>;

        if (this.currentTab + 1 == x.length && n != -1) {
            this.criarReserva(this.reservationForm.value);
        } else {
            // Hide the current tab:
            x[this.currentTab].style.display = "none";
            // Increase or decrease the current tab by 1:
            this.currentTab = this.currentTab + n;

            this.showTab(this.currentTab);
        }
    }

    fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step") as HTMLCollectionOf<HTMLElement>;
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class to the current step:
        x[n].className += " active";
    }

    getPreco() {
        if (this.checkin && this.checkout && this.tipoquarto)
            return this.getPreçoEstimadoBetween(new Date(this.checkin), new Date(this.checkout), this.tipoquarto);
        return 0;
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

    //   // Epoca baixa : 15/1 até 31/5 : 30/9 até 15/12
    //   getPreçoEstimadoBetween(check_in: Date, check_out: Date, tipoQuarto: TipoDeQuarto) {
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
    //   }

    //   isInEpocaBaixa(date: Date) {
    //     date.setHours(0, 0, 0, 0);
    //     var epocaBaixaInicio1 = new Date("1/15/" + date.getFullYear());// year is useless
    //     var epocaBaixaFim1 = new Date("5/31/" + date.getFullYear());
    //     var epocaBaixaInicio2 = new Date("9/30/" + date.getFullYear());
    //     var epocaBaixaFim2 = new Date("12/15/" + date.getFullYear());
    //     return ((date >= epocaBaixaInicio1 && date <= epocaBaixaFim1) ||
    //         (date >= epocaBaixaInicio2 && date <= epocaBaixaFim2))
    //   }
}
