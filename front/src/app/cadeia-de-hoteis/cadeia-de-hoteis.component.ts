import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../interfaces/hotel';
import { HotelService } from '../hotel.service';

@Component({
	selector: 'app-cadeia-de-hoteis',
	templateUrl: './cadeia-de-hoteis.component.html',
	styleUrls: [ './cadeia-de-hoteis.component.css' ]
})
export class CadeiaDeHoteisComponent implements OnInit {
	hoteis: Hotel[] = [];
	imgIndex: number[] = [];
	constructor(private hotelService: HotelService) {}

	ngOnInit(): void {
		this.getHoteis();
	}

	getHoteis(): void {
		this.hotelService.getHoteis().subscribe((hoteis) => {
			this.hoteis = hoteis as Hotel[];
			this.chooseImg();
		});
	}

	chooseImg(): void {
		this.hoteis.forEach((elem) => this.imgIndex.push(Math.floor(Math.random() * elem.photo_path.length)));
	}
}
