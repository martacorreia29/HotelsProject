import { Quarto } from './quarto';
import { Hotel } from './hotel';
import { TipoDeQuarto } from './tipo-de-quarto';

export interface PaymentCard {
    _id: string;
    number: string;
    cvv: Number;
    date: Date;
}

export interface Reserva {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    nif: string;
    hotel: Hotel;
    tipodequarto: TipoDeQuarto;
    quarto: Quarto;
    checkin: Date;
    checkout: Date;
    card: PaymentCard;
    preco: number;
}
