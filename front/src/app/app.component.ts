import { Component } from '@angular/core';
import { LogoService } from './logo.service';
import { Cliente } from 'src/interfaces/cliente';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hóteis PSI';
  pathLogo;
  currentClient : Cliente = null;

  constructor(private logoService: LogoService, private authenticationService: AuthenticationService){
    this.authenticationService.currentClient.subscribe(cliente => {
      this.currentClient = cliente;
    });
  }

  ngOnInit(): void {
    this.logoService.getLogo().subscribe(logo => this.pathLogo = logo);
  }

  hasCurrentClient(){
    return this.currentClient != null;
  }

  logout() {
    this.authenticationService.logout();
  }
}
