import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeQuartoComponent } from './tipo-de-quarto.component';

describe('TipoDeQuartoComponent', () => {
  let component: TipoDeQuartoComponent;
  let fixture: ComponentFixture<TipoDeQuartoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDeQuartoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeQuartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
