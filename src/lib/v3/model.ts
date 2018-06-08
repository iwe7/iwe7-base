import { Iwe7TitleService } from './iwe7-title.service';
import { Iwe7IcssService } from 'iwe7-icss';
import { ElementRef, Input, Injector, OnDestroy, Renderer2, SimpleChanges, SimpleChange } from '@angular/core';
import { Observable, BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Iwe7CoreComponent } from 'iwe7-core';
import { KeyValueInterface } from './interface';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { ucfirst } from 'iwe7-util';

export class Iwe7WithListen extends Iwe7CoreComponent {
    render: Renderer2;
    constructor(injector: Injector) {
        super(injector);
        this.render = this.injector.get(Renderer2);
    }
    listen(target: any, eventName: string): Observable<Event> {
        return fromEvent(target, eventName).pipe(
            takeUntil(this.getCyc('ngOnDestroy', true)),
            tap(res => {
                this.setCyc(`ngOn${ucfirst(eventName)}`, res);
            })
        ) as Observable<Event>;
    }
}

export class BaseWithIcss extends Iwe7WithListen {
    private styleInputs: string[] = [];
    ele: ElementRef;
    icss: Iwe7IcssService;
    @Input()
    set styleObj(val: { [key: string]: any }) {
        this.setCyc('ngStyle', val);
    }
    constructor(injector: Injector) {
        super(injector);
        this.runOutsideAngular(() => {
            this.ele = this.injector.get(ElementRef);
            this.icss = this.injector.get(Iwe7IcssService);
            this.icss
                .init(this.getCyc('ngStyle'), this.ele)
                .subscribe(res => { });
            this.getCyc('ngOnChanges').subscribe(res => {
                this.updateStyleObj();
            });
        });
    }

    setStyleInputs(val: string[]) {
        this.styleInputs = val;
        this.updateStyleObj();
    }

    private updateStyleObj() {
        this.styleInputs.forEach(item => {
            const styleObj = {};
            if (item in this) {
                styleObj[item] = this[item];
            }
            this.styleObj = styleObj;
        });
    }
}

export abstract class BaseWithLocation extends BaseWithIcss {
    location: Location;
    get locationStream(): Observable<any> {
        return this.getCyc('ngLocation', true);
    }
    constructor(public injector: Injector) {
        super(injector);
        this.location = this.injector.get(Location);
        this.location.subscribe(res => {
            this.setCyc('ngLocation', res, true);
        });
    }
    back() {
        this.location.back();
    }
}

export class BaseWithPrefix extends BaseWithLocation {
    _prefixCls: string = '';
    @Input()
    set prefixCls(val: string) {
        if (val && val !== this._prefixCls) {
            if (this._prefixCls) {
                this.render.removeClass(this.ele.nativeElement, this._prefixCls);
            }
            this.render.addClass(this.ele.nativeElement, val);
            this._prefixCls = val;
        }
    }
    get prefixCls() {
        return this._prefixCls;
    }
    constructor(injector: Injector, prefix: string = "") {
        super(injector);
        this.prefixCls = prefix;
    }
}

export class BaseWithTheme extends BaseWithPrefix {
    private _theme: string = "default";
    @Input()
    set theme(val: string) {
        if (val && val !== this._theme) {
            if (this._theme) {
                this.render.removeClass(
                    this.ele.nativeElement,
                    `${this.prefixCls}-${this._theme}`
                );
            }
            this.render.addClass(
                this.ele.nativeElement,
                `${this.prefixCls}-${val}`
            );
            this._theme = val;
        }
    }
    get theme() {
        return this._theme;
    }
    constructor(injector: Injector, prefix: string = "") {
        super(injector, prefix);
    }
}


export class BaseWithClass extends BaseWithTheme {
    // class样式
    private _classObj: { [key: string]: boolean } = {};
    @Input()
    get classObj(): { [key: string]: boolean } {
        return this._classObj;
    }
    set classObj(val: { [key: string]: boolean }) {
        this._classObj = _.defaultsDeep(val, this._classObj);
        this.updateClassObj();
    }

    constructor(injector: Injector, prefix: string = "") {
        super(injector, prefix);
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

export class BaseWithTitle extends BaseWithClass {
    title: Iwe7TitleService;
    constructor(injector: Injector, prefixCls: string = "") {
        super(injector, prefixCls);
        this.title = this.injector.get(
            Iwe7TitleService
        );
        this.title
            .listener()
            .pipe(takeUntil(this.getCyc('ngOnDestroy', true)))
            .subscribe();
    }
}
