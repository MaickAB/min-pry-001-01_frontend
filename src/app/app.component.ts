
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PrimeNGConfig } from 'primeng/api'




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ButtonModule,SidebarModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'min-pry-001-01_frontend';
  sidebarVisible: boolean = false;

  constructor(
    
  ) {}

  ngOnInit(): void {
    

  }
}
