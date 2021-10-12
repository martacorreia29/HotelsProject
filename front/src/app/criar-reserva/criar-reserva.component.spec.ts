import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarReservaComponent } from './criar-reserva.component';

describe('CriarReservaComponent', () => {
  let component: CriarReservaComponent;
  let fixture: ComponentFixture<CriarReservaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarReservaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
