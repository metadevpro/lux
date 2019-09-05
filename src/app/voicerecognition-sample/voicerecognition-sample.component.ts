import { Component, OnInit } from '@angular/core';
import { VoiceRecognitionComponent } from 'projects/lux/src/lib/voice-recognition/voice-recognition.component';

@Component({
  selector: 'app-voicerecognition-sample',
  templateUrl: './voicerecognition-sample.component.html',
  styleUrls: ['./voicerecognition-sample.component.scss']
})
export class VoicerecognitionSampleComponent implements OnInit {

  constructor(private voicerecognition: VoiceRecognitionComponent) { }

  ngOnInit() {
  }

}
