import { Injectable } from '@angular/core';

/**
 * This services encapsulates all the access to Browser Voice Recognition
 */
@Injectable({ providedIn: 'root' })
export class VoiceRecognitionService {
    private speechService: any;
    public transcript: string;

    constructor(window: Window) {
        const speechServiceClass = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (speechServiceClass) {
            this.speechService = new speechServiceClass();
            this.speechService.interimResults = false;
            this.speechService.lang = 'en-US';
            this.speechService.maxAlternatives = 1;
            this.speechService.onresult = (event) => this.onResult(event);
        }
    }

    onResult(event: any): void {
       this.transcript = event.results[0][0].transcript;
    }

    configure(locale: string): void {
        if (this.speechService) {
            this.speechService.interimResults = false;
            this.speechService.lang = locale;
        }
    }

    start(): void {
        if (this.speechService) {
            this.speechService.start();
        }
    }
    stop(): string {
        if (this.speechService) {
            this.speechService.stop();
            return this.transcript;
        }
        return null;
    }
    abort(): void {
        if (this.speechService) {
            this.speechService.abort();
        }
    }

}
