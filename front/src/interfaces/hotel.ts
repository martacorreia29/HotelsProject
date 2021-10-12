import { Servico } from './servico';
import { TipoDeQuarto } from './tipo-de-quarto';

export interface Hotel {
    _id:        string;
    name:       string;
    desc:       string;
    email:      string;
    phone:      string;
    address:    string;
    gps:        string;
    photo_path: string [];
    servicos:   Servico[];
    tQuartos:   TipoDeQuarto[];
}
