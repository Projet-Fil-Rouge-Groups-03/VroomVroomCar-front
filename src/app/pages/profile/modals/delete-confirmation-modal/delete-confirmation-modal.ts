import { Component, ElementRef, output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [],
  templateUrl: './delete-confirmation-modal.html',
  styleUrl: './delete-confirmation-modal.css',
})
export class DeleteConfirmationModal {
  @ViewChild('deleteDialog') dialog!: ElementRef<HTMLDialogElement>;

  confirmed = output<void>();
  title = 'Êtes-vous sûr ?';
  warningMessage: string | null = null;

  /**
   * Ouvre la modale avec des textes personnalisés.
   * @param title Le titre de la modale (ex: "Supprimer le trajet ?")
   * @param warningMessage Le message d'avertissement optionnel.
   */
  open(title: string, warningMessage: string | null = null): void {
    this.title = title;
    this.warningMessage = warningMessage;
    this.dialog.nativeElement.showModal();
  }

  close(): void {
    this.dialog.nativeElement.close();
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }
}
