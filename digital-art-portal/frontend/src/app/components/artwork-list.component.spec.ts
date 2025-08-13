import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ArtworkListComponent } from './artwork-list.component';
import { AuthService } from '../services/auth.service';
import { ArtworkService } from '../services/artwork.service';
import { FeedbackService } from '../services/feedback.service';

describe('ArtworkListComponent', () => {
  let component: ArtworkListComponent;
  let fixture: ComponentFixture<ArtworkListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtworkListComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [AuthService, ArtworkService, FeedbackService]
    });
    fixture = TestBed.createComponent(ArtworkListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty artworks', () => {
    expect(component.artworks).toEqual([]);
  });

  it('should validate feedback', () => {
    component.newFeedback = { comment: '', rating: 3 };
    spyOn(console, 'error');
    component.submitFeedback(1);
    expect(console.error).toHaveBeenCalled();
  });
});