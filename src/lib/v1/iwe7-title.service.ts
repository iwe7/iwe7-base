import { Injectable, Injector } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { from, merge, BehaviorSubject, Observable } from "rxjs";
import {
  map,
  tap,
  filter,
  switchMap,
  debounceTime,
  takeLast
} from "rxjs/operators";
import { Iwe7TitleServiceInterface } from "./interface";
@Injectable({
  providedIn: "root"
})
export abstract class Iwe7TitleService implements Iwe7TitleServiceInterface {
  private _title: string;
  get title() {
    return this._title;
  }
  set title(val: string) {
    this._title = val;
    this.__title.setTitle(val);
  }
  private route: ActivatedRoute;
  private router: Router;
  private __title: Title;

  datas: any[] = [];
  constructor(public injector: Injector) {}

  listener(): Observable<any> {
    this.router = this.injector.get(Router);
    return this.router.events.pipe(
      filter(res => res instanceof NavigationEnd),
      switchMap(res => {
        return this.updateTitle();
      })
    );
  }

  private updateTitle(): Observable<any> {
    this.route = this.injector.get(ActivatedRoute);
    this.__title = this.injector.get(Title);
    this.datas.push(this.route.data);
    return this.handel(this.route).pipe(
      tap(res => {
        this.title = res.title;
      })
    );
  }

  private handel(res: any): Observable<any> {
    return from(res.children).pipe(
      tap((res: any) => {
        this.datas.push(res.data);
      }),
      switchMap(res => {
        if (res.children.length > 0) {
          return this.handel(res);
        } else {
          return merge(this.datas).pipe(takeLast(1), switchMap(res => res));
        }
      })
    );
  }
}
