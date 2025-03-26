/* =============================================
    CONTROLLER INDEX LEYES
============================================= */
import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { DialogLeyComponent } from '../dialog-ley/dialog-ley.component';
import { LeyService } from '../../../../../../../service/gestion/registro/comercializacion/compra/Ley.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrincipalService } from '../../../../../../../service/principal/Principal.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-index-ley',
  standalone: true,
  imports: [TableModule, ProgressSpinnerModule, CommonModule, ConfirmDialogModule, DialogModule, FormsModule, DropdownModule, RadioButtonModule, ButtonModule, InputTextModule, InputTextareaModule, ToastModule, DialogLeyComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './index-ley.component.html',
  styleUrl: './index-ley.component.css'
})
export class IndexLeyComponent {

  /* ATTRIBUTES
 -------------------------*/
  // HEADER
  permissions!: any[];

  // BODY
  @Input() lote!: any;
  @Input() leyes!: any[];
  ley!: any;

  // STATE
  estado!: boolean;
  loading!: boolean;

  @ViewChild(DialogLeyComponent) dialog!: DialogLeyComponent;
  @Output() changeLeyes = new EventEmitter<any>();

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private principalService: PrincipalService,
    private messageService: MessageService,
    private leyService: LeyService,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.permissions = this.principalService.getPermissionsStorage('06.01');
  }

  // SHOW -> VIEW INDEX
  show() {
    this.estado = true;
    this.loading = true;
    console.log('REQUEST->index');
    this.leyService.index(this.lote.id).subscribe({
      next: (response) => {
        // HEADER
        this.permissions = this.principalService.getPermissionsStorage('06.01');
        // BODY
        this.leyes = response.leyes;
        this.changeLeyes.emit(this.leyes);
        console.log('RESPONSE->index', response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
        console.log('RESPONSE->index Error en:', error.error);
        if (error.status === 401) this.route.navigateByUrl('principal');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // SHOW -> VIEW CREATE
  showCreate() {
    this.dialog.showCreate(this.lote);
  }

  // SHOW -> VIEW SHOW
  showShow(ley: any) {
    this.dialog.showShow(ley);
  }

  // SHOW -> VIEW EDIT
  showEdit(ley: any) {
    this.dialog.showEdit(ley);
  }

  // SHOW -> VIEW DELETE
  showDelete(id: any) {

    // MODAL CONFIRMACIÓN
    this.confirmationService.confirm({
      message: 'Está seguro de eliminar el Registro...?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      // ELIMINACIÓN REGISTRO
      accept: () => {
        console.log('REQUEST->destroy', id);
        this.leyService.destroy(id).subscribe({
          next: (response) => {
            this.leyes = this.leyes.filter((val) => val.id !== id);
            this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg, life: 3000 });
            console.log('RESPONSE->destroy', response);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
            console.log('RESPONSE->destroy Error en:', error.error);
            if (error.status === 401) this.route.navigateByUrl('principal');
          }
        });
      }
    });
  }

  // HAS -> PERMISSION
  hasPermission(permiso: string) {
    return this.permissions.some((p: any) => p.id === permiso);
  }
}