import { TestBed } from '@angular/core/testing';

import { TipoQuartoService } from './tipo-quarto.service';

describe('TipoQuartoService', () => {
  let service: TipoQuartoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoQuartoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
