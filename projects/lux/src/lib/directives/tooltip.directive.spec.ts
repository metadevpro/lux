import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { LuxTooltipDirective } from './tooltip.directive';

@Component({selector: 'lux-test-cmp', template: ''})
export class TestComponent {
}

export function createTestComponent(html: string): ComponentFixture<TestComponent> {
    TestBed.overrideComponent(TestComponent, {set: {template: html}});
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture as ComponentFixture<TestComponent>;
}

fdescribe('TooltipDirective', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LuxTooltipDirective, TestComponent ]
          })
          .compileComponents();
    }));

    it('it should be created component with tooltip declarative', () => {
        const fixture = createTestComponent('<button luxTooltip>Button with Tooltip</button>');
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('it should display default tooltip', () => {
    });

});
