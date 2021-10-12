import { Component, OnInit, ViewChildren } from '@angular/core';
import { Cliente } from 'src/interfaces/cliente';
import { Reserva } from 'src/interfaces/reserva';
import { ReservaService } from 'src/app/reserva.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { Hotel } from 'src/interfaces/hotel';
import { TipoDeQuarto } from 'src/interfaces/tipo-de-quarto';
import { DatePipe } from '@angular/common'
import { TipoQuartoService } from '../tipo-quarto.service';
import { HotelService } from '../hotel.service';


@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  currentClient: Cliente;
  reservas : Reserva [] = [];

  hoteis : Hotel [] = [];
  tiposQuarto : TipoDeQuarto [] = [];

  checkins : string [] = [];
  checkouts : string [] = [];
  @ViewChildren("myRange") slider;
  constructor(
    private authenticationService: AuthenticationService,
    private reservaService: ReservaService,
    public datepipe: DatePipe,
    private tipoQuartoService: TipoQuartoService,
    private hotelService: HotelService
    ) {

    this.authenticationService.currentClient.subscribe(cliente => {
      this.currentClient = cliente;
    });

  }

  ngOnInit(): void {
    this.getCliente();
  }
  ngAfterViewInit(){
    this.slider.changes.subscribe(t=>{
      (document.getElementById("myRange") as HTMLInputElement).max = this.getMaximumPrice() +"";}
    );
  }

  //Gets details of the currentUser
  getCliente(){
    const id = this.currentClient._id;
    if (id) {
			this.reservaService.getCliente(id).subscribe(client => {
        this.currentClient = client as Cliente;
        this.reservas = this.currentClient.reservas;
        this.formatDates();
      });
    }
  }
  //Formats dates
  formatDates(){
    this.checkins = [];
    this.checkouts = [];
    for(let reserva of this.reservas){
        //gets dates to format
        this.checkins.push(this.datepipe.transform(reserva.checkin, 'dd-MM-yyyy'));
        this.checkouts.push(this.datepipe.transform(reserva.checkout, 'dd-MM-yyyy'));
    }
  }

  //Verifies if Reservas is not empty
  hasReservas(){
    return this.currentClient.reservas.length > 0;
  }

  cleanListCheck() {
    // Cleans values
    (document.getElementById("date-in") as HTMLInputElement).value = '';
    (document.getElementById("date-out") as HTMLInputElement).value = '';
    // Cleans list
    this.reservas = this.currentClient.reservas.slice();
    this.formatDates();
  }

  updateListCheck() {
    // Gets values
    var check_in = (document.getElementById("date-in") as HTMLInputElement).value;
    var check_out = (document.getElementById("date-out") as HTMLInputElement).value;
    // Updates list
    this.reservas = this.getReservasBetweenDates(new Date(check_in), new Date(check_out));
    this.formatDates();
  }

  getReservasBetweenDates(check_in: Date, check_out: Date) {

    var new_list: Reserva[] = [];

    for (var reserva of this.currentClient.reservas) {
        if (this.isFreeForDate(check_in, check_out, reserva))
            new_list.push(reserva);
    }
    return new_list;
  }

  isFreeForDate(check_in: Date, check_out: Date, reserva: Reserva) {

      let reserva_checkin = new Date(this.datepipe.transform(reserva.checkin, 'yyyy-MM-dd'));
      let reserva_checkout = new Date(this.datepipe.transform(reserva.checkout, 'yyyy-MM-dd'));

      return (check_in <= reserva_checkin && check_in <= reserva_checkout) &&
          (check_out >= reserva_checkin && check_out >= reserva_checkout);
  }

  upDateListPrice() {
    var price = ( document.getElementById("myRange") as HTMLInputElement).value;
    document.getElementById("valuePrice").innerHTML = price;
    this.reservas = this.getReservasMoreThanPrice(+price);
  }

  getReservasMoreThanPrice(price: number){
    var reservasList: Reserva[] = [];
    for (var reserva of this.currentClient.reservas) {
      if(reserva.preco > price){
        reservasList.push(reserva);
      }
    }
    return reservasList;
  }

  cleanListPrice() {
    // Cleans values
    (document.getElementById("valuePrice") as HTMLInputElement).value = '';
    // Cleans list
    this.reservas = this.currentClient.reservas.slice();
  }

  getMaximumPrice(){
    var price = 0;
    for (var reserva of this.currentClient.reservas) {
      if(reserva.preco > price){
        price = reserva.preco;
      }
    }
    return price;
  }
}


