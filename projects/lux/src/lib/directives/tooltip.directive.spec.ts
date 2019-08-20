import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, NgModule } from '@angular/core';

import { LuxTooltipDirective } from './tooltip.directive';
import { TooltipService } from './tooltip.service';
import { By } from '@angular/platform-browser';
import { TooltipComponent } from './tooltip.component';

@Component({selector: 'lux-test-cmp', template: '<p>Hello</p>'})
export class TestComponent {
}

export function createTestComponent(html: string): ComponentFixture<TestComponent> {
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

fdescribe('TooltipDirective', () => {

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

    it('it should display default tooltip', async () => {
        const fixture = createTestComponent('<button luxTooltip>Button with Tooltip</button>');
        // const button: DebugElement = fixture.debugElement.nativeElement.querySelector('button');
        const directive: DebugElement = fixture.debugElement.query(By.directive(LuxTooltipDirective));
        // button.dispatchEvent(new Event('mouseenter'));
        /* button.triggerEventHandler('mouseenter', (res) => {
            console.log(res);
        }); */
        const evt = document.createEvent('Event');
        evt.initEvent('mouseenter', true, false);
        directive.nativeElement.dispatchEvent(evt);
        fixture.detectChanges();
        console.log(fixture);
    });

});
