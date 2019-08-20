import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, NgModule } from '@angular/core';

import { LuxTooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';
import { TooltipComponent } from './tooltip.component';

@Component({
    selector: 'lux-test-cmp',
    template: ''
})
class TestComponent {

    constructor() {}

    getTooltipTestComponent(): TooltipTestComponent {
        return TooltipTestComponent;
    }
}


@Component({
    template: `
        <span class="lux-tooltip" style="transition: opacity 200ms">Tooltip Component</span>
    `
})
class TooltipTestComponent {

    constructor()  { }

}


function createTestComponent(html: string): ComponentFixture<TestComponent> {
    const fixture = TestBed.overrideComponent(TestComponent, {
        set: {
            template: html
        }}).createComponent(TestComponent);
    fixture.detectChanges();
    return fixture as ComponentFixture<TestComponent>;
}

@NgModule({
    declarations: [ LuxTooltipDirective, TestComponent, TooltipComponent, TooltipTestComponent ],
    entryComponents: [TooltipComponent, TooltipTestComponent],
    providers: [ TooltipService ]
})
class TooltipTestModule {}

describe('TooltipDirective', () => {

    let tooltip: Element;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TooltipTestModule]
          })
          .compileComponents();
    });

    beforeEach(() => {
        if (tooltip) {
            tooltip.remove();
        }
    });

    it('it should be created component with tooltip declarative', () => {
        const fixture = createTestComponent('<button luxTooltip>Button with Tooltip</button>');
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('it should display default tooltip', () => {
        const fixture = createTestComponent('<button luxTooltip>Button Default</button>');
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain('Tooltip');
    });

    it('it should display default tooltip and close with mouseleave event', () => {
        const fixture = createTestComponent('<button luxTooltip>Button Default</button>');
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain('Tooltip');

        const evtLeave = document.createEvent('Event');
        evtLeave.initEvent('mouseleave', true, false);
        button.dispatchEvent(evtLeave);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeNull();
    });

    it('it should display default tooltip with top placement like default value', () => {
        const fixture = createTestComponent('<button luxTooltip>Button Default</button>');
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain('Tooltip');
        expect(tooltip.classList).toContain(`lux-tooltip-top`);
    });

    it('it should display tooltip with string content', () => {
        const fixture = createTestComponent('<button luxTooltip content="Custom Tooltip">Button String</button>');
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain('Custom Tooltip');
    });

    it('it should display tooltip in the left', () => {
        const placement = 'Left';
        const content = 'Custom Tooltip';
        const fixture = createTestComponent(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip in the right', () => {
        const placement = 'Right';
        const content = 'Custom Tooltip';
        const fixture = createTestComponent(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip in the top', () => {
        const placement = 'Top';
        const content = 'Custom Tooltip';
        const fixture = createTestComponent(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip in the bottom', () => {
        const placement = 'Bottom';
        const content = 'Custom Tooltip';
        const fixture = createTestComponent(`<button luxTooltip content="${content}" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip from TemplateRef', () => {
        const content = 'Tooltip TemplateRef';
        const fixture = createTestComponent(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate">Button with Tooltip</button>
        `);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-template`);
    });

    it('it should display tooltip from TemplateRef with Left placement', () => {
        const placement = 'Left';
        const content = 'Tooltip TemplateRef';
        const fixture = createTestComponent(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-template`);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip from TemplateRef with Right placement', () => {
        const placement = 'Right';
        const content = 'Tooltip TemplateRef';
        const fixture = createTestComponent(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-template`);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip from TemplateRef with Bottom placement', () => {
        const placement = 'Bottom';
        const content = 'Tooltip TemplateRef';
        const fixture = createTestComponent(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-template`);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip from TemplateRef with Top placement', () => {
        const placement = 'Top';
        const content = 'Tooltip TemplateRef';
        const fixture = createTestComponent(`
        <ng-template #contentTemplate>
            <span class="lux-tooltip lux-template" style="transition: opacity 200ms">${content}</span>
        </ng-template>
        <button luxTooltip [content]="contentTemplate" placement="${placement.toLowerCase()}">Button with Tooltip</button>
        `);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.innerHTML).toContain(content);
        expect(tooltip.classList).toContain(`lux-template`);
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
    });

    it('it should display tooltip from Component', () => {
        const fixture = createTestComponent(`<button luxTooltip [content]="getTooltipTestComponent()">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.classList).toContain(`lux-tooltip-top`);
        expect(tooltip.innerHTML).toContain('Tooltip Component');
    });

    it('it should display tooltip from Component', () => {
        const fixture = createTestComponent(`<button luxTooltip [content]="getTooltipTestComponent()">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.classList).toContain(`lux-tooltip-top`);
        expect(tooltip.innerHTML).toContain('Tooltip Component');
    });

    it('it should display tooltip from Component and close with mouseleave event', () => {
        const fixture = createTestComponent(`<button luxTooltip [content]="getTooltipTestComponent()">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.classList).toContain(`lux-tooltip-top`);
        expect(tooltip.innerHTML).toContain('Tooltip Component');

        const evtLeave = document.createEvent('Event');
        evtLeave.initEvent('mouseleave', true, false);
        button.dispatchEvent(evtLeave);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeNull();
    });

    it('it should display tooltip from Component with left placement', () => {
        const placement = 'Left';
        const fixture = createTestComponent(`<button luxTooltip [content]="getTooltipTestComponent()" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
        expect(tooltip.innerHTML).toContain('Tooltip Component');
    });

    it('it should display tooltip from Component with right placement', () => {
        const placement = 'Right';
        const fixture = createTestComponent(`
            <button luxTooltip [content]="getTooltipTestComponent()" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        console.log(placement.toLowerCase());
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
        expect(tooltip.innerHTML).toContain('Tooltip Component');
    });

    it('it should display tooltip from Component with bottom placement', () => {
        const placement = 'Bottom';
        const fixture = createTestComponent(`<button luxTooltip [content]="getTooltipTestComponent()" placement="${placement.toLowerCase()}">
                                            Button with Tooltip</button>`);
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeDefined();
        expect(tooltip.classList).toContain(`lux-tooltip-${placement.toLowerCase()}`);
        expect(tooltip.innerHTML).toContain('Tooltip Component');

        const evtLeave = document.createEvent('Event');
        evtLeave.initEvent('mouseleave', true, false);
        button.dispatchEvent(evtLeave);
        fixture.detectChanges();

        tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip).toBeNull();
    });

});
