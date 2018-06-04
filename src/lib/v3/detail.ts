import { Iwe7PageBase } from "./page";
import { Injector } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
export abstract class Iwe7PageDetail extends Iwe7PageBase {
    id: string;
    route: ActivatedRoute;
    constructor(injector: Injector, prefix: string) {
        super(injector, prefix);
        this.route.params.subscribe(res => {
            this.id = res.id;
            this.params["id"] = this.id;
            this.http$.subscribe(res => {
                this.load(res);
            });
        });
    }

    abstract load(res: any): void;
}
