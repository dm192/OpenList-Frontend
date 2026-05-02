import { getSetting } from "~/store"

export const DEFAULT_LOGO = "https://res.oplist.org/logo/logo.svg"

export const getConfiguredLogos = () => {
  const logos = getSetting("logo")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    light: logos[0] || DEFAULT_LOGO,
    dark: logos[logos.length - 1] || logos[0] || DEFAULT_LOGO,
  }
}
