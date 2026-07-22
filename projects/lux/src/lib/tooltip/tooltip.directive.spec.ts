import { Component } from '@angular/core';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TooltipComponent } from './tooltip.component';
import { LuxTooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';

@Component({
  selector: 'lux-tooltip-test',
  standalone: true,
  template: `
    <span class="lux-tooltip" style="transition: opacity 200ms">
      Tooltip Component
    </span>
  `
})
class TooltipTestComponent {}

describe.skip('LuxTooltipDirective', () => {
  let spectator: SpectatorHost<LuxTooltipDirective>;
  const createHost = createHostFactory({
    component: LuxTooltipDirective,
    imports: [TooltipTestComponent, TooltipComponent, LuxTooltipDirective],
    providers: [TooltipService]
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function getTooltipFromBody(
    spectator: SpectatorHost<any>
  ): HTMLElement | null {
    return spectator.element.ownerDocument.body.querySelector(
      'span.lux-tooltip'
    );
  }

  it('should display tooltip with string content', () => {
    spectator = createHost(
      // eslint-disable-next-line quotes
      `<button [luxTooltip]="'Custom Tooltip'">Hover me</button>`
    );
    const button = spectator.query('button');
    expect(button).toBeTruthy();
    button!.dispatchEvent(new MouseEvent('mouseenter'));
    spectator.detectChanges();
    jest.advanceTimersByTime(500);
    const tooltip = getTooltipFromBody(spectator);
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Custom Tooltip');
  });

  it('should not display tooltip when no content is provided', () => {
    // eslint-disable-next-line quotes
    spectator = createHost(`<button luxTooltip>Hover me</button>`);
    spectator.detectChanges();
    const button = spectator.query('button');
    expect(button).toBeTruthy();
    button!.dispatchEvent(new MouseEvent('mouseenter'));
    spectator.detectChanges();
    jest.advanceTimersByTime(500);
    const tooltip = getTooltipFromBody(spectator);
    expect(tooltip).toBeNull();
  });

  ['top', 'bottom', 'left', 'right'].forEach((placement) => {
    it(`should display tooltip with placement ${placement}`, () => {
      spectator = createHost(
        `<button [luxTooltip]="'Placed Tooltip'" [placement]="'${placement}'">Hover me</button>`
      );
      spectator.detectChanges();
      const button = spectator.query('button');
      expect(button).toBeTruthy();
      button!.dispatchEvent(new MouseEvent('mouseenter'));
      spectator.detectChanges();
      jest.advanceTimersByTime(500);
      const tooltip = getTooltipFromBody(spectator);
      expect(tooltip).toBeTruthy();
      expect(tooltip?.textContent).toContain('Placed Tooltip');
      expect(tooltip?.classList).toContain(`lux-tooltip-${placement}`);
    });
  });

  it('should display tooltip using TemplateRef', () => {
    spectator = createHost(`
      <ng-template #tpl>
        <span class="lux-tooltip">Template Tooltip</span>
      </ng-template>
      <button [luxTooltip]="tpl">Hover me</button>
    `);
    spectator.detectChanges();
    const button = spectator.query('button');
    expect(button).toBeTruthy();
    button!.dispatchEvent(new MouseEvent('mouseenter'));
    spectator.detectChanges();
    jest.advanceTimersByTime(500);
    const tooltip = getTooltipFromBody(spectator);
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Template Tooltip');
  });

  it('should display tooltip using component as content', () => {
    spectator = createHost(
      '<button [luxTooltip]="componentType">Hover me</button>',
      {
        hostProps: {
          componentType: TooltipTestComponent
        }
      }
    );
    spectator.detectChanges();
    const button = spectator.query('button');
    expect(button).toBeTruthy();
    button!.dispatchEvent(new MouseEvent('mouseenter'));
    spectator.detectChanges();
    jest.advanceTimersByTime(500);
    const tooltip = getTooltipFromBody(spectator);
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Tooltip Component');
  });

  it('should hide tooltip on mouseleave', () => {
    spectator = createHost(
      // eslint-disable-next-line quotes
      `<button [luxTooltip]="'Will Hide'">Hover me</button>`
    );
    spectator.detectChanges();
    const button = spectator.query('button');
    expect(button).toBeTruthy();
    button!.dispatchEvent(new MouseEvent('mouseenter'));
    spectator.detectChanges();
    jest.advanceTimersByTime(500);
    expect(getTooltipFromBody(spectator)).toBeTruthy();
    button!.dispatchEvent(new MouseEvent('mouseleave'));
    spectator.detectChanges();
    jest.advanceTimersByTime(500);
    expect(getTooltipFromBody(spectator)).toBeNull();
  });
});
