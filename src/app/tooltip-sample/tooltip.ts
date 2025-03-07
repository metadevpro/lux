import { Component } from '@angular/core';
@Component({
  standalone: false,
  template: `
    <span class="lux-tooltip" style="transition: opacity 200ms"
      >Top Component</span
    >
  `
})
export class TooltipComponent {
  constructor() {}
}
