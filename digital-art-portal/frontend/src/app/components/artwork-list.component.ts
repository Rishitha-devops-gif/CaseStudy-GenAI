import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../services/artwork.service';
import { AuthService } from '../services/auth.service';
import { FeedbackService } from '../services/feedback.service';
import { Artwork } from '../models/artwork.model';

@Component({
  selector: 'app-artwork-list',
  template: `
    <div class="artwork-list-container">
      <h2>Digital Artworks</h2>
      
      <div class="filters">
        <input type="text" [(ngModel)]="tagFilter" placeholder="Filter by tags" class="form-control">
        <button (click)="applyFilter()" class="btn btn-secondary">Filter</button>
        <button (click)="clearFilter()" class="btn btn-secondary">Clear</button>
      </div>
      
      <div *ngIf="currentUser?.role === 'artist'" class="actions">
        <button (click)="showCreateForm = !showCreateForm" class="btn btn-primary">Add Artwork</button>
      </div>
      
      <div *ngIf="showCreateForm" class="create-form">
        <h3>Add New Artwork</h3>
        <form (ngSubmit)="createArtwork()">
          <input type="text" [(ngModel)]="newArtwork.title" name="title" placeholder="Title" required class="form-control">
          <textarea [(ngModel)]="newArtwork.description" name="description" placeholder="Description" required class="form-control"></textarea>
          <input type="url" [(ngModel)]="newArtwork.image_url" name="image_url" placeholder="Image URL" required class="form-control">
          <input type="text" [(ngModel)]="newArtwork.tags" name="tags" placeholder="Tags (comma separated)" class="form-control">
          <button type="submit" class="btn btn-success">Create</button>
          <button type="button" (click)="showCreateForm = false" class="btn btn-secondary">Cancel</button>
        </form>
      </div>
      
      <div class="artwork-grid">
        <div *ngFor="let artwork of artworks" class="artwork-card">
          <div class="image-container">
            <img [src]="artwork.image_url || 'https://via.placeholder.com/400x280/e8e8e8/666666?text=' + artwork.title" 
                 [alt]="artwork.title" 
                 class="artwork-image" 
                 (error)="onImageError($event)">
          </div>
          <div class="artwork-info">
            <h3>{{ artwork.title }}</h3>
          <p>{{ artwork.description }}</p>
          <p><strong>Artist:</strong> {{ artwork.artist_name }}</p>
          <p><strong>Tags:</strong> {{ artwork.tags }}</p>
          <div class="actions">
            <button (click)="viewArtwork(artwork)" class="btn btn-info">View Details</button>
            <button (click)="editArtwork(artwork)" class="btn btn-warning">Edit</button>
            <button (click)="deleteArtwork(artwork.id)" class="btn btn-danger">Delete</button>
            <button (click)="toggleFeedback(artwork.id)" class="btn btn-success">
              {{ currentUser?.role === 'curator' ? 'Add Review' : 'View Reviews' }}
            </button>
          </div>
          
          <!-- Feedback Section -->
          <div *ngIf="showFeedbackFor === artwork.id" class="feedback-section">
            <h4>Curator Reviews</h4>
            
            <!-- Existing Feedback -->
            <div *ngIf="artworkFeedback[artwork.id] && artworkFeedback[artwork.id].length > 0; else noFeedback">
              <div *ngFor="let feedback of artworkFeedback[artwork.id]" class="feedback-item">
                <div class="feedback-header">
                  <strong>{{ feedback.curator_name }}</strong>
                  <span class="rating">{{ '★'.repeat(feedback.rating) }}{{ '☆'.repeat(5-feedback.rating) }}</span>
                </div>
                <p>{{ feedback.comment }}</p>
                <small>{{ feedback.created_at | date:'short' }}</small>
              </div>
            </div>
            
            <ng-template #noFeedback>
              <p class="no-feedback">No curator reviews yet.</p>
            </ng-template>
            
            <!-- Add Feedback Form (Curators only) -->
            <div *ngIf="currentUser?.role === 'curator'" class="add-feedback">
              <h5>Add Your Review</h5>
              <form (ngSubmit)="submitFeedback(artwork.id)">
                <div class="rating-input">
                  <label>Rating:</label>
                  <select [(ngModel)]="newFeedback.rating" name="rating" required class="form-control">
                    <option value="1">1 ★</option>
                    <option value="2">2 ★★</option>
                    <option value="3">3 ★★★</option>
                    <option value="4">4 ★★★★</option>
                    <option value="5">5 ★★★★★</option>
                  </select>
                </div>
                <textarea [(ngModel)]="newFeedback.comment" name="comment" placeholder="Your professional review..." required class="form-control"></textarea>
                <button type="submit" class="btn btn-primary">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- View Details Modal -->
      <div *ngIf="showViewModal && selectedArtwork" class="modal">
        <div class="modal-content">
          <h3>{{ selectedArtwork.title }}</h3>
          <img [src]="selectedArtwork.image_url" [alt]="selectedArtwork.title" class="modal-image">
          <p><strong>Description:</strong> {{ selectedArtwork.description }}</p>
          <p><strong>Artist:</strong> {{ selectedArtwork.artist_name }}</p>
          <p><strong>Tags:</strong> {{ selectedArtwork.tags }}</p>
          <p><strong>Created:</strong> {{ selectedArtwork.created_at | date }}</p>
          <button (click)="closeViewModal()" class="btn btn-secondary">Close</button>
        </div>
      </div>
      
      <!-- Edit Form -->
      <div *ngIf="showEditForm && selectedArtwork" class="edit-form">
        <h3>Edit Artwork</h3>
        <form (ngSubmit)="updateArtwork()">
          <input type="text" [(ngModel)]="editArtworkData.title" name="editTitle" placeholder="Title" required class="form-control">
          <textarea [(ngModel)]="editArtworkData.description" name="editDescription" placeholder="Description" required class="form-control"></textarea>
          <input type="url" [(ngModel)]="editArtworkData.image_url" name="editImageUrl" placeholder="Image URL" required class="form-control">
          <input type="text" [(ngModel)]="editArtworkData.tags" name="editTags" placeholder="Tags (comma separated)" class="form-control">
          <button type="submit" class="btn btn-success">Update</button>
          <button type="button" (click)="cancelEdit()" class="btn btn-secondary">Cancel</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .artwork-list-container { padding: 20px; }
    .filters { margin: 20px 0; display: flex; gap: 10px; }
    .form-control { padding: 8px; margin: 5px 0; }
    .btn { padding: 8px 16px; margin: 5px; cursor: pointer; border: none; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-warning { background: #ffc107; color: black; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .artwork-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .artwork-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    .artwork-card { border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: white; transition: transform 0.2s, box-shadow 0.2s; }
    .artwork-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
    .image-container { width: 100%; height: 280px; overflow: hidden; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
    .artwork-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .artwork-image:hover { transform: scale(1.05); }
    .artwork-info { padding: 20px; }
    .artwork-info h3 { margin: 0 0 10px 0; color: #333; font-size: 1.2em; }
    .artwork-info p { margin: 5px 0; color: #666; line-height: 1.4; }
    .create-form { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .create-form input, .create-form textarea { width: 100%; margin: 5px 0; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 30px; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto; }
    .modal-image { width: 100%; max-height: 300px; object-fit: cover; margin: 10px 0; }
    .edit-form { background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ffeaa7; }
    .edit-form input, .edit-form textarea { width: 100%; margin: 5px 0; }
    .feedback-section { background: #f8f9fa; padding: 15px; margin-top: 15px; border-radius: 8px; border-top: 3px solid #28a745; }
    .feedback-item { background: white; padding: 12px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #17a2b8; }
    .feedback-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .rating { color: #ffc107; font-size: 1.1em; }
    .add-feedback { background: #e7f3ff; padding: 15px; margin-top: 15px; border-radius: 6px; }
    .rating-input { margin: 10px 0; }
    .rating-input select { width: auto; display: inline-block; margin-left: 10px; }
    .add-feedback textarea { width: 100%; height: 80px; margin: 10px 0; }
    .btn-success { background: #28a745; color: white; }
    .no-feedback { color: #666; font-style: italic; text-align: center; padding: 20px; }
  `]
})
export class ArtworkListComponent implements OnInit {
  artworks: Artwork[] = [];
  tagFilter = '';
  showCreateForm = false;
  currentUser = this.authService.getCurrentUser();
  newArtwork = { title: '', description: '', image_url: '', tags: '' };

  constructor(
    private artworkService: ArtworkService,
    private authService: AuthService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.artworkService.getArtworks().subscribe({
      next: (artworks) => this.artworks = artworks,
      error: (error) => console.error('Error loading artworks:', error)
    });
  }

  applyFilter(): void {
    const filters = this.tagFilter ? { tags: this.tagFilter } : {};
    this.artworkService.getArtworks(filters).subscribe({
      next: (artworks) => this.artworks = artworks,
      error: (error) => console.error('Error filtering artworks:', error)
    });
  }

  clearFilter(): void {
    this.tagFilter = '';
    this.loadArtworks();
  }

  createArtwork(): void {
    console.log('Creating artwork:', this.newArtwork);
    this.artworkService.createArtwork(this.newArtwork).subscribe({
      next: (result) => {
        console.log('Artwork created successfully:', result);
        this.loadArtworks();
        this.showCreateForm = false;
        this.newArtwork = { title: '', description: '', image_url: '', tags: '' };
        alert('Artwork created successfully!');
      },
      error: (error) => {
        console.error('Error creating artwork:', error);
        alert('Error creating artwork: ' + (error.error?.error || error.message));
      }
    });
  }

  canEdit(artwork: Artwork): boolean {
    return this.currentUser?.id === artwork.artist_id;
  }

  selectedArtwork: Artwork | null = null;
  showViewModal = false;
  showEditForm = false;
  editArtworkData = { title: '', description: '', image_url: '', tags: '' };
  showFeedbackFor: number | null = null;
  artworkFeedback: { [key: number]: any[] } = {};
  newFeedback = { rating: 5, comment: '' };

  viewArtwork(artwork: Artwork): void {
    this.selectedArtwork = artwork;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedArtwork = null;
  }

  editArtwork(artwork: Artwork): void {
    this.selectedArtwork = artwork;
    this.editArtworkData = {
      title: artwork.title,
      description: artwork.description,
      image_url: artwork.image_url,
      tags: artwork.tags
    };
    this.showEditForm = true;
  }

  updateArtwork(): void {
    if (this.selectedArtwork) {
      console.log('Updating artwork:', this.selectedArtwork.id, this.editArtworkData);
      this.artworkService.updateArtwork(this.selectedArtwork.id, this.editArtworkData).subscribe({
        next: (result) => {
          console.log('Update successful:', result);
          this.loadArtworks();
          this.showEditForm = false;
          this.selectedArtwork = null;
          alert('Artwork updated successfully!');
        },
        error: (error) => {
          console.error('Error updating artwork:', error);
          alert('Error updating artwork: ' + (error.error?.error || error.message));
        }
      });
    } else {
      console.error('No artwork selected for update');
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.selectedArtwork = null;
  }

  onImageError(event: any): void {
    const title = event.target.alt || 'Artwork';
    event.target.src = `https://via.placeholder.com/400x280/f0f0f0/666666?text=${encodeURIComponent(title)}`;
  }

  toggleFeedback(artworkId: number): void {
    if (this.showFeedbackFor === artworkId) {
      this.showFeedbackFor = null;
    } else {
      this.showFeedbackFor = artworkId;
      this.loadFeedback(artworkId);
    }
  }

  loadFeedback(artworkId: number): void {
    this.feedbackService.getFeedbackByArtwork(artworkId).subscribe({
      next: (feedback) => {
        this.artworkFeedback[artworkId] = feedback;
      },
      error: (error) => console.error('Error loading feedback:', error)
    });
  }

  submitFeedback(artworkId: number): void {
    const feedbackData = {
      artwork_id: artworkId,
      comment: this.newFeedback.comment,
      rating: this.newFeedback.rating
    };

    this.feedbackService.createFeedback(feedbackData).subscribe({
      next: () => {
        this.loadFeedback(artworkId);
        this.newFeedback = { rating: 5, comment: '' };
        alert('Feedback submitted successfully!');
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback: ' + (error.error?.error || error.message));
      }
    });
  }

  deleteArtwork(id: number): void {
    if (confirm('Are you sure you want to delete this artwork?')) {
      this.artworkService.deleteArtwork(id).subscribe({
        next: () => {
          this.loadArtworks();
          alert('Artwork deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting artwork:', error);
          alert('Error deleting artwork: ' + (error.error?.error || error.message));
        }
      });
    }
  }
}