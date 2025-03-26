/* ==================================
        CONTROLLER PRINCIPAL
================================== */

import { CommonModule, NgClass } from '@angular/common'
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { Subscription, filter } from 'rxjs'
import { AppTopBarComponent } from './components/topbar/app.topbar.component'
import { AppSidebarComponent } from './components/sidebar/app.sidebar.component'
import { AppFooterComponent } from './components/footer/app.footer.component'
import { LayoutService } from '../../../service/principal/app.layout.service'
import { PrincipalService } from '../../../service/principal/Principal.service'
import { HelpComponent } from './components/topOptions/help/help.component'
import { UserComponent } from './components/topOptions/user/user.component'
import { ConfigComponent } from './components/topOptions/config/config.component'

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NgClass, AppTopBarComponent, AppSidebarComponent, RouterOutlet, AppFooterComponent, UserComponent, HelpComponent, ConfigComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent
  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent
  @ViewChild(HelpComponent) helpSider!: HelpComponent;
  @ViewChild(UserComponent) userSider!: UserComponent;
  @ViewChild(ConfigComponent) configSider!: ConfigComponent;
  overlayMenuOpenSubscription: Subscription
  menuOutsideClickListener: (() => void) | null = null
  profileMenuOutsideClickListener: (() => void) | null = null

  /* ATTRIBUTES
   -------------------------*/
  usuario!: any;
  roles!: any[];
  rol!: any;

  // STATE
  load: boolean = false;
  evento!: Subscription; // OYE CAMBIOS DEL MOD_RUCUROS-HUMANOS, 

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    private principalService: PrincipalService
  ) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(
            this.appSidebar.el.nativeElement.isSameNode(event.target) ||
            this.appSidebar.el.nativeElement.contains(event.target) ||
            this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
            this.appTopbar.menuButton.nativeElement.contains(event.target)
          )

          if (isOutsideClicked) {
            this.hideMenu()
          }
        })
      }

      if (!this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(
            this.appTopbar.menu.nativeElement.isSameNode(event.target) ||
            this.appTopbar.menu.nativeElement.contains(event.target) ||
            this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) ||
            this.appTopbar.topbarMenuButton.nativeElement.contains(event.target)
          )

          if (isOutsideClicked) {
            this.hideProfileMenu()
          }
        })
      }

      if (this.layoutService.state.staticMenuMobileActive) {
        this.blockBodyScroll()
      }
    })

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu()
      this.hideProfileMenu()
    })
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config().ripple,
    }
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false
    this.layoutService.state.staticMenuMobileActive = false
    this.layoutService.state.menuHoverActive = false
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener()
      this.menuOutsideClickListener = null
    }
    this.unblockBodyScroll()
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener()
      this.profileMenuOutsideClickListener = null
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll')
    } else {
      document.body.className += ' blocked-scroll'
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll')
    } else {
      document.body.className = document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' ',
      )
    }
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe()
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener()
    }
    this.evento.unsubscribe();
  }

  /* METHODS
  -------------------------*/
  // LOAD -> DATA INICIAL
  ngOnInit() {
    this.show();
    // ESCUCHA CAMBIOS DE MOD_RRHH Y RELOAD AUTOMATICAMENTE
    this.evento = this.principalService.evento.subscribe(() => {
      this.reload();
    });
  }

  // SHOW -> VIEW PRINCIPAL
  show() {
    if (this.principalService.getUsuarioStorage()) {
      this.usuario = this.principalService.getUsuarioStorage();
      this.roles = this.principalService.getRolesStorage();
      this.rol = this.principalService.getRolSelectedStorage();
    }
    else {
      this.load = true;
      console.log('REQUEST->getDataUser');
      this.principalService.getDataUser().subscribe({
        next: (response) => {
          this.usuario = response.usuario;
          this.roles = response.roles;
          this.rol = this.roles[0];
          this.principalService.setUsuarioStorage(this.usuario);
          this.principalService.setRolesStorage(this.roles);
          this.principalService.setRolSelectedStorage(this.rol);
          this.appSidebar.show(this.rol.permisos);
          window.location.reload();
          this.load = false;
          console.log('RESPONSE->getDataUser', response);
        },
        error: (error) => {
          console.log('RESPONSE->getDataUser Error en:', error.error);
        }
      });
    }
  }

  // UPDATE -> ROL SELECTED
  updateRol(rol: any) {
    this.rol = rol;
    this.principalService.setRolSelectedStorage(this.rol);
    this.router.navigateByUrl('principal', { skipLocationChange: false });
    this.appSidebar.show(rol.permisos); // Se notifica al sidBar del cambio
  }

  // RELOAD -> VIEW PRINCIPAL
  reload() {
    this.principalService.deleteRolesStorage();
    this.show();
  }

  // SHOW -> VIEW TOP-OPTION
  showTopOption(option: string) {
    switch (option) {
      case 'config': this.configSider.show(); break;
      case 'help': this.helpSider.show(); break;
      case 'user': this.userSider.show(); break;
    }
  }

}
