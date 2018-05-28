import {
  Injectable,
  Type,
  Injector,
  ComponentFactoryResolver
} from "@angular/core";
import { NgElementConstructor } from "@angular/elements";
import { createCustomElement } from "@angular/elements";
import { Observable, of, from } from "rxjs";

declare const window: any;

export function factoryGlobalService() {
  (<any>window).meepo = (<any>window).meepo || {};
  let { meepo } = <any>window;
  meepo = meepo || {};
  meepo.elements = meepo.elements || new ElementService();
  (<any>window).meepo = meepo;
  return meepo.elements;
}

@Injectable({
  providedIn: "root",
  useFactory: factoryGlobalService
})
export class ElementService {
  map: Map<string, NgElementConstructor<any>> = new Map();

  constructor() {}

  init(injector: Injector) {
    const factoryResolver = injector.get(ComponentFactoryResolver);
    const _factories = (<any>factoryResolver)._factories;
    _factories.forEach((item, key) => {
      this.registerElement(
        "ele-" + item.selector,
        item.componentType,
        injector
      );
    });
  }

  set(key: string, item: NgElementConstructor<any>) {
    this.map.set(key, item);
  }

  get(key: string): NgElementConstructor<any> {
    return this.map.get(key);
  }

  registerElement(
    selector: string,
    type: Type<any>,
    injector: Injector
  ): Observable<string> {
    const element = customElements.get(selector);
    if (!element) {
      const ngElementConstructor = createCustomElement(type, {
        injector: injector
      });
      customElements.define(selector, ngElementConstructor);
      this.set(selector, ngElementConstructor);
      return from(customElements.whenDefined(selector).then(res => selector));
    } else {
      return of(selector);
    }
  }
}
