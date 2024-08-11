import { ThemeConfig } from "antd/es/config-provider/context"
import { theme } from "antd"
import { DefaultTheme } from "styled-components"
import * as Colors from "@ant-design/colors"
import { SizeType } from "antd/es/config-provider/SizeContext"
import { colors } from "@/constants/colors"

type Colors = typeof Colors

type BreakpointConfig = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

declare module "styled-components" {
  export interface DefaultTheme {
    backgroundColor: string
    baseBgColor: string
    bgDark: string
    borderColor: string
    borderRadius: string
    boxShadow: string
    breakpoints: BreakpointConfig
    colorBgContainer: string
    colorPrimaryHover: string
    colorPrimaryText: string
    colors: Colors
    dangerColor: string
    h1FontSize: string
    paragraphFontSize: string
    primaryColor: string
    secondaryColor: string
    secondaryColorHover: string
    textColor: string
    whiteBackground: string
    size: SizeType
  }
}

export const defaultTheme: DefaultTheme = {
  primaryColor: colors.primary,
  secondaryColor: colors.secondary,
  baseBgColor: colors.baseBackground,
  backgroundColor: colors.baseBackground,
  textColor: colors.secondaryBgColor,
  borderRadius: "10px",
  borderColor: colors.border,
  colorPrimaryHover: "#f9f0ff",
  colorPrimaryText: "#9254de",
  colorBgContainer: "#ffffff",
  boxShadow:
    "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
  colors: Colors,
  bgDark: "#141414",
  whiteBackground: "#fff",
  secondaryColorHover: colors.secondaryHover,
  paragraphFontSize: "16px",
  h1FontSize: "32px",
  dangerColor: colors.danger,
  size: "small",
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
}

export const panelStyle: React.CSSProperties = {
  marginBottom: 24,
  background: colors.secondaryBgColor,
  borderRadius: defaultTheme.borderRadius,
  border: "none",
}

const { defaultConfig } = theme

export const antTheme: ThemeConfig = {
  ...defaultConfig,
  token: {
    borderRadius: 8,
    colorPrimary: colors.primary,
  },
  components: {
    Menu: {
      lineWidth: 0,
      colorPrimary: colors.primary,
      fontSize: 14,
    },
    Typography: {
      fontSize: 14,
    },
    Layout: {
      headerBg: colors.baseBackground,
    },
    Form: {
      itemMarginBottom: 12,
    },
    Badge: {
      marginXS: 5,
    },
  },
}
