import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaoReservaComponent } from './cartao-reserva.component';

describe('CartaoReservaComponent', () => {
  let component: CartaoReservaComponent;
  let fixture: ComponentFixture<CartaoReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartaoReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaoReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
