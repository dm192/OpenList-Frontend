import { createElement } from "react"
import {
  FluentProvider,
  Spinner,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components"

const sizeMap: Record<
  string,
  | "extra-tiny"
  | "tiny"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "huge"
> = {
  xs: "tiny",
  sm: "small",
  md: "medium",
  lg: "large",
  xl: "extra-large",
}

export function FluentLoadingSpinner(props: {
  size?: string
  color?: string
  dark?: boolean
}) {
  const fluentSize = props.size ? sizeMap[props.size] || "medium" : "huge"
  const baseTheme = props.dark ? webDarkTheme : webLightTheme
  const color = props.color || baseTheme.colorBrandStroke1
  const theme = {
    ...baseTheme,
    colorBrandStroke1: color,
    colorBrandStroke2Contrast: `color-mix(in srgb, ${color}, transparent 78%)`,
  }

  return createElement(
    FluentProvider,
    {
      className: "fluent-spinner-provider",
      theme,
      style: {
        "--azure-spinner-color": color,
      },
    } as any,
    createElement(Spinner, {
      appearance: "primary",
      delay: 0,
      size: fluentSize,
      className: "fluent-loading-spinner",
    }),
  )
}
