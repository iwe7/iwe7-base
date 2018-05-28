// angular
import {
  OnDestroy,
  Injector,
  Input,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  RendererStyleFlags2
} from "@angular/core";
import { Location } from "@angular/common";
// rxjs
import { Subject, Observable, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil } from "rxjs/operators";
// others
import { Iwe7IcssService } from "iwe7-icss";
import { Iwe7TitleService } from "./iwe7-title.service";
// thirds parts
import * as _ from "lodash";

// services
import {
  Iwe7BaseInterface,
  Iwe7OnDestoryInterface,
  Iwe7LocationInterface,
  Iwe7IcssInterface,
  Iwe7PrefixInterface,
  Iwe7ThemeInterface,
  KeyValueInterface,
  KeyBooleanInterface,
  Iwe7ClassInterface,
  Iwe7TitleInterface,
  Iwe7TitleServiceInterface
} from "./interface";

export abstract class Iwe7BaseMode implements Iwe7BaseInterface {
  render: Renderer2;
  constructor(public injector: Injector) {
    this.render = this.injector.get(Renderer2);
  }
  destroy(): void {
    return this.render.destroy();
  }
  createElement(name: string, namespace?: string | null): any {
    return this.render.createElement(name, namespace);
  }
  createComment(value: string): any {
    return this.render.createComment(value);
  }
  createText(value: string): any {
    return this.render.createText(value);
  }
  appendChild(parent: any, newChild: any): void {
    return this.render.appendChild(parent, newChild);
  }
  insertBefore(parent: any, newChild: any, refChild: any): void {
    return this.render.insertBefore(parent, newChild, refChild);
  }
  removeChild(parent: any, oldChild: any): void {
    return this.render.removeChild(parent, oldChild);
  }
  selectRootElement(selectorOrNode: string | any): any {
    return this.render.selectRootElement(selectorOrNode);
  }
  parentNode(node: any): any {
    return this.render.parentNode(node);
  }
  // 下一个同胞
  nextSibling(node: any): any {
    return this.render.nextSibling(node);
  }
  setAttribute(
    el: any,
    name: string,
    value: string,
    namespace?: string | null
  ): void {
    return this.render.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el: any, name: string, namespace?: string | null): void {
    return this.render.removeAttribute(el, name, namespace);
  }
  addClass(el: any, name: string): void {
    return this.render.addClass(el, name);
  }
  removeClass(el: any, name: string): void {
    return this.render.removeClass(el, name);
  }
  setStyle(
    el: any,
    style: string,
    value: any,
    flags?: RendererStyleFlags2
  ): void {
    return this.render.setStyle(el, style, value, flags);
  }
  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    return this.render.removeStyle(el, style, flags);
  }
  setProperty(el: any, name: string, value: any): void {
    return this.render.setProperty(el, name, value);
  }
  setValue(node: any, value: string): void {
    return this.render.setValue(node, value);
  }
  classnames(classObj: KeyBooleanInterface): string {
    let classnames = "";
    _.forEach(classObj, (value, key) => {
      if (value) {
        classnames += ` ${key}`;
      }
    });
    return classnames;
  }
}

export abstract class BaseWithOnDestroy extends Iwe7BaseMode
  implements Iwe7OnDestoryInterface {
  destroyed$: Subject<boolean> = new Subject();
  constructor(injector: Injector) {
    super(injector);
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  listen(target: any, eventName: string): Observable<Event> {
    return fromEvent(target, eventName).pipe(
      takeUntil(this.destroyed$)
    ) as Observable<Event>;
  }
}

export abstract class BaseWithLocation extends BaseWithOnDestroy
  implements Iwe7LocationInterface {
  private _location$: Subject<any> = new Subject();
  location: Location;
  get locationStream(): Observable<any> {
    return this._location$.pipe(takeUntil(this.destroyed$));
  }
  constructor(public injector: Injector) {
    super(injector);
    this.location = this.injector.get(Location);
    this.location.subscribe(res => {
      this._location$.next(res);
    });
  }
  back() {
    this.location.back();
  }
}

export abstract class BaseWithIcss extends BaseWithLocation
  implements Iwe7IcssInterface {
  private _styleObj: KeyValueInterface = {};
  ele: ElementRef;
  icss: Iwe7IcssService;
  // style样式
  private style$: BehaviorSubject<KeyValueInterface>;

  @Input()
  set styleObj(val: { [key: string]: any }) {
    this._styleObj = _.defaultsDeep(val, this._styleObj);
    this.style$.next(this._styleObj);
  }
  get styleObj(): { [key: string]: any } {
    return this._styleObj;
  }

  constructor(injector: Injector) {
    super(injector);
    this._styleObj = {};
    this.style$ = new BehaviorSubject(this._styleObj);
    this.ele = this.injector.get(ElementRef);
    this.icss = this.injector.get(Iwe7IcssService);
    this.icss
      .init(this.style$.pipe(takeUntil(this.destroyed$)), this.ele)
      .subscribe(res => {});
  }
}

export abstract class BaseWithPrefix extends BaseWithIcss
  implements Iwe7PrefixInterface {
  prefixCls: string = "";
  constructor(injector: Injector, prefix: string = "") {
    super(injector);
    this.prefixCls = prefix;
    if (this.prefixCls !== "") {
      this.render.addClass(this.ele.nativeElement, this.prefixCls);
    }
  }
}

export abstract class BaseWithTheme extends BaseWithPrefix
  implements OnChanges, Iwe7ThemeInterface {
  @Input() theme: string = "default";
  constructor(injector: Injector, prefix: string = "") {
    super(injector, prefix);
  }
  ngOnChanges(changes: SimpleChanges) {
    if ("theme" in changes) {
      this.setTheme(changes.theme);
    }
  }

  // 设置主题
  setTheme(change: SimpleChange) {
    // 移除老主题
    if (change.previousValue) {
      this.render.removeClass(
        this.ele.nativeElement,
        `${this.prefixCls}-${change.previousValue}`
      );
    }
    // 添加新主题
    if (change.currentValue) {
      this.render.addClass(
        this.ele.nativeElement,
        `${this.prefixCls}-${change.previousValue}`
      );
    }
  }
}

export abstract class BaseWithClass extends BaseWithTheme
  implements OnChanges, Iwe7ClassInterface {
  // class样式
  private _classObj: { [key: string]: boolean } = {};
  @Input()
  get classObj(): { [key: string]: boolean } {
    return this._classObj;
  }
  set classObj(val: { [key: string]: boolean }) {
    this._classObj = _.defaultsDeep(val, this._classObj);
  }

  constructor(injector: Injector, prefix: string = "") {
    super(injector, prefix);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ("classObj" in changes) {
      this.updateClassObj();
    }
    super.ngOnChanges(changes);
  }

  // 设置class样式
  updateClassObj() {
    _.forEach(this.classObj, (value, key) => {
      if (value) {
        this.render.addClass(
          this.ele.nativeElement,
          `${this.prefixCls}-${key}`
        );
      } else {
        this.render.removeClass(
          this.ele.nativeElement,
          `${this.prefixCls}-${key}`
        );
      }
    });
  }
}

export abstract class BaseWithTitle extends BaseWithClass
  implements Iwe7TitleInterface {
  title: Iwe7TitleServiceInterface;
  constructor(injector: Injector, prefixCls: string = "") {
    super(injector, prefixCls);
    this.title = this.injector.get(
      Iwe7TitleService
    ) as Iwe7TitleServiceInterface;
    this.title
      .listener()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }
}
