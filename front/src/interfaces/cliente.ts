import { Reserva } from './reserva';

export interface Cliente {
	_id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	nif: number;
	username: string;
	password: string;
	reservas: Reserva[];
}
