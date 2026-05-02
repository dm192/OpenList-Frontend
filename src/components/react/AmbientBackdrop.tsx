/** @jsxImportSource react */
import React from "react"

export function AmbientBackdrop() {
  return React.createElement(
    "div",
    { className: "ambient-backdrop" },
    React.createElement("span", {
      className: "ambient-backdrop__glow ambient-backdrop__glow--one",
    }),
    React.createElement("span", {
      className: "ambient-backdrop__glow ambient-backdrop__glow--two",
    }),
    React.createElement("span", { className: "ambient-backdrop__mesh" }),
  )
}
