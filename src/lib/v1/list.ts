import { Iwe7PageBase } from "./page";
import { Injector } from "@angular/core";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";

export abstract class Iwe7PageList extends Iwe7PageBase {
  pi: number = 1;
  ps: number = 20;
  constructor(injector: Injector, prefix: string) {
    super(injector, prefix);
  }

  load(): Observable<any> {
    this.pi = 1;
    this.params["pi"] = this.pi;
    this.params["ps"] = this.ps;
    return this.http$;
  }

  loadMore(): Observable<any> {
    this.params["pi"] = this.pi++;
    this.params["ps"] = this.ps;
    return this.http$;
  }
}
