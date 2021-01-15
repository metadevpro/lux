import { Injectable, ApplicationRef, ComponentFactoryResolver,
         TemplateRef, ComponentRef, Inject, Injector, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ActiveModal, ModalRef } from './modal-ref';
import { ContentRef, focusTrap } from './util';
import { LuxModalWindowComponent } from './modal-window';
import { Subject } from 'rxjs';
import { LuxModalBackdropComponent } from './modal-backdrop';
import { LuxModalOptions, LuxModalConfig } from './modal-config';

@Injectable({providedIn: 'root'})
export class ModalStack {
    private _activeWindowCmptHasChanged = new Subject();
    private _modalRefs: ModalRef[] = [];
    private _windowCmpts: ComponentRef<LuxModalWindowComponent>[] = [];
    private _ariaHiddenValues: Map<Element, string> = new Map();

    constructor(
        private _applicationRef: ApplicationRef,
        @Inject(DOCUMENT) private _document: any,
        private _injector: Injector,
        private _rendererFactory: RendererFactory2,
        private modalConfig: LuxModalConfig
    ) {
      this._activeWindowCmptHasChanged.subscribe(() => {
        if (this._windowCmpts.length) {
          const activeWindowCmpt = this._windowCmpts[this._windowCmpts.length - 1];
          focusTrap(activeWindowCmpt.location.nativeElement, this._activeWindowCmptHasChanged);
          this._revertAriaHidden();
          this._setAriaHidden(activeWindowCmpt.location.nativeElement);
        }
      });
    }

    open(moduleCFR: ComponentFactoryResolver, content: any, options: LuxModalOptions): ModalRef {
        const config = Object.assign({}, this.modalConfig, options);
        const containerEl = this._document.body;
        const renderer = this._rendererFactory.createRenderer(null, null);
        const removeBodyClass = () => {
            if (!this._modalRefs.length) {
              renderer.removeClass(this._document.body, 'modal-open');
              this._revertAriaHidden();
            }
          };
        const activeModal = new ActiveModal();
        const contentRef = this.getContentRef(moduleCFR, content, activeModal);
        const backdropCmptRef: ComponentRef<LuxModalBackdropComponent> =
                                config.backdrop ? this._attachBackdrop(moduleCFR, containerEl) : null;
        const windowCmptRef: ComponentRef<LuxModalWindowComponent> = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
        const modalRef: ModalRef = new ModalRef(windowCmptRef, contentRef, backdropCmptRef);
        this._registerModalRef(modalRef);
        this._registerWindowCmpt(windowCmptRef);
        modalRef.result.then(removeBodyClass, removeBodyClass);
        activeModal.close = (result: any) => { modalRef.close(result); };
        activeModal.dismiss = (reason: any) => { modalRef.dismiss(reason); };
        if (this._modalRefs.length === 1) {
            renderer.addClass(this._document.body, 'modal-open');
        }
        return modalRef;
    }

    private _revertAriaHidden() {
        this._ariaHiddenValues.forEach((value, element) => {
          if (value) {
            element.setAttribute('aria-hidden', value);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });
        this._ariaHiddenValues.clear();
    }

    private getContentRef(moduleCFR: ComponentFactoryResolver, content: any, activeModal: ActiveModal): ContentRef {
        if (content instanceof TemplateRef) {
            return this.createFromTemplateRef(content, activeModal);
        }
    }

    private createFromTemplateRef(content: TemplateRef<any>, activeModal: ActiveModal): ContentRef {
        const context = {
            $implicit: activeModal,
            close(result) { activeModal.close(result); },
            dismiss(reason) { activeModal.dismiss(reason); }
        };
        const viewRef = content.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }

    private _attachBackdrop(moduleCFR: ComponentFactoryResolver, containerEl: any): ComponentRef<LuxModalBackdropComponent> {
      const backdropFactory = moduleCFR.resolveComponentFactory(LuxModalBackdropComponent);
      const backdropCmptRef = backdropFactory.create(this._injector);
      this._applicationRef.attachView(backdropCmptRef.hostView);
      containerEl.appendChild(backdropCmptRef.location.nativeElement);
      return backdropCmptRef;
    }

    private _attachWindowComponent(moduleCFR: ComponentFactoryResolver, containerEl: any, contentRef: any) {
        const windowFactory = moduleCFR.resolveComponentFactory(LuxModalWindowComponent);
        const windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }

    private _registerModalRef(modalRef: ModalRef) {
        const unregisterModalRef = () => {
          const index = this._modalRefs.indexOf(modalRef);
          if (index > -1) {
            this._modalRefs.splice(index, 1);
          }
        };
        this._modalRefs.push(modalRef);
        modalRef.result.then(unregisterModalRef, unregisterModalRef);
    }

    private _registerWindowCmpt(windowCmpt: ComponentRef<LuxModalWindowComponent>) {
        this._windowCmpts.push(windowCmpt);
        this._activeWindowCmptHasChanged.next();

        windowCmpt.onDestroy(() => {
            const index = this._windowCmpts.indexOf(windowCmpt);
            if (index > -1) {
            this._windowCmpts.splice(index, 1);
            this._activeWindowCmptHasChanged.next();
            }
        });
    }

    private _setAriaHidden(element: Element) {
      const parent = element.parentElement;
      if (parent && element !== this._document.body) {
        Array.from(parent.children).forEach(sibling => {
          if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
            this._ariaHiddenValues.set(sibling, sibling.getAttribute('aria-hidden'));
            sibling.setAttribute('aria-hidden', 'true');
          }
        });
        this._setAriaHidden(parent);
      }
    }

}