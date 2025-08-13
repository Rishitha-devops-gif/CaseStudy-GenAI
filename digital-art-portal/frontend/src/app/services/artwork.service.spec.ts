import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArtworkService } from './artwork.service';
import { AuthService } from './auth.service';

describe('ArtworkService', () => {
  let service: ArtworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(ArtworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});