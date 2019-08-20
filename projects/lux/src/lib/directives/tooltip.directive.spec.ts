import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, NgModule } from '@angular/core';

import { LuxTooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';
import { TooltipComponent } from './tooltip.component';

@Component({
    selector: 'lux-test-cmp',
    template: '<p>Hello</p>'
})
export class TestComponent {
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
    declarations: [ LuxTooltipDirective, TestComponent, TooltipComponent ],
    entryComponents: [TooltipComponent],
    providers: [ TooltipService ]
})
class TooltipTestModule {}

describe('TooltipDirective', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TooltipTestModule]
          })
          .compileComponents();
    });

    it('it should be created component with tooltip declarative', () => {
        const fixture = createTestComponent('<button luxTooltip>Button with Tooltip</button>');
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('it should display default tooltip', () => {
        const fixture = createTestComponent('<button luxTooltip="Tooltip ABC">Button with Tooltip</button>');
        const button = fixture.debugElement.nativeElement.querySelector('button');

        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        button.dispatchEvent(evt);
        fixture.detectChanges();

        const tooltip = fixture.nativeElement.parentElement.querySelector('span.lux-tooltip');
        expect(tooltip.innerHTML).toContain('Tooltip ABC');
    });

});
