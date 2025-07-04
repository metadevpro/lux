import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipComponent } from './tooltip.component';
import { LuxTooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';

@Component({
  standalone: true,
  template: '',
  imports: [LuxTooltipDirective]
})
class TooltipHostComponent {}

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

describe('LuxTooltipDirective', () => {
  function setupWithTemplate(
    template: string
  ): ComponentFixture<TooltipHostComponent> {
    TestBed.overrideComponent(TooltipHostComponent, {
      set: { template }
    });
    const fixture = TestBed.createComponent(TooltipHostComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        TooltipHostComponent,
        TooltipTestComponent,
        TooltipComponent,
        LuxTooltipDirective
      ],
      providers: [TooltipService]
    }).compileComponents();
  });

  function getTooltipFromBody(
    fixture: ComponentFixture<any>
  ): HTMLElement | null {
    return fixture.nativeElement.ownerDocument.body.querySelector(
      'span.lux-tooltip'
    );
  }

  it('should display tooltip with string content', fakeAsync(() => {
    const fixture = setupWithTemplate(
      // eslint-disable-next-line quotes
      `<button [luxTooltip]="'Custom Tooltip'">Hover me</button>`
    );
    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    tick(500);
    const tooltip = getTooltipFromBody(fixture);
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Custom Tooltip');
  }));

  it('should not display tooltip when no content is provided', fakeAsync(() => {
    // eslint-disable-next-line quotes
    const fixture = setupWithTemplate(`<button luxTooltip>Hover me</button>`);
    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    tick(500);
    const tooltip = getTooltipFromBody(fixture);
    expect(tooltip).toBeNull();
  }));

  ['top', 'bottom', 'left', 'right'].forEach((placement) => {
    it(`should display tooltip with placement ${placement}`, fakeAsync(() => {
      const fixture = setupWithTemplate(
        // eslint-disable-next-line quotes
        `<button [luxTooltip]="'Placed Tooltip'" [placement]="'${placement}'">Hover me</button>`
      );
      const button = fixture.nativeElement.querySelector('button');
      button.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      tick(500);
      const tooltip = getTooltipFromBody(fixture);
      expect(tooltip).toBeTruthy();
      expect(tooltip?.textContent).toContain('Placed Tooltip');
      expect(tooltip?.classList).toContain(`lux-tooltip-${placement}`);
    }));
  });

  it('should display tooltip using TemplateRef', fakeAsync(() => {
    const fixture = setupWithTemplate(`
      <ng-template #tpl>
        <span class="lux-tooltip">Template Tooltip</span>
      </ng-template>
      <button [luxTooltip]="tpl">Hover me</button>
    `);
    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    tick(500);
    const tooltip = getTooltipFromBody(fixture);
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Template Tooltip');
  }));

  it('should display tooltip using component as content', fakeAsync(() => {
    const componentType = TooltipTestComponent;
    const fixture = setupWithTemplate(`
      <button [luxTooltip]="componentType">Hover me</button>
    `);
    (fixture.componentInstance as any).componentType = componentType;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    tick(500);
    const tooltip = getTooltipFromBody(fixture);
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Tooltip Component');
  }));

  it('should hide tooltip on mouseleave', fakeAsync(() => {
    const fixture = setupWithTemplate(
      // eslint-disable-next-line quotes
      `<button [luxTooltip]="'Will Hide'">Hover me</button>`
    );
    const button = fixture.nativeElement.querySelector('button');
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    tick(500);
    expect(getTooltipFromBody(fixture)).toBeTruthy();
    button.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    tick(500);
    expect(getTooltipFromBody(fixture)).toBeNull();
  }));
});
