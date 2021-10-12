import { Component, OnInit } from '@angular/core';
import { HotelService } from '../hotel.service';
import { TipoQuartoService } from '../tipo-quarto.service';
import { Hotel } from '../../interfaces/hotel';
import { TipoDeQuarto } from '../../interfaces/tipo-de-quarto';
import { Reserva } from '../../interfaces/reserva';
import { AuthenticationService } from '../authentication.service';
import { DatePipe } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/interfaces/cliente';

@Component({
    selector: 'app-hotel',
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {
    hotel: Hotel = {
        _id: '',
        name: '',
        desc: '',
        email: '',
        phone: '',
        address: '',
        gps: '',
        photo_path: [],
        servicos: [],
        tQuartos: []
    };

    totalNumQuartos = 0;

    photoIndex = 0;

    listTQuartos: TipoDeQuarto[] = [];

    currentClient: Cliente;

    constructor(private hotelService: HotelService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        public datepipe: DatePipe) {
        this.authenticationService.currentClient.subscribe(cliente => {
            this.currentClient = cliente;
        });
    }

    ngOnInit(): void {
        this.getHotel();
    }

    hasCurrentClient() {
        return this.currentClient != null;
    }

    getHotel() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.hotelService.getHotel(id).subscribe((hotel) => {
                // Load Hotel
                this.hotel = hotel as Hotel;

                // Loads numQuartos
                this.getNumQuartos();

                // Loads list to show and filter
                this.listTQuartos = this.hotel.tQuartos;
            });
        }
    }

    //Gets total number of rooms of this Hotel
    getNumQuartos() {
        var count = 0;
        for (var tipo of this.hotel.tQuartos) count += tipo.quartos.length;

        this.totalNumQuartos = count;
    }

    //Updates image for the left arrow
    leftImage() {
        this.updateImage(-1);
    }

    //Updates image for the right arrow
    righImage() {
        this.updateImage(+1);
    }

    //Updates image
    updateImage(n: number) {
        var len = this.hotel.photo_path.length;
        this.photoIndex = ((this.photoIndex + n) % len + len) % len;
    }

    //Navigates to a section of the page
    navigateToSection(section: string) {
        window.location.hash = '';
        window.location.hash = section;
    }

    cleanList() {
        // Cleans values for price
        (document.getElementById('precoMinUt') as HTMLInputElement).value = '';
        (document.getElementById('precoMaxUt') as HTMLInputElement).value = '';
        // Cleans list
        this.listTQuartos = this.hotel.tQuartos.slice();
    }

    updateList() {
        // Gets values
        var min = (document.getElementById('precoMinUt') as HTMLInputElement).value;
        var max = (document.getElementById('precoMaxUt') as HTMLInputElement).value;

        // Updates list
        this.listTQuartos = this.getTQuartoBetween(parseInt(min), parseInt(max));
    }

    // private Used by updateList()
    getTQuartoBetween(low: number, high: number) {
        // Function returns all TipoDeQuarto that are between low and high prices
        var tQuartosList: TipoDeQuarto[] = [];
        for (var tQuarto of this.hotel.tQuartos)
            if (
                (low <= tQuarto.lowPrice && tQuarto.lowPrice <= high) || // Low Price inside range
                (low <= tQuarto.highPrice && tQuarto.highPrice <= high) // High Price also inside range
            )
                tQuartosList.push(tQuarto);

        return tQuartosList;
    }

    getCheapestPrice() {
        var low = this.getLowCheapest();
        var high = this.getHighCheapest();
        return low < high ? low : high;
    }

    getLowCheapest() {
        // This function is used just to prevend nulls
        var cheapest = this.getCheapestTQuarto();
        return cheapest ? cheapest.lowPrice : 0;
    }

    getHighCheapest() {
        // This function is used just to prevend nulls
        var cheapest = this.getCheapestTQuarto();
        return cheapest ? cheapest.highPrice : 0;
    }

    getCheapestTQuarto() {
        // Function returns the TipoDeQuarto with the lowestPrice
        var cheapest: TipoDeQuarto;

        for (var tQuarto of this.hotel.tQuartos)
            if (
                !cheapest || // same as != null
                tQuarto.lowPrice < cheapest.lowPrice ||
                tQuarto.highPrice < cheapest.lowPrice
            )
                cheapest = tQuarto;

        return cheapest;
    }

    cleanListCheck() {
        // Cleans values
        (document.getElementById("date-in") as HTMLInputElement).value = '';
        (document.getElementById("date-out") as HTMLInputElement).value = '';

        this.clearEstimative();

        // Cleans list
        this.listTQuartos = this.hotel.tQuartos.slice();
    }

    updateListCheck() {
        // Gets values
        var check_in = (document.getElementById("date-in") as HTMLInputElement).value;
        var check_out = (document.getElementById("date-out") as HTMLInputElement).value;
        // Updates list
        this.listTQuartos = this.getTQuartoBetweenDates(new Date(check_in), new Date(check_out));

        this.updateEstimative(new Date(check_in), new Date(check_out));
    }

    getTQuartoBetweenDates(check_in: Date, check_out: Date) {

        localStorage.setItem("checkin", JSON.stringify(check_in));
        localStorage.setItem("checkout", JSON.stringify(check_out));

        var new_list: TipoDeQuarto[] = [];

        for (var tQuarto of this.hotel.tQuartos) {

            if (tQuarto.quartos.length == 0)
                continue;

            var free = true;

            for (var quarto of tQuarto.quartos) {
                free = true;
                for (var reserva of quarto.reservas) {
                    // If any Reserva occupies Quarto, then it's not free
                    if (!this.isFreeForDate(check_in, check_out, reserva)) {
                        free = false;
                        break;
                    }

                }

                if (free)
                    break;
            }

            if (free)
                new_list.push(tQuarto);
        }
        return new_list;
    }

    isFreeForDate(check_in: Date, check_out: Date, reserva: Reserva) {
        return !(check_in <= new Date(reserva.checkout) && new Date(reserva.checkin) <= check_out);
    }

    clearEstimative() {
        // Should make div disappear
        //document.getElementById("precoReserva").style.display = 'none';

        for (var tipoQuarto of this.listTQuartos)
            (document.getElementById(tipoQuarto._id) as HTMLSpanElement).innerHTML = "";
    }

    updateEstimative(check_in: Date, check_out: Date) {
        // Make div appear
        //(document.getElementById("precoReserva") as HTMLDivElement).style.display = 'block';

        // Updates Price for every
        for (var tipoQuarto of this.listTQuartos)
            (document.getElementById(tipoQuarto._id) as HTMLSpanElement).innerHTML =
                "Custo estimado: " + this.getPreçoEstimadoBetween(new Date(check_in), new Date(check_out), tipoQuarto) + "€";
    }

    // Epoca baixa : 15/1 até 31/5 : 30/9 até 15/12
    getPreçoEstimadoBetween(check_in: Date, check_out: Date, tipoQuarto: TipoDeQuarto) {
        if (check_in >= check_out)
            return 0;

        var price = 0;
        var date: Date = check_in;
        check_out.setHours(0, 0, 0, 0);
        while (date < check_out) { // se o checkout nao é pago
            price += this.isInEpocaBaixa(date) ? tipoQuarto.lowPrice : tipoQuarto.highPrice;
            date = new Date(date.getTime() + (1000 * 60 * 60 * 24)); //adicionar um dia em ms
        }

        return price;
    }

    isInEpocaBaixa(date: Date) {
        date.setHours(0, 0, 0, 0);
        var epocaBaixaInicio1 = new Date("1/15/" + date.getFullYear());// year is useless
        var epocaBaixaFim1 = new Date("5/31/" + date.getFullYear());
        var epocaBaixaInicio2 = new Date("9/30/" + date.getFullYear());
        var epocaBaixaFim2 = new Date("12/15/" + date.getFullYear());
        return ((date >= epocaBaixaInicio1 && date <= epocaBaixaFim1) ||
            (date >= epocaBaixaInicio2 && date <= epocaBaixaFim2))
    }

    iniciarReserva(tQuarto: TipoDeQuarto) {

      if(localStorage.getItem("checkin") != null && localStorage.getItem("checkout") != null){
          var checkin = JSON.parse(localStorage.getItem("checkin"));
          var checkout = JSON.parse(localStorage.getItem("checkout"));
      };

      localStorage.setItem("tipoquarto", JSON.stringify(tQuarto));

      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigate(['hotel/' + id + '/criar-reserva']);
    }

}
