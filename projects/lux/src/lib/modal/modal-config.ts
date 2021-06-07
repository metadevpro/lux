import { Injectable } from '@angular/core';

export interface LuxModalOptions {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  backdrop?: boolean;
  centered?: string;
  keyboard?: boolean;
  scrollable?: string;
  size?: string;
  windowClass?: string;
  backdropClass?: string;
}

@Injectable({ providedIn: 'root' })
export class LuxModalConfig implements LuxModalOptions {
  backdrop = true;
}
