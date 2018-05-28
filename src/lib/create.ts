import * as _ from "lodash";
import {
  Directive,
  TemplateRef,
  Type,
  Input,
  ViewContainerRef,
  Renderer2,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
export interface Iwe7Types {
  type: "text" | "icon" | "element" | "template" | "component";
  data?: any;
  params?: any;
}
export class Iwe7BaseCreate {
  _ngTemplateTypeString: Iwe7Types;
  defaultComponent: Type<any>;
  doc: Document;
  render: Renderer2;
  componentFactoryResolver: ComponentFactoryResolver;

  amIcon: Type<any>;
  amInnerHtml: Type<any>;
  amAppend: Type<any>;

  @Input()
  set ngTemplateTypeString(val: Iwe7Types) {
    if (!val) {
      return;
    }
    if (typeof val === "string") {
      this.createString(val, "text");
    }
    if (typeof val === "object") {
      if (val.type === "text") {
        this.createString(val.data, "text");
      } else if (val.type === "icon") {
        this.createString(val.data, "icon");
      } else if (val.type === "element") {
        this.createString(val.data, "element", val.params);
      } else if (val.type === "template") {
        this.createEmbeddedView(val.data, val.params);
      } else {
        this.createComponent(val.data, val.params);
      }
    }
    this._ngTemplateTypeString = val;
  }
  get ngTemplateTypeString() {
    return this._ngTemplateTypeString;
  }
  @Input() ngTemplateTypeStringParams: any = {};

  constructor(public injector: Injector, public view: ViewContainerRef) {
    this.render = this.injector.get(Renderer2);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
    this.doc = this.injector.get(DOCUMENT);
  }

  createIcon(name: string) {
    return this.createComponent(this.amIcon, { name: name });
  }

  createText(text: string) {
    return this.createComponent(this.amInnerHtml, { text: text });
  }

  createAppend(ele: HTMLElement) {
    return this.createComponent(this.amAppend, { ele: ele });
  }

  createElement(selector: string, data: any = {}) {
    const ele = this.doc.createElement(selector);
    for (const key in data) {
      ele[key] = data[key];
    }
    return ele;
  }

  createString(text: string, type: string = "text", data: any = {}) {
    let ele: HTMLElement;
    if (type === "text") {
      this.createText(text);
    } else if (type === "icon") {
      this.createIcon(text);
    } else if (type === "element") {
      ele = this.createElement(text, data);
      this.createComponent(this.defaultComponent, {
        html: ele
      });
    } else {
      this.createComponent(this.defaultComponent, data);
    }
  }

  createComponent(comp: Type<any>, data: any = {}) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      comp
    );
    const componentRef = this.view.createComponent(componentFactory);
    const instance = componentRef.instance;
    for (const key in data) {
      instance[key] = data[key];
    }
  }

  createEmbeddedView(ref: TemplateRef<any>, data?: any) {
    this.view.createEmbeddedView(ref, {
      $implicit: data
    });
  }
}
