import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  searchValue = new Subject<string>();

  searchValue$ = this.searchValue.asObservable();

  setSearchValue(value: string) {
    this.searchValue.next(value);
  }
}
