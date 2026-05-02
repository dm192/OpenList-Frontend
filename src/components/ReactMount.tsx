import type { ReactNode } from "react"
import { createEffect, onCleanup, onMount } from "solid-js"
import { createRoot, type Root } from "react-dom/client"

export function ReactMount(props: { children: ReactNode; class?: string }) {
  let el!: HTMLDivElement
  let root: Root | undefined

  onMount(() => {
    root = createRoot(el)
    root.render(props.children)
  })

  createEffect(() => {
    root?.render(props.children)
  })

  onCleanup(() => {
    root?.unmount()
  })

  return <div ref={el} class={props.class} aria-hidden="true" />
}
