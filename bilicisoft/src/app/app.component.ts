import { Component, OnInit } from '@angular/core';
import { MediaContent } from './models/media.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchTerm = '';
  selectedType = 'all';
  selectedStatus = 'all';
  selectedSort = 'newest';
  selectedPlatform = 'all';
  showDialog = false;
  selectedContent: MediaContent | null = null;
  
  contentList: MediaContent[] = [];
  
  get watchingList() {
    return this.contentList.filter(item => item.status === 'watching');
  }
  
  get completedCount() {
    return this.contentList.filter(item => item.status === 'completed').length;
  }
  
  get plannedCount() {
    return this.contentList.filter(item => item.status === 'planned').length;
  }
  
  ngOnInit() {
    this.loadContent();
  }
  
  getPlatformName(platform: string): string {
    const platforms: { [key: string]: string } = {
      'netflix': 'Netflix',
      'prime': 'Amazon Prime',
      'disney': 'Disney+',
      'hbo': 'HBO Max',
      'apple': 'Apple TV+',
      'mubi': 'MUBI',
      'other': 'Diğer'
    };
    return platforms[platform] || platform;
  }
  
  get filteredContent(): MediaContent[] {
    return this.contentList
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesType = this.selectedType === 'all' || item.type === this.selectedType;
        const matchesStatus = this.selectedStatus === 'all' || item.status === this.selectedStatus;
        const matchesPlatform = this.selectedPlatform === 'all' || item.platform === this.selectedPlatform;
        return matchesSearch && matchesType && matchesStatus && matchesPlatform;
      })
      .sort((a, b) => {
        switch (this.selectedSort) {
          case 'newest':
            return b.year - a.year;
          case 'oldest':
            return a.year - b.year;
          case 'rating':
            const aRating = a.personalRating ? 
              Object.values(a.personalRating).reduce((sum, val) => sum + val, 0) / 4 : 
              a.rating || 0;
            const bRating = b.personalRating ? 
              Object.values(b.personalRating).reduce((sum, val) => sum + val, 0) / 4 : 
              b.rating || 0;
            return bRating - aRating;
          default:
            return 0;
        }
      });
  }
  
  openAddContentDialog() {
    this.selectedContent = null;
    this.showDialog = true;
  }
  
  editContent(content: MediaContent) {
    this.selectedContent = { ...content };
    this.showDialog = true;
  }
  
  closeDialog() {
    this.showDialog = false;
    this.selectedContent = null;
  }
  
  saveContent(content: MediaContent) {
    if (content.id) {
      this.contentList = this.contentList.map(item => 
        item.id === content.id ? content : item
      );
    } else {
      content.id = Date.now().toString();
      this.contentList.push(content);
    }
    
    this.saveToLocalStorage();
    this.closeDialog();
  }
  
  deleteContent(id: string) {
    if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      this.contentList = this.contentList.filter(item => item.id !== id);
      this.saveToLocalStorage();
    }
  }
  
  private loadContent() {
    const saved = localStorage.getItem('mediaContent');
    if (saved) {
      this.contentList = JSON.parse(saved);
    }
  }
  
  private saveToLocalStorage() {
    localStorage.setItem('mediaContent', JSON.stringify(this.contentList));
  }
}
