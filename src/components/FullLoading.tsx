import { Center, Image, Text, VStack, useColorModeValue } from "@hope-ui/solid"
import {
  createSignal,
  JSXElement,
  mergeProps,
  onCleanup,
  onMount,
  Show,
} from "solid-js"
import { getMainColor } from "~/store"
import { getConfiguredLogos } from "~/utils"

const spinnerSizes: Record<string, string> = {
  xs: "20px",
  sm: "26px",
  md: "34px",
  lg: "46px",
  xl: "64px",
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

  return (
    <span
      classList={{
        "azure-spinner": true,
        [props.class || ""]: !!props.class,
      }}
      style={
        {
          "--azure-spinner-size": resolveSpinnerSize(props.size),
          "--azure-spinner-color": color(),
        } as any
      }
      aria-hidden="true"
    >
      <svg class="azure-spinner__svg" viewBox="0 0 48 48">
        <circle class="azure-spinner__track" cx="24" cy="24" r="20" />
        <circle class="azure-spinner__arc" cx="24" cy="24" r="20" />
      </svg>
    </span>
  )
}

export const FullScreenLoading = () => {
  const [showHint, setShowHint] = createSignal(false)

  onMount(() => {
    const timer = window.setTimeout(() => setShowHint(true), 3000)
    onCleanup(() => window.clearTimeout(timer))
  })

  return (
    <Center class="fullscreen-loading" minH="100vh" w="$full">
      <VStack class="fullscreen-loading__content" spacing="$3">
        <LoadingLogo size="58px" />
        <AzureLoadingSpinner size="xl" />
        <Show when={showHint()}>
          <Text class="fullscreen-loading__hint">Getting things ready ...</Text>
        </Show>
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
