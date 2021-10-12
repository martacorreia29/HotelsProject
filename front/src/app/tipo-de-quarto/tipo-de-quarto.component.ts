import { Component, OnInit, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { ActivatedRoute, UrlHandlingStrategy } from '@angular/router';

import { TipoQuartoService } from '../tipo-quarto.service';

import { TipoDeQuarto } from '../../interfaces/tipo-de-quarto';
import { Quarto } from '../../interfaces/quarto';
import { Reserva } from '../../interfaces/reserva';
import { collectExternalReferences } from '@angular/compiler';

@Component({
    selector: 'app-tipo-de-quarto',
    templateUrl: './tipo-de-quarto.component.html',
    styleUrls: ['./tipo-de-quarto.component.css']
})
export class TipoDeQuartoComponent implements OnInit {
    tipoQuarto: TipoDeQuarto = {
        _id: '',
        name: '',
        lowPrice: 0,
        highPrice: 0,
        servicos: [],
        quartos: []
    };

    constructor(private route: ActivatedRoute, private service: TipoQuartoService) { }

    ngOnInit(): void {
        this.getTipoQuarto();
    }

    getTipoQuarto() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.service.getTipoDeQuarto(id).subscribe((tipoQuarto) =>
                this.tipoQuarto = tipoQuarto as TipoDeQuarto
            );
        }
    }

    getNumQuartos() {
        return this.tipoQuarto.quartos.length;
    }

}