import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private showSearchSource = new BehaviorSubject<boolean>(true);
  currentShowSearch = this.showSearchSource.asObservable();

  private searchTextSource = new BehaviorSubject<string>('');
  currentSearchText = this.searchTextSource.asObservable();

  constructor() { }

  changeShowSearch(showSearch: boolean) {
    this.showSearchSource.next(showSearch);
  }
  changeSearchText(searchText: string) {
    this.searchTextSource.next(searchText);
  }
}
