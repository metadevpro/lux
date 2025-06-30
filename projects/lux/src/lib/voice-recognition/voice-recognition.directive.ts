import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[luxVoiceRecognition]'
})
export class VoiceRecognitionDirective implements OnInit {
  @Input() language: string;
  // See API at: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
  private recognition: any;
  private isRecognizing = false;
  private mic: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    const speechRecognition = (window as any).webkitSpeechRecognition;
    if (speechRecognition) {
      this.recognition = new speechRecognition();
    }
  }

  ngOnInit(): void {
    if (this.recognition) {
      // API is available
      this.recognition.lang = this.language || window.navigator.language;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      // Add mic icon
      this.mic = document.createElement('div');
      this.mic.setAttribute('class', 'lux-microphone');

      const parent = this.el.nativeElement.parentElement;
      parent.appendChild(this.mic);

      // Add event handlers
      this.mic.onclick = (): void => this.microphoneClick();
      this.recognition.onresult = (event): void => this.onRecognized(event);
    }
  }

  microphoneClick(): void {
    if (this.isRecognizing) {
      // stop
      this.isRecognizing = false;
      this.renderer.removeClass(this.mic, 'lux-recording');
      this.recognition.abort();
    } else {
      // start
      this.el.nativeElement.value = getRecordingMessage(this.language);
      this.isRecognizing = true;
      this.renderer.addClass(this.mic, 'lux-recording');
      this.recognition.start();
    }
  }
  onRecognized(event: any): void {
    const recognizedText = event.results[0][0].transcript;
    this.isRecognizing = false;
    this.el.nativeElement.value = recognizedText;
    this.renderer.removeClass(this.mic, 'lux-recording');
  }
}

const getRecordingMessage = (lang: string): string => {
  switch (lang.toLowerCase()) {
    case 'es':
    case 'es-es':
      return 'Grabando...';
    case 'en':
    case 'en-uk':
    case 'en-us':
    default:
      return 'Recording...';
  }
};
