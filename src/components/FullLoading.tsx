import {
  Box,
  Center,
  Image,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@hope-ui/solid"
import { createElement } from "react"
import {
  createEffect,
  createSignal,
  JSXElement,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js"
import { getMainColor } from "~/store"
import { getConfiguredLogos } from "~/utils"
import { ReactMount } from "./ReactMount"
import { FluentLoadingSpinner } from "./react/FluentLoadingSpinner"

const spinnerSizes: Record<string, string> = {
  xs: "16px",
  sm: "20px",
  md: "28px",
  lg: "36px",
  xl: "44px",
}

const resolveSpinnerSize = (size?: string) => {
  if (!size) return spinnerSizes.xl
  return spinnerSizes[size] || size
}

export const LoadingLogo = (props: { size?: string }) => {
  const logos = getConfiguredLogos()
  const logo = useColorModeValue(logos.light, logos.dark)

  return (
    <Image
      class="loading-logo"
      src={logo()}
      boxSize={props.size || "64px"}
      objectFit="contain"
      draggable={false}
    />
  )
}

export const AzureLoadingSpinner = (props: {
  size?: string
  color?: string
  class?: string
}) => {
  const color = () => props.color || getMainColor()
  const { colorMode } = useColorMode()

  return (
    <span
      classList={{
        "azure-spinner": true,
        [props.class || ""]: !!props.class,
      }}
      style={
        {
          "--azure-spinner-color": color(),
          "--azure-spinner-size": resolveSpinnerSize(props.size),
        } as any
      }
      aria-hidden="true"
    >
      <ReactMount
        class="fluent-spinner-mount"
        children={createElement(FluentLoadingSpinner, {
          size: props.size,
          color: color(),
          dark: colorMode() === "dark",
        })}
      />
    </span>
  )
}

const DEFAULT_LOADING_MESSAGE = "Getting things ready ..."
const MIN_MESSAGE_DURATION = 420
const MESSAGE_ANIMATION_DURATION = 240

export const LoadingStatusText = (props: { message?: string }) => {
  const initial = props.message || DEFAULT_LOADING_MESSAGE
  const [current, setCurrent] = createSignal(initial)
  const [incoming, setIncoming] = createSignal<string>()
  const [sliding, setSliding] = createSignal(false)
  const queue: string[] = []
  let shownAt = performance.now()
  let active = current()
  let timer: number | undefined

  const clearTimer = () => {
    if (timer === undefined) return
    window.clearTimeout(timer)
    timer = undefined
  }

  const animateNext = () => {
    if (sliding() || queue.length === 0) return

    const elapsed = performance.now() - shownAt
    if (elapsed < MIN_MESSAGE_DURATION) {
      clearTimer()
      timer = window.setTimeout(
        animateNext,
        Math.max(0, MIN_MESSAGE_DURATION - elapsed),
      )
      return
    }

    const next = queue.shift()
    if (!next || next === active) {
      animateNext()
      return
    }

    setIncoming(next)
    setSliding(true)
    clearTimer()
    timer = window.setTimeout(() => {
      active = next
      setCurrent(next)
      setIncoming(undefined)
      setSliding(false)
      shownAt = performance.now()
      timer = undefined
      animateNext()
    }, MESSAGE_ANIMATION_DURATION)
  }

  createEffect(() => {
    const next = props.message || DEFAULT_LOADING_MESSAGE
    const lastQueued = queue[queue.length - 1]
    const pending = incoming()
    if (next === active || next === pending || next === lastQueued) return
    queue.push(next)
    animateNext()
  })

  onCleanup(() => {
    clearTimer()
    queue.length = 0
  })

  return (
    <Box class="loading-status-window" aria-live="polite">
      <Box
        classList={{
          "loading-status-track": true,
          "is-sliding": sliding(),
        }}
      >
        <Text class="loading-status-text">{current()}</Text>
        <Text class="loading-status-text">{incoming() || current()}</Text>
      </Box>
    </Box>
  )
}

export const FullScreenLoading = (props: { message?: string } = {}) => {
  return (
    <Center class="fullscreen-loading" minH="100vh" w="$full">
      <VStack class="fullscreen-loading__content" spacing="$3">
        <LoadingLogo size="58px" />
        <AzureLoadingSpinner size="xl" />
        <LoadingStatusText message={props.message} />
      </VStack>
    </Center>
  )
}

export const FullLoading = (props: {
  py?: string
  size?: string
  thickness?: number
  ref?: any
}) => {
  const merged = mergeProps(
    {
      py: "$8",
      size: "xl",
      thickness: 4,
    },
    props,
  )
  return (
    <Center ref={props.ref} h="$full" w="$full" py={merged.py}>
      <AzureLoadingSpinner size={merged.size} />
    </Center>
  )
}

export const MaybeLoading = (props: {
  children?: JSXElement
  loading?: boolean
}) => {
  return (
    <Show when={!props.loading} fallback={<FullLoading />}>
      {props.children}
    </Show>
  )
}

export const CenterLoading = (props: { size?: string; color?: string }) => {
  return (
    <Center w="$full" h="$full">
      <AzureLoadingSpinner size={props.size} color={props.color} />
    </Center>
  )
}
