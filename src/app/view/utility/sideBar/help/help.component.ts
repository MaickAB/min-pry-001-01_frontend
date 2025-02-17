/* ==================================
      CONTROLLER HELP
================================== */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [AccordionModule, SidebarModule, ButtonModule, CommonModule, InputTextModule, FormsModule, InputGroupModule, InputGroupAddonModule],
  providers: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})

export class HelpComponent implements OnInit {

  /* ATTRIBUTES
  -------------------------*/
  sidebarVisible: boolean = false;


  /* METHODS
  -------------------------*/
  constructor() {
  }

  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.getDatos();
  }

  // OBTIENE -> LISTA DE ROLES
  getDatos() {

  }

  // MUESTRA -> VISTA AYUDA
  show() {
    this.sidebarVisible = true;
  }
}