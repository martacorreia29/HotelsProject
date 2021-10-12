import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Cliente } from '../interfaces/cliente';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	public currentClientSubject: BehaviorSubject<Cliente>;
	public currentClient: Observable<Cliente>;

	baseUrl = 'http://localhost:3066/';
	// baseUrl = 'http://appserver.alunos.di.fc.ul.pt:3066/';

	loginUrl = this.baseUrl + 'login';

	registerUrl = this.baseUrl + 'register';

	constructor(private http: HttpClient) {
		this.currentClientSubject = new BehaviorSubject<Cliente>(JSON.parse(localStorage.getItem('currentClient')));
		this.currentClient = this.currentClientSubject.asObservable();
	}

	public get currentClientValue(): Cliente {
		return this.currentClientSubject.value;
	}

	login(username: string, password: string) {
		return this.http.post(this.loginUrl, { username: username, password: password });
	}

	register(
		name: string,
		email: string,
		phone: number,
		address: string,
		nif: number,
		username: string,
		password: string
	) {
		return this.http.post(this.registerUrl, {
			name: name,
			email: email,
			phone: phone,
			address: address,
			nif: nif,
			username: username,
			password: password
		});
	}

	logout() {
		// remove client from local storage to log client out
		localStorage.removeItem('currentClient');
		this.currentClientSubject.next(null);
	}
}
