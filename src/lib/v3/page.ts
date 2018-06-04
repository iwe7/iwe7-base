import { Component, OnInit, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseWithTitle } from "./model";
import { Iwe7UrlService } from "iwe7-url";
import { Observable } from "rxjs";
import { takeUntil, map } from "rxjs/operators";
export abstract class Iwe7PageBase extends BaseWithTitle {
    http: HttpClient;
    url: Iwe7UrlService;

    action: string = "web/base";
    params: { [key: string]: any } = {};

    get http$(): Observable<any> {
        return this.http
            .get(this.url.getWebOpen(this.action, this.params))
            .pipe(takeUntil(this.getCyc('ngOnDestroy', true)), map((res: any) => res.data));
    }

    constructor(injector: Injector, prefix: string) {
        super(injector, prefix);
        this.http = this.injector.get(HttpClient);
        this.url = this.injector.get(Iwe7UrlService);
    }
}
