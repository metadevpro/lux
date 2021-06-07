import { Injectable } from '@angular/core';

export interface LuxModalOptions {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  backdrop?: boolean;
  keyboard?: boolean;
  windowClass?: string;
  backdropClass?: string;
}

@Injectable({ providedIn: 'root' })
export class LuxModalConfig implements LuxModalOptions {
  backdrop = true;
}
