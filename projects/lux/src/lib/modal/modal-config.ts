import { Injectable } from '@angular/core';

export interface LuxModalOptions {
    backdrop?: boolean;
}

@Injectable({providedIn: 'root'})
export class LuxModalConfig implements LuxModalOptions {
    backdrop = true;
}
