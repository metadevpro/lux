import { ViewRef, ComponentRef } from '@angular/core';

export class TooltipContentRef {
    constructor(public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}
}
