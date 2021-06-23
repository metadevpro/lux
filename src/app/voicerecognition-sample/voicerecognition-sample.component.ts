import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voicerecognition-sample',
  templateUrl: './voicerecognition-sample.component.html',
  styleUrls: ['./voicerecognition-sample.component.scss']
})
export class VoicerecognitionSampleComponent implements OnInit {
  langValue: string;

  ngOnInit(): void {
    this.langValue = window.navigator.language || 'en-US';
  }
}
