import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class LogoService {

	baseUrl = 'http://localhost:3066/';
	//baseUrl = 'http://appserver.alunos.di.fc.ul.pt:3066/';
	logoUrl = this.baseUrl + 'logo';

	constructor(private http: HttpClient) { }

	getLogo() {
		return this.http.get(this.logoUrl);
	}
}
