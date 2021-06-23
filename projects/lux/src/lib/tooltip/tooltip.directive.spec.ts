import { Component } from '@angular/core';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { LuxTooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';

@Component({
  template: `
    <span class="lux-tooltip" style="transition: opacity 200ms"
      >Tooltip Component</span
    >
  `
})
class TooltipTestComponent {}

describe('TooltipDirective', () => {
  let tooltip;
  const createDirective = createDirectiveFactory({
    directive: LuxTooltipDirective,
    providers: [TooltipService]
  });

  beforeEach(() => {
    if (tooltip) {
      tooltip.remove();
    }
  });

  it('it should be created component with tooltip declarative', () => {
    const spectator = createDirective(
      '<button luxTooltip>Button with Tooltip</button>'
    );
    expect(spectator.directive).toBeTruthy();
  });

  it('it should display no tooltip (label not defined)', () => {
    const spectator = createDirective(
      '<button luxTooltip>Button Default</button>'
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeNull();
  });

  it('it should display no default tooltip', () => {
    const spectator = createDirective(
      '<button luxTooltip>Button Default</button>'
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeNull();
  });

  it('it should display default tooltip with top placement like default value', () => {
    const spectator = createDirective(
      '<button luxTooltip content="A">Button Default</button>'
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain('A');
    expect(tooltip.classList).toContain('lux-tooltip-top');
  });

  it('it should display tooltip with string content', () => {
    const spectator = createDirective(
      '<button luxTooltip content="Custom Tooltip">Button String</button>'
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain('Custom Tooltip');
  });

  it('it should display tooltip in the left', () => {
    const placement = 'Left';
    const content = 'Custom Tooltip';
    const spectator =
      createDirective(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip in the right', () => {
    const placement = 'Right';
    const content = 'Custom Tooltip';
    const spectator =
      createDirective(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip in the top', () => {
    const placement = 'Top';
    const content = 'Custom Tooltip';
    const spectator =
      createDirective(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip in the bottom', () => {
    const placement = 'Bottom';
    const content = 'Custom Tooltip';
    const spectator =
      createDirective(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip from TemplateRef', () => {
    const content = 'Tooltip TemplateRef';
    const spectator = createDirective(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate">Button with Tooltip</button>
        `);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain('lux-template');
  });

  it('it should display tooltip from TemplateRef with Left placement', () => {
    const placement = 'Left';
    const content = 'Tooltip TemplateRef';
    const spectator = createDirective(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain('lux-template');
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip from TemplateRef with Right placement', () => {
    const placement = 'Right';
    const content = 'Tooltip TemplateRef';
    const spectator = createDirective(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain('lux-template');
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip from TemplateRef with Bottom placement', () => {
    const placement = 'Bottom';
    const content = 'Tooltip TemplateRef';
    const spectator = createDirective(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain('lux-template');
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip from TemplateRef with Top placement', () => {
    const placement = 'Top';
    const content = 'Tooltip TemplateRef';
    const spectator = createDirective(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.innerHTML).toContain(content);
    expect(tooltip.classList).toContain('lux-template');
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
  });

  it('it should display tooltip from Component', () => {
    const spectator = createDirective(
      '<button luxTooltip>Button with Tooltip</button>',
      {
        props: {
          content: TooltipTestComponent
        }
      }
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain('lux-tooltip-top');
    expect(tooltip.innerHTML).toContain('Tooltip Component');
  });

  it('it should display tooltip from Component', () => {
    const spectator = createDirective(
      '<button luxTooltip>Button with Tooltip</button>',
      {
        props: {
          content: TooltipTestComponent
        }
      }
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain('lux-tooltip-top');
    expect(tooltip.innerHTML).toContain('Tooltip Component');
  });

  it('it should display tooltip from Component and close with mouseleave event', () => {
    const spectator = createDirective(
      '<button luxTooltip>Button with Tooltip</button>',
      {
        props: {
          content: TooltipTestComponent
        }
      }
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain('lux-tooltip-top');
    expect(tooltip.innerHTML).toContain('Tooltip Component');

    spectator.dispatchMouseEvent(button, 'mouseleave');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeNull();
  });

  it('it should display tooltip from Component with left placement', () => {
    const placement = 'Left';
    const spectator = createDirective(
      `
        <button luxTooltip placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`,
      {
        props: {
          content: TooltipTestComponent
        }
      }
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
    expect(tooltip.innerHTML).toContain('Tooltip Component');
  });

  it('it should display tooltip from Component with right placement', () => {
    const placement = 'Right';
    const spectator = createDirective(
      `
            <button luxTooltip placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`,
      {
        props: {
          content: TooltipTestComponent
        }
      }
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
    expect(tooltip.innerHTML).toContain('Tooltip Component');
  });

  it('it should display tooltip from Component with bottom placement', () => {
    const placement = 'Bottom';
    const spectator = createDirective(
      `
        <button luxTooltip placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`,
      {
        props: {
          content: TooltipTestComponent
        }
      }
    );
    const button = spectator.query('button');

    spectator.dispatchMouseEvent(button, 'mouseenter');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeDefined();
    expect(tooltip.classList).toContain(
      `lux-tooltip-${placement.toLowerCase()}`
    );
    expect(tooltip.innerHTML).toContain('Tooltip Component');

    spectator.dispatchMouseEvent(button, 'mouseleave');

    tooltip = spectator.query('span.lux-tooltip', { root: true });
    expect(tooltip).toBeNull();
  });
});
