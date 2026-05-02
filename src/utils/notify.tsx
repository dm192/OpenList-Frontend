import {
  Box,
  CloseButton,
  // Alert,
  // AlertDescription,
  // AlertIcon,
  // AlertTitle,
  // CloseButton,
  notificationService,
} from "@hope-ui/solid"
import { JSXElement } from "solid-js"
import { getMainColor } from "~/store"
import { alphaBgColor, firstUpperCase } from "."

const ANNOUNCEMENT_DURATION = 15000

const notify = {
  render: (element: JSXElement) => {
    notificationService.show({
      render: (props) => {
        return (
          <Box
            css={{
              display: "flex",
              backdropFilter: "blur(8px)",
              backgroundColor: alphaBgColor(),
              boxShadow: "$md",
              borderRadius: "$lg",
              padding: "$3",
            }}
          >
            <div
              style={{
                "flex-grow": 1,
                display: "flex",
                "align-items": "center",
              }}
            >
              <div style={{ margin: "auto" }}>{element}</div>
            </div>
            <div style={{ display: "inline-block", padding: "5px" }}>
              <CloseButton
                style={{ float: "right" }}
                right="$2"
                top="$2"
                onClick={props.close}
              />
            </div>
          </Box>
        )
      },
    })
  },
  announcement: (
    element: JSXElement,
    options?: {
      duration?: number
    },
  ) => {
    const duration = options?.duration ?? ANNOUNCEMENT_DURATION
    notificationService.show({
      duration,
      render: (props) => {
        return (
          <Box
            class="announcement-notification"
            css={{
              "--announcement-duration": `${duration}ms`,
              "--announcement-color": getMainColor(),
              position: "relative",
              display: "flex",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              backgroundColor: alphaBgColor(),
              boxShadow:
                "0 14px 34px rgba(15, 23, 42, 0.1), 0 1px 0 rgba(255, 255, 255, 0.28) inset",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "$lg",
              padding: "$3",
              paddingBottom: "$4",
            }}
          >
            <div
              style={{
                "flex-grow": 1,
                display: "flex",
                "align-items": "center",
                "min-width": 0,
              }}
            >
              <div style={{ margin: "auto", "max-width": "min(520px, 80vw)" }}>
                {element}
              </div>
            </div>
            <div style={{ display: "inline-block", padding: "5px" }}>
              <CloseButton
                aria-label="Close announcement"
                style={{ float: "right" }}
                right="$2"
                top="$2"
                onClick={props.close}
              />
            </div>
            <div class="announcement-progress" />
          </Box>
        )
      },
    })
  },
  success: (message: string) => {
    notificationService.show({
      status: "success",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="success" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
  error: (message: string) => {
    notificationService.show({
      status: "danger",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="danger" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
  info: (message: string) => {
    notificationService.show({
      status: "info",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="info" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
  warning: (message: string) => {
    notificationService.show({
      status: "warning",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="warning" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
}

export { notify }
