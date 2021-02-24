import {Component} from '@angular/core';
import {SearchService, swapiResult} from './services/search.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, pluck} from "rxjs/operators";

export type Category = 'people' | 'planets' | 'starships' | 'wrong_category';


const RESULTS = 'results',
  COUNT = 'count',
  NEXT = 'next',
  PREVIOUS = 'previous';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  results: any[]; //<swapiResult>?
  allReplies$: Observable<swapiResult>;
  searchString = '';
  searchStringChanged: Subject<string> = new Subject<string>();
  category: Category | null = null;
  categories: Category[] = ['people', 'planets', 'starships', 'wrong_category'];
  currentResultsCount: number
  previousResultsCount: number;
  toLoad$: Observable<boolean>;


  constructor(private search: SearchService) {
    this.previousResultsCount = 0;
    this.currentResultsCount = 0;
    this.results = [];
    this.searchStringChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchString => this.getResults(this.category, searchString));
  }

  getResults(category: Category, searchString: string) {
    if (!category || category === this.categories[3]) {
      return
    }
    this.previousResultsCount = this.currentResultsCount;
    this.currentResultsCount = 0;
    this.results = [];
    this.allReplies$ = this.search.getSearchResults(category, searchString);
    this.allReplies$.subscribe(reply => {
      this.currentResultsCount += reply.count;
      this.results = [...this.results, ...reply.results];
    });
  }

  change() {
    console.log(this.searchString, this.category);
    this.searchStringChanged.next(this.searchString);
  }

  loadMore() {
    console.log(this.searchString, this.category);
  }
}
