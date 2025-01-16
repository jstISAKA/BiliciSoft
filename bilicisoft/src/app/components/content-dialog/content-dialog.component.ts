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
    acting: 0,
    story: 0,
    visual: 0,
    sound: 0
  };

  constructor(private fb: FormBuilder) {
    this.contentForm = this.fb.group({
      title: ['', Validators.required],
      type: ['movie', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      director: [''],
      cast: [''],
      duration: [null],
      status: ['planned', Validators.required],
      platform: [''],
      seasonCount: [null],
      episodeCount: [null],
      currentEpisode: [null],
      watchDate: [null],
      rating: [null],
      personalRating: [this.personalRating],
      review: [''],
      mood: [null],
      tags: [''],
      posterUrl: [''],
      bannerUrl: [''],
      description: [''],
      personalNotes: [''],
      favorite: [false],
      recommendTo: [''],
      language: [''],
    });
  }

  ngOnInit() {
    if (this.content) {
      this.contentForm.patchValue({
        ...this.content,
        tags: this.content.tags?.join(', ') || '',
        cast: this.content.cast?.join(', ') || '',
        recommendTo: this.content.recommendTo?.join(', ') || ''
      });
      if (this.content.personalRating) {
        this.personalRating = this.content.personalRating;
      }
    }
  }

  rateAspect(aspect: 'acting' | 'story' | 'visual' | 'sound', rating: number) {
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
        ...formValue,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
        cast: formValue.cast ? formValue.cast.split(',').map((actor: string) => actor.trim()).filter((actor: string) => actor) : [],
        recommendTo: formValue.recommendTo ? formValue.recommendTo.split(',').map((person: string) => person.trim()).filter((person: string) => person) : []
      };
      this.save.emit(content);
    }
  }
} 