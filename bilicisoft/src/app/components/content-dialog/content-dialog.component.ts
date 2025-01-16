import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaContent } from '../../models/media.model';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styleUrls: ['./content-dialog.component.scss']
})
export class ContentDialogComponent implements OnInit {
  @Input() content: MediaContent | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<MediaContent>();

  contentForm: FormGroup;
  
  moods: { value: 'happy' | 'sad' | 'excited' | 'bored' | 'confused'; label: string; icon: string; }[] = [
    { value: 'happy', label: 'Mutlu', icon: 'fas fa-smile' },
    { value: 'sad', label: 'Üzgün', icon: 'fas fa-frown' },
    { value: 'excited', label: 'Heyecanlı', icon: 'fas fa-grin-stars' },
    { value: 'bored', label: 'Sıkılmış', icon: 'fas fa-meh' },
    { value: 'confused', label: 'Kararsız', icon: 'fas fa-confused' }
  ];

  personalRating = {
    story: 0,
    acting: 0,
    visuals: 0,
    sound: 0
  };

  constructor(private fb: FormBuilder) {
    this.contentForm = this.fb.group({
      title: ['', Validators.required],
      type: ['movie', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      releaseYear: [null, [Validators.min(1900)]],
      status: ['planned', Validators.required],
      platform: [''],
      rating: [null],
      personalRating: [this.personalRating],
      tags: [''],
      posterUrl: [''],
      mood: [null],
      watchDate: [null]
    });
  }

  ngOnInit() {
    if (this.content) {
      this.contentForm.patchValue({
        title: this.content.title,
        type: this.content.type,
        year: this.content.year,
        releaseYear: this.content.releaseYear,
        status: this.content.status,
        platform: this.content.platform || '',
        rating: this.content.rating,
        posterUrl: this.content.posterUrl || '',
        tags: this.content.tags?.join(', ') || '',
        mood: this.content.mood,
        watchDate: this.content.watchDate
      });

      if (this.content.personalRating) {
        this.personalRating = {
          story: this.content.personalRating.story || 0,
          acting: this.content.personalRating.acting || 0,
          visuals: this.content.personalRating.visuals || 0,
          sound: this.content.personalRating.sound || 0
        };
        this.contentForm.patchValue({ personalRating: this.personalRating });
      }
    } else {
      this.contentForm.reset({
        type: 'movie',
        year: new Date().getFullYear(),
        status: 'planned',
        platform: '',
        rating: null,
        personalRating: this.personalRating
      });
    }
  }

  rateAspect(aspect: 'acting' | 'story' | 'visuals' | 'sound', rating: number) {
    this.personalRating[aspect] = rating;
    this.contentForm.patchValue({ personalRating: this.personalRating });
  }

  selectMood(mood: 'happy' | 'sad' | 'excited' | 'bored' | 'confused') {
    this.contentForm.patchValue({ mood });
  }

  onSubmit() {
    if (this.contentForm.valid) {
      const formValue = this.contentForm.value;
      const content: MediaContent = {
        id: this.content?.id || '',
        title: formValue.title,
        type: formValue.type,
        year: formValue.year,
        releaseYear: formValue.releaseYear,
        status: formValue.status,
        platform: formValue.platform,
        posterUrl: formValue.posterUrl,
        rating: formValue.rating,
        mood: formValue.mood,
        watchDate: formValue.watchDate,
        personalRating: {
          story: this.personalRating.story,
          acting: this.personalRating.acting,
          visuals: this.personalRating.visuals,
          sound: this.personalRating.sound
        },
        tags: formValue.tags ? 
          formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : 
          []
      };
      
      this.save.emit(content);
    }
  }
} 