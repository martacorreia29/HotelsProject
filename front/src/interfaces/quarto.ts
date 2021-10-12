import { Reserva } from './reserva';

export interface Quarto {
    _id:        string;
    number:     Number;
    reservas:   Reserva[];
}
