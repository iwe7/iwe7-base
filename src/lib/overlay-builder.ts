import { Type, ComponentRef } from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";

export class OverlayBuilder {
  public modalRef: ComponentRef<any>;
  public overlayRef: OverlayRef;
  constructor(
    public overlay: Overlay,
    public options: any,
    public component: Type<any>
  ) {
    this.createModal();
    this.changeProps(options);
    this.modalRef.instance.open();
    this.modalRef.instance.afterClose.subscribe(() => this.destroyModal());
  }

  getInstance(): any {
    return this.modalRef && this.modalRef.instance;
  }

  destroyModal(): void {
    if (this.modalRef) {
      this.overlayRef.dispose();
      this.modalRef = null;
    }
  }

  private changeProps(options: any): void {
    // if (this.modalRef) {
    //   Object.assign(this.modalRef.instance, options);
    // }
  }

  private createModal(): void {
    this.overlayRef = this.overlay.create();
    this.modalRef = this.overlayRef.attach(new ComponentPortal(this.component));
  }
}
