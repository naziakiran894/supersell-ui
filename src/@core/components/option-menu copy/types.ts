// ** React Import
import { ReactNode } from 'react'

// ** MUI Imports
import { MenuProps } from '@mui/material/Menu'
import { DividerProps } from '@mui/material/Divider'
import { MenuItemProps } from '@mui/material/MenuItem'
import { IconButtonProps } from '@mui/material/IconButton'

// ** Types
import { IconProps } from '@iconify/react'

export type OptionDividerType = {
  divider: boolean
  dividerProps?: DividerProps
  href?: never
  icon?: never
  text?: never
  linkProps?: never
  menuItemProps?: never
}
export type OptionMenuItemType = {
  text: ReactNode
  icon?: ReactNode
  linkProps?: any
  href?:any
  menuItemProps?: MenuItemProps
  divider?: never
  dividerProps?: never
}

export type OptionType = string | OptionDividerType | OptionMenuItemType

export type OptionsMenuType = {
  icon?: ReactNode
  options: OptionType[]
  leftAlignMenu?: boolean
  iconButtonProps?: IconButtonProps
  iconProps?: Omit<IconProps, 'icon'>
  menuProps?: Omit<MenuProps, 'open'>
}
