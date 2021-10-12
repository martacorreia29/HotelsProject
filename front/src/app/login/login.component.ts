import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../interfaces/cliente';
import { AuthenticationService } from '../authentication.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService
	) { }
	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});

		// redirect to home if already logged in
		if (this.authenticationService.currentClientValue) {
			this.router.navigate(['/']);
		}
	}

	login(loginData) {
		this.authenticationService.login(loginData.username, loginData.password).subscribe((cliente) => {
			if (cliente) {
				localStorage.setItem('currentClient', JSON.stringify(cliente));
				this.authenticationService.currentClientSubject.next(cliente as Cliente);
				this.router.navigate(['/']);
			} else {
				window.alert('Username ou palavra-passe errados');
			}
		});
	}
}
