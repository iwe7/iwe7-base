import { Subject, Observable } from "rxjs";
import {
  OnDestroy,
  ElementRef,
  SimpleChange,
  Renderer2,
  RendererStyleFlags2,
  Injector
} from "@angular/core";
import { Location } from "@angular/common";
import { Iwe7IcssService } from "iwe7-icss";

export interface KeyValueInterface {
  [key: string]: any;
}

export interface KeyBooleanInterface {
  [key: string]: boolean;
}

export interface Iwe7TitleServiceInterface {
  title: string;
  listener(): Observable<any>;
}

export interface Iwe7BaseInterface {
  render: Renderer2;
  injector: Injector;
  destroy(): void;
  createElement(name: string, namespace?: string | null): any;
  createComment(value: string): any;
  createText(value: string): any;
  appendChild(parent: any, newChild: any): void;
  insertBefore(parent: any, newChild: any, refChild: any): void;
  removeChild(parent: any, oldChild: any): void;
  selectRootElement(selectorOrNode: string | any): any;
  parentNode(node: any): any;
  nextSibling(node: any): any;
  setAttribute(
    el: any,
    name: string,
    value: string,
    namespace?: string | null
  ): void;
  removeAttribute(el: any, name: string, namespace?: string | null): void;
  addClass(el: any, name: string): void;
  removeClass(el: any, name: string): void;
  setStyle(
    el: any,
    style: string,
    value: any,
    flags?: RendererStyleFlags2
  ): void;
  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void;
  setProperty(el: any, name: string, value: any): void;
  setValue(node: any, value: string): void;
  classnames(classObj: KeyBooleanInterface): string;
}

export interface Iwe7OnDestoryInterface extends OnDestroy {
  destroyed$: Subject<boolean>;
  listen(target: any, eventName: string): Observable<Event>;
}

export interface Iwe7LocationInterface {
  location: Location;
  readonly locationStream: Observable<any>;
  back(): void;
}

export interface Iwe7IcssInterface {
  ele: ElementRef;
  icss: Iwe7IcssService;
  styleObj: KeyValueInterface;
}

export interface Iwe7PrefixInterface {
  prefixCls: string;
}

export interface Iwe7ThemeInterface {
  theme: string;
  setTheme(change: SimpleChange): void;
}

export interface Iwe7ClassInterface {
  classObj: KeyBooleanInterface;
  updateClassObj(): void;
}

export interface Iwe7TitleInterface {
  title: Iwe7TitleServiceInterface;
}
