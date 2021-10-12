import { Quarto } from './quarto';
import { Servico } from './servico';

export interface TipoDeQuarto {
    _id:         string;
    name:        string;
    lowPrice:    number;
    highPrice:   number;
    servicos:    Servico[];
    quartos:     Quarto[];
}
