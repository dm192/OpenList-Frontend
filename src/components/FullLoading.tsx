import {
  Box,
  Center,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@hope-ui/solid"
import {
  createEffect,
  createMemo,
  createSignal,
  JSXElement,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js"
import { getMainColor } from "~/store"
import { getConfiguredLogos } from "~/utils"

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
  progress?: number
}) => {
  const color = () => props.color || getMainColor()
  const progress = createMemo(() => clampProgress(props.progress))
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const offset = createMemo(() => {
    const value = progress()
    if (value === undefined) return 0
    return circumference * (1 - value / 100)
  })

  return (
    <span
      classList={{
        "openlist-spinner": true,
        "is-determinate": progress() !== undefined,
        "is-indeterminate": progress() === undefined,
        [props.class || ""]: !!props.class,
      }}
      style={
        {
          "--azure-spinner-color": color(),
          "--azure-spinner-size": resolveSpinnerSize(props.size),
          "--openlist-spinner-offset": offset(),
          "--openlist-spinner-circumference": circumference,
        } as any
      }
      role={progress() === undefined ? undefined : "progressbar"}
      aria-hidden={progress() === undefined ? "true" : undefined}
      aria-valuemin={progress() === undefined ? undefined : "0"}
      aria-valuemax={progress() === undefined ? undefined : "100"}
      aria-valuenow={
        progress() === undefined ? undefined : Math.round(progress()!)
      }
    >
      <svg viewBox="0 0 44 44" class="openlist-spinner__svg">
        <circle class="openlist-spinner__track" cx="22" cy="22" r={radius} />
        <circle class="openlist-spinner__bar" cx="22" cy="22" r={radius} />
      </svg>
    </span>
  )
}

const DEFAULT_LOADING_MESSAGE = "Getting things ready ..."
const MIN_MESSAGE_DURATION = 420
const MESSAGE_ANIMATION_DURATION = 240
const MESSAGE_CLEANUP_DELAY = MESSAGE_ANIMATION_DURATION + 40

const clampProgress = (progress?: number) => {
  if (progress === undefined || Number.isNaN(progress)) return undefined
  return Math.min(100, Math.max(0, progress))
}

export const LoadingStatusText = (props: { message?: string }) => {
  const initial = props.message || DEFAULT_LOADING_MESSAGE
  const [current, setCurrent] = createSignal(initial)
  const [outgoing, setOutgoing] = createSignal<string>()
  const [incoming, setIncoming] = createSignal<string>()
  const [switching, setSwitching] = createSignal(false)
  const queue: string[] = []
  let shownAt = performance.now()
  let active = current()
  let timer: number | undefined
  let enterFrame: number | undefined
  let switchFrame: number | undefined

  const clearTimer = () => {
    if (timer === undefined) return
    window.clearTimeout(timer)
    timer = undefined
  }

  const clearFrames = () => {
    if (enterFrame !== undefined) {
      window.cancelAnimationFrame(enterFrame)
      enterFrame = undefined
    }
    if (switchFrame !== undefined) {
      window.cancelAnimationFrame(switchFrame)
      switchFrame = undefined
    }
  }

  const animateNext = () => {
    if (switching() || queue.length === 0) return

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

    setOutgoing(active)
    setIncoming(next)
    clearTimer()
    clearFrames()
    enterFrame = window.requestAnimationFrame(() => {
      enterFrame = undefined
      switchFrame = window.requestAnimationFrame(() => {
        switchFrame = undefined
        setSwitching(true)
        timer = window.setTimeout(() => {
          active = next
          setCurrent(next)
          setOutgoing(undefined)
          setIncoming(undefined)
          setSwitching(false)
          shownAt = performance.now()
          timer = undefined
          animateNext()
        }, MESSAGE_CLEANUP_DELAY)
      })
    })
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
    clearFrames()
    queue.length = 0
  })

  return (
    <Box
      classList={{
        "loading-status-window": true,
        "is-switching": switching(),
      }}
      aria-live="polite"
    >
      <Box class="loading-status-track">
        <Show
          when={outgoing() && incoming()}
          fallback={
            <Text class="loading-status-text loading-status-text--current">
              {current()}
            </Text>
          }
        >
          <Text class="loading-status-text loading-status-text--outgoing">
            {outgoing()}
          </Text>
          <Text class="loading-status-text loading-status-text--incoming">
            {incoming()}
          </Text>
        </Show>
      </Box>
    </Box>
  )
}

export const FullScreenLoading = (
  props: { message?: string; progress?: number } = {},
) => {
  return (
    <Center class="fullscreen-loading" minH="100vh" w="$full">
      <VStack class="fullscreen-loading__content" spacing="$3">
        <LoadingLogo size="58px" />
        <AzureLoadingSpinner progress={props.progress} size="xl" />
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
