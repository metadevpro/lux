import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicerecognitionSampleComponent } from './voicerecognition-sample.component';

describe('VoicerecognitionSampleComponent', () => {
  let component: VoicerecognitionSampleComponent;
  let fixture: ComponentFixture<VoicerecognitionSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicerecognitionSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicerecognitionSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
