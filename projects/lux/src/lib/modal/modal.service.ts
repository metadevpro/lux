import { Injectable, TemplateRef, inject } from '@angular/core';
import { LuxModalOptions } from './modal-config';
import { ModalRef } from './modal-ref';
import { ModalStack } from './modal-stack';

/**
 * A service that it allow open an close modal components
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalStack = inject(ModalStack);

  /**Open a modal component
   * @param content TemplateRef
   */
  open(content: TemplateRef<any>, options: LuxModalOptions = {}): ModalRef {
    return this.modalStack.open(content, options);
  }
}
