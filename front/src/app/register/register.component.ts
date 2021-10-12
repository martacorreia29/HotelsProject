import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { stringify } from 'querystring';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authenticationService: AuthenticationService
	) { }

	ngOnInit(): void {
		this.registerForm = this.formBuilder.group({
			name: '',
			morada: '',
			nif: '',
			phone: '',
			email: '',
			username: '',
			password: '',
		});
		// redirect to home if already logged in
		if (this.authenticationService.currentClientValue) {
			this.router.navigate(['/']);
		}
	}

	register(registrationData) {
		this.authenticationService
			.register(
				registrationData.name,
				registrationData.email,
				registrationData.phone,
				registrationData.morada,
				registrationData.nif,
				registrationData.username,
				registrationData.password
			)
			.subscribe((response) => {
				if (response['message']) {
					window.alert(response['message'][0].msg);
				} else {
					localStorage.setItem('currentClient', JSON.stringify(response['cliente']));
					this.authenticationService.currentClientSubject.next(response['cliente']);
					this.router.navigate(['/login']);
				}
			});
	}
}
