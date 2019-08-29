import { Injectable, ComponentFactoryResolver, TemplateRef } from '@angular/core';
import { ModalStack } from './modal-stack';
import { ModalRef } from './modal-ref';
import { LuxModalOptions } from './modal-config';

/**
 * A service that it allow open an close modal components
 */
@Injectable({ providedIn: 'root' })
export class ModalService {

    constructor(private modalStack: ModalStack,
                private moduleCFR: ComponentFactoryResolver) { }

    /**
     * Open a modal component
     * @param content TemplateRef
     */
    open(content: TemplateRef<any>, options: LuxModalOptions = {}): ModalRef {
        return this.modalStack.open(this.moduleCFR, content, options);
    }

}
