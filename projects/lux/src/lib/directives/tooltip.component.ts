import { Component, Input } from '@angular/core';
import { LuxTooltipContext } from './tooltip-context';

@Component({
    template: `
        <span class="ng-tooltip" style="transition: opacity 200ms">{{context.message}}</span>
    `
})
export class TooltipComponent {

    @Input() context: LuxTooltipContext;

    constructor()  { }

}
