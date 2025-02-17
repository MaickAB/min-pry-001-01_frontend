/* ==================================
        CONTROLLER EDIT EMPRESA
================================== */
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { EmpresaService } from '../../../../../../service/gestion/codificador/recursoMaterial/Empresa.service';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Empresa } from '../../../../../utility/models/gestion/codificador/recursoMaterial/Empresa';



@Component({
  selector: 'app-edit-empresa',
  standalone: true,
  imports: [ProgressSpinnerModule, FormsModule, InputTextModule, InputTextareaModule, ButtonModule, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './edit-empresa.component.html',
  styleUrl: './edit-empresa.component.css'
})
export class EditEmpresaComponent implements OnInit {

  /* ATTRIBUTES
 -------------------------*/
  //  HEADER

  // BODY
  imgUrl!: string;
  imgValida!: boolean;
  empresa!: Empresa;

  // STATE
  loading: boolean = false;
  saving!: boolean;

  /* METHODS
  -------------------------*/
  constructor(
    private route: Router,
    private messageService: MessageService,
    private empresaService: EmpresaService) {
  };

  ngOnInit() {
    this.show();
  }

  // SHOW -> VIEW CREATE
  show() {
    this.loading = true;
    this.saving = false;
    console.log('REQUEST->edit');
    this.empresaService.edit().subscribe({
      next: (response) => {
        if (response.empresa) {
          this.empresa = response.empresa;
          this.imgUrl = response.empresa.logo;
          this.imgValida = true;
        }
        else {
          this.empresa = { codigo: '', nombre: '', descripcion: '', direccion: '', fono: '', logo: '' };
          this.imgValida = false;
        }
        console.log('RESPONSE->edit', response);
      },
      error: (error) => {
        console.log('RESPONSE-> Error en:', error.error)
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // UPDATE -> DATA
  save() {
    if (this.validate()) {
      console.log('REQUEST-> update', this.empresa);
      this.empresaService.update(this.empresa).subscribe({
        next: (response) => {
          this.empresa = response.empresa;
          this.messageService.add({ severity: 'success', summary: 'CONFIRMACIÓN', detail: response.msg });
          console.log('RESPONSE->update', response);
          setTimeout(async () => { await this.navDashboard(); }, 500);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: error.error.message });
          console.log('RESPONSE->update Error en:', error.error);
        }
      });

    } else {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Datos incorrectos...!!' });
      console.log('Datos Incorrectos...!!');
    }
  }

  // NAV -> DASHBOARD
  navDashboard() {
    this.route.navigateByUrl('principal', { skipLocationChange: false });
  }

  // CLOSE -> MODAL
  cancel() {
    this.show();
  }

  // LOAD -> VISTA PREVIA IMG
  loadImg(event: any) {
    const maxSize = 2 * 1024 * 1024;
    const validExtensions = ['jpg', 'png'];
    let imgSelected!: File;

    // SE RECUPERA LA FOTO
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSize = file.size;
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      // SE VALIDA LA FOTO
      if (fileSize > maxSize || !validExtensions.includes(fileExtension))
        this.imgValida = false
      else
        this.imgValida = true

      // SE CARGA LA FOTO
      imgSelected = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUrl = e.target.result;
        this.empresa.logo = e.target.result;
      };
      reader.readAsDataURL(imgSelected);
    }
  }

  /* VALIDADORES
  ---------------------------------------*/
  valNombre() { const nombre = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,50}$/; return (nombre.test(this.empresa.nombre) ? true : false); }
  valDescripcion() { const descripcion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{0,200}$/; return (descripcion.test(this.empresa.descripcion) ? true : false); }
  valDireccion() { const direccion = /^[\w áéíóúüñÁÉÍÓÚÜÑ.-]{1,200}$/; return (direccion.test(this.empresa.direccion) ? true : false); }
  valFono() { const fono = /^[\d +-]{1,20}$/; return (fono.test(this.empresa.fono) ? true : false); }
  validate() { if (!this.empresa) { return 'empresa vacia--' + false; } return (this.valNombre() && this.valDescripcion() && this.valDireccion() && this.valFono()); }
}