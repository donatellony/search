import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {concat, forkJoin, merge, Observable} from "rxjs";
import {Category} from "../app.component";
import {first} from "rxjs/operators";

const URL_BASE = 'https://swapi.dev/api/';

export interface swapiResult {
  count: number,
  next: string,
  previous: string,
  results: any[]
}

@Injectable({
  providedIn: 'root',
})

export class SearchService {

  result: swapiResult;
  requestsArr: Observable<swapiResult>[];

  constructor(private http: HttpClient) {
  }


  getSearchResults(category: Category, searchString: string): Observable<swapiResult> {
    let toContinue = true;
    this.requestsArr = [];
    this.result = {
      count: 0,
      next: '',
      previous: '',
      results: []
    }
    for (let page = 1; (page < 10) && toContinue; page++) {                    //Wiem, że to powinno być zrobione poprzez callbacki
      let url = `${URL_BASE}${category}/?search=${searchString}&page=${page}`; //Ale nie wiem jak ich napisać w tej sytuacji
      this.http.get<swapiResult>(url).pipe(first())                            //Także zamiast for(...) ma być while(toContinue)
        .subscribe(res => {                                               //for jest wykorzystany na potrzeby testów.
            this.result.next = res.next;
            if (this.result.next == null || !this.result.next) {
              toContinue = false;
              console.log(page + ")" + " FINISH")
              return concat(...this.requestsArr);
            } else
              this.addToRequestsArr(this.http.get<swapiResult>(url));
          },
          error => {
            console.log(error.message)
            toContinue = false;
          });
    }
    return concat(...this.requestsArr);
  }

  addToRequestsArr(request: Observable<swapiResult>) {
    this.requestsArr.push(request);
  }
}
