import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ModalService } from 'projects/lux/src/lib/modal/modal.service';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-modal-sample',
  styleUrls: ['modal-sample.component.scss'],
  templateUrl: './modal-sample.component.html'
})
export class ModalSampleComponent implements OnInit, AfterContentInit {

  message: string;

  constructor(private modalService: ModalService,
              private prismService: PrismService) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

  openModal(modal: any): void {
    this.modalService.open(modal).result.then(result => {
      this.message = result;
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  openModalWithoutBackdrop(modal: any) {
    this.modalService.open(modal, {backdrop: false}).result.then(result => {
      this.message = result;
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

}
