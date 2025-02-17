import { MenuItem } from 'primeng/api'

export interface AppMenuItem extends MenuItem {
  class?: string
  badgeClass?: string
}
