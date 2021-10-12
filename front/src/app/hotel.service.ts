import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hotel } from '../interfaces/hotel';

@Injectable({
	providedIn: 'root'
})
export class HotelService {

	baseUrl = 'http://localhost:3066/';
	// baseUrl = 'http://appserver.alunos.di.fc.ul.pt:3066/';
	hoteisUrl = this.baseUrl + 'hoteis';
	hotelUrl = this.baseUrl + 'hotel/';

	constructor(private http: HttpClient) { }

	getHoteis() {
		return this.http.get(this.hoteisUrl);
	}

	getHotel(id: string) {
		const hotel = this.hotelUrl + id;
		return this.http.get(hotel);
	}
}
