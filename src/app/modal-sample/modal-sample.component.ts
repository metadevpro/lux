import { AfterContentInit, Component, inject } from '@angular/core';
import { ModalService } from 'projects/lux/src/lib/modal/modal.service';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  standalone: false,
  selector: 'app-modal-sample',
  styleUrls: ['modal-sample.component.scss'],
  templateUrl: './modal-sample.component.html'
})
export class ModalSampleComponent implements AfterContentInit {
  private modalService = inject(ModalService);
  private prismService = inject(PrismService);

  message: string;

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

  openModal(modal: any): void {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.message = result;
          console.log(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
  }

  openModalWithoutBackdrop(modal: any): void {
    this.modalService.open(modal, { backdrop: false }).result.then(
      (result) => {
        this.message = result;
        console.log(result);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
}
