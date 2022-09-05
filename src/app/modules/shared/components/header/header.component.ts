import { Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { SearchService } from 'src/app/core/services/search/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private searchService: SearchService
  ) { }

  @Input() type!: string;

  componentDestroyer$: Subject<boolean> = new Subject;

  searchSubject$ = new Subject<string>();
  searchInput!: string;

  ngOnInit(): void {
    this.searchSubject$
    .pipe(
      takeUntil(this.componentDestroyer$),
      distinctUntilChanged(),
      debounceTime(600)
    )
    .subscribe(value => {
      this.searchService.setSearchValue(value);
    });
  }

  changeSearchValue(): void {
    this.searchSubject$.next(this.searchInput);
  }

}
