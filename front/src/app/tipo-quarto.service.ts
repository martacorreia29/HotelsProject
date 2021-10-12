import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoDeQuarto } from '../interfaces/tipo-de-quarto';

@Injectable({
	providedIn: 'root'
})
export class TipoQuartoService {

	baseUrl = 'http://localhost:3066/';
	// baseUrl = 'http://appserver.alunos.di.fc.ul.pt:3066/';
	tipoDeQuartoUrl = this.baseUrl + 'tipoDeQuarto/';

	constructor(private http: HttpClient) { }

	getTipoDeQuarto(id: string) {
		const tipoQuarto = this.tipoDeQuartoUrl + id;
		return this.http.get<TipoDeQuarto>(tipoQuarto);
	}
}
