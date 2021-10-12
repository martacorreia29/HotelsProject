import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadeiaDeHoteisComponent } from './cadeia-de-hoteis.component';

describe('CadeiaDeHoteisComponent', () => {
  let component: CadeiaDeHoteisComponent;
  let fixture: ComponentFixture<CadeiaDeHoteisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadeiaDeHoteisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadeiaDeHoteisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
