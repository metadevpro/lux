import { Component, NgModule, ViewChild } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { LuxModalBackdropComponent } from './modal-backdrop';
import { ModalRef } from './modal-ref';
import { LuxModalWindowComponent } from './modal-window';
import { ModalService } from './modal.service';

@Component({
  template: `
    <ng-template #modal1 let-modal>
      <div class="lux-modal-header">
        <h4 class="modal-title" id="modal-basic-title">
          Modal nesting example
        </h4>
        <button
          id="dismiss"
          type="button"
          class="close"
          aria-label="Close"
          (click)="modal.dismiss('Dismiss click')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="lux-modal-body">
        <p>Hello World</p>
      </div>
      <div class="lux-modal-footer">
        <button
          id="close"
          type="button"
          class="btn btn-outline-dark"
          (click)="modal.close('Close click')"
        >
          Close
        </button>
      </div>
    </ng-template>
  `
})
class TestComponent {
  @ViewChild('modal1', { static: false }) modal1: any;

  constructor(public modalService: ModalService) {}

  openModal1(): ModalRef {
    return this.modalService.open(this.modal1);
  }
}

@NgModule({
  providers: [ModalService],
  declarations: [
    TestComponent,
    LuxModalWindowComponent,
    LuxModalBackdropComponent
  ]
})
export class ModalTestModule {}

describe('Modal Tests', () => {
  let component: TestComponent;
  let spectator: Spectator<TestComponent>;
  const createModal = createComponentFactory({
    component: TestComponent,
    imports: [ModalTestModule]
  });

  beforeEach(() => {
    spectator = createModal();
    component = spectator.component;
  });

  it('should open and close modal', () => {
    // Arrange
    const modalInstance = component.openModal1();
    // Act
    spectator.detectChanges();
    // Assert
    let modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(1);

    // Arrange
    modalInstance.close();
    // Act
    spectator.detectChanges();
    // Assert
    modals = document.querySelector('body').querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(0);
  });

  it('should open modal and close with Exit result', (done) => {
    // Arrange
    const modalInstance = component.openModal1();
    // Act
    spectator.detectChanges();
    // Assert
    const modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(1);

    // Arrange
    modalInstance.result.then((result) => {
      // Assert
      expect(result).toBe('Exit');
      done();
    });
    // Act
    modalInstance.close('Exit');
  });

  it('should open modal and dismiss with reason', (done) => {
    // Arrange
    const modalInstance = component.openModal1();
    // Act
    spectator.detectChanges();
    // Assert
    const modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(1);

    // Arrange
    modalInstance.result.then(
      (_) => {},
      (reason) => {
        // Assert
        expect(reason).toBe('Closed');
        done();
      }
    );
    // Act
    modalInstance.dismiss('Closed');
  });

  it('should close modal with button inside', () => {
    // Arrange
    component.openModal1();
    // Act
    spectator.detectChanges();
    const button = document.querySelector('button#close') as HTMLElement;
    button.click();
    spectator.detectChanges();
    // Assert
    const modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(0);
  });

  it('should dismiss modal with button inside', () => {
    // Arrange
    component.openModal1();
    // Act
    spectator.detectChanges();
    const button = document.querySelector('button#dismiss') as HTMLElement;
    button.click();
    spectator.detectChanges();
    // Assert
    const modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(0);
  });

  it('should resolve result promise on close', () => {
    // Arrange
    let resolvedResult;
    component.openModal1().result.then((result) => {
      resolvedResult = result;
    });
    // Act
    spectator.detectChanges();
    const button = document.querySelector('button#close') as HTMLElement;
    button.click();
    spectator.detectChanges();
    // Assert
    const modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(0);
    spectator.fixture.whenStable().then(() => {
      expect(resolvedResult).toBe('Close click');
    });
  });

  it('should reject result promise on close', () => {
    // Arrange
    let rejectedResult;
    component.openModal1().result.catch((result) => {
      rejectedResult = result;
    });
    // Act
    spectator.detectChanges();
    const button = document.querySelector('button#dismiss') as HTMLElement;
    button.click();
    spectator.detectChanges();
    // Assert
    const modals = document
      .querySelector('body')
      .querySelectorAll('.lux-modal-body');
    expect(modals.length).toBe(0);
    spectator.fixture.whenStable().then(() => {
      expect(rejectedResult).toBe('Dismiss click');
    });
  });
});
