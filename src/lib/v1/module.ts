import { Injector, Type } from "@angular/core";
import { ElementService } from "./global.service";
import { Observable } from "rxjs";
export abstract class Iwe7BaseModule {
  public element: ElementService;
  constructor(public injector: Injector) {
    this.element = this.injector.get(ElementService);
  }
  registerElement(
    selector: string,
    type: Type<any>,
    injector: Injector
  ): Observable<string> {
    return this.element.registerElement(selector, type, injector);
  }
}
