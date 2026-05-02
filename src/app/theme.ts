import { globalCss, HopeThemeConfig } from "@hope-ui/solid"
import { hoverColor } from "~/utils"

const theme: HopeThemeConfig = {
  initialColorMode: "system",
  lightTheme: {
    colors: {
      // background: "$neutral2",
      background: "rgba(247, 250, 252, 0.78)",
    },
  },
  components: {
    Button: {
      baseStyle: {
        root: {
          rounded: "$lg",
          _active: {
            transform: "scale(.95)",
            transition: "0.2s",
          },
          _focus: {
            boxShadow: "unset",
          },
        },
      },
      defaultProps: {
        root: {
          colorScheme: "info",
          variant: "subtle",
        },
      },
    },
    IconButton: {
      defaultProps: {
        colorScheme: "info",
        variant: "subtle",
      },
    },
    Input: {
      baseStyle: {
        input: {
          rounded: "$lg",
          _focus: {
            boxShadow: "unset",
            borderColor: "$info8",
          },
        },
      },
      defaultProps: {
        input: {
          variant: "filled",
        },
      },
    },
    Textarea: {
      baseStyle: {
        rounded: "$lg",
        _focus: {
          boxShadow: "unset",
          borderColor: "$info8",
        },
        resize: "vertical",
        wordBreak: "break-all",
      },
      defaultProps: {
        variant: "filled",
      },
    },
    Select: {
      baseStyle: {
        trigger: {
          rounded: "$lg",
          _focus: {
            boxShadow: "unset",
            borderColor: "$info8",
          },
        },
        content: {
          border: "none",
          rounded: "$lg",
        },
        optionIndicator: {
          color: "$info10",
        },
      },
      defaultProps: {
        root: {
          variant: "filled",
        },
      },
    },
    Checkbox: {
      defaultProps: {
        root: {
          colorScheme: "info",
          variant: "filled",
        },
      },
    },
    Switch: {
      defaultProps: {
        root: {
          colorScheme: "info",
        },
      },
    },
    Menu: {
      baseStyle: {
        content: {
          rounded: "$md",
          minW: "unset",
          border: "unset",
          // py: "0",
        },
        item: {
          rounded: "$md",
          py: "$1",
          // mx: "0",
        },
      },
    },
    Notification: {
      baseStyle: {
        root: {
          rounded: "$lg",
          border: "unset",
        },
      },
    },
    Alert: {
      baseStyle: {
        root: {
          rounded: "$lg",
        },
      },
    },
    Anchor: {
      baseStyle: {
        rounded: "$lg",
        px: "$1_5",
        py: "$1",
        _hover: {
          bgColor: hoverColor(),
          textDecoration: "none",
        },
        _focus: {
          boxShadow: "unset",
        },
        _active: { transform: "scale(.95)", transition: "0.1s" },
      },
    },
    Modal: {
      baseStyle: {
        content: {
          rounded: "$lg",
        },
      },
    },
  },
}

export const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
  },
  html: {
    fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol" !important`,
    background: "#f3f7fb",
  },
  body: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, rgba(243, 247, 251, 0.98), rgba(248, 250, 252, 0.99) 48%, rgba(241, 248, 246, 0.97))",
    color: "$neutral12",
    overflowX: "hidden",
    position: "relative",
    "&::before": {
      content: "",
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      background:
        "radial-gradient(circle at 14% 12%, rgba(74, 144, 226, 0.13), transparent 30%), radial-gradient(circle at 84% 8%, rgba(20, 184, 166, 0.09), transparent 27%), radial-gradient(circle at 52% 88%, rgba(132, 204, 22, 0.06), transparent 28%), linear-gradient(rgba(79, 70, 229, 0.023) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 118, 110, 0.02) 1px, transparent 1px)",
      backgroundPosition: "0% 0%, 100% 0%, 50% 100%, 0 0, 0 0",
      backgroundSize: "120% 120%, 120% 120%, 130% 130%, 64px 64px, 64px 64px",
      maskImage:
        "linear-gradient(to bottom, rgba(0,0,0,0.82), rgba(0,0,0,0.24) 76%, transparent)",
      animation: "openlist-flow-bg 28s ease-in-out infinite alternate",
      willChange: "background-position, transform",
    },
    "&::after": {
      content: "",
      position: "fixed",
      inset: "-12%",
      zIndex: -1,
      pointerEvents: "none",
      background:
        "linear-gradient(115deg, transparent 18%, rgba(59, 130, 246, 0.045) 36%, rgba(20, 184, 166, 0.04) 56%, transparent 76%)",
      filter: "blur(26px)",
      opacity: 0.72,
      transform: "translate3d(-2%, -1%, 0) rotate(0.001deg)",
      animation: "openlist-flow-wash 34s ease-in-out infinite alternate",
    },
  },
  "#root": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    isolation: "isolate",
    minHeight: "100vh",
    position: "relative",
    width: "100%",
  },
  ".hope-ui-dark body, body.hope-ui-dark": {
    background:
      "linear-gradient(135deg, rgba(9, 14, 24, 0.99), rgba(15, 23, 42, 0.99) 52%, rgba(11, 27, 40, 0.97))",
    "&::before": {
      background:
        "radial-gradient(circle at 18% 12%, rgba(37, 99, 235, 0.13), transparent 31%), radial-gradient(circle at 86% 16%, rgba(20, 184, 166, 0.08), transparent 27%), radial-gradient(circle at 48% 88%, rgba(45, 212, 191, 0.045), transparent 30%), linear-gradient(rgba(147, 197, 253, 0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(94, 234, 212, 0.028) 1px, transparent 1px)",
      backgroundSize: "120% 120%, 120% 120%, 130% 130%, 64px 64px, 64px 64px",
    },
    "&::after": {
      background:
        "linear-gradient(115deg, transparent 18%, rgba(37, 99, 235, 0.055) 36%, rgba(20, 184, 166, 0.045) 58%, transparent 78%)",
      opacity: 0.55,
    },
  },
  ".header": {
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(255, 255, 255, 0.82) !important",
    backdropFilter: "saturate(130%) blur(12px)",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.035)",
  },
  ".hope-ui-dark .header": {
    backgroundColor: "rgba(15, 23, 42, 0.84) !important",
    borderBottomColor: "rgba(148, 163, 184, 0.16)",
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.16)",
  },
  ".nav": {
    borderRadius: "$lg",
    background: "rgba(255, 255, 255, 0.66) !important",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: "$1 $2",
  },
  ".hope-ui-dark .nav": {
    background: "rgba(15, 23, 42, 0.52) !important",
    borderColor: "rgba(148, 163, 184, 0.14)",
  },
  ".login-shell": {
    paddingTop: "max(24px, env(safe-area-inset-top))",
    paddingBottom: "max(24px, env(safe-area-inset-bottom))",
  },
  ".login-bg": {
    opacity: 0.18,
  },
  ".hope-ui-dark .login-bg": {
    opacity: 0.24,
  },
  ".login-card, .obj-box, .readme-card": {
    border: "1px solid rgba(148, 163, 184, 0.2)",
    backdropFilter: "saturate(125%) blur(14px)",
    boxShadow:
      "0 12px 32px rgba(15, 23, 42, 0.055), 0 1px 0 rgba(255, 255, 255, 0.36) inset",
  },
  ".login-card": {
    maxWidth: "calc(100vw - 32px)",
  },
  ".login-brand": {
    textAlign: "center",
  },
  ".login-title": {
    lineHeight: "1.25",
    overflowWrap: "anywhere",
    maxWidth: "100%",
  },
  ".hope-ui-dark .login-card, .hope-ui-dark .obj-box, .hope-ui-dark .readme-card":
    {
      borderColor: "rgba(148, 163, 184, 0.14)",
      boxShadow:
        "0 14px 36px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.045) inset",
    },
  ".list .title": {
    borderRadius: "$lg",
    background: "rgba(148, 163, 184, 0.065)",
  },
  ".list-item, .grid-item, .image-item": {
    border: "1px solid transparent",
  },
  ".list-item:hover, .grid-item:hover, .image-item:hover": {
    backgroundColor: "rgba(37, 99, 235, 0.045)",
    borderColor: "rgba(37, 99, 235, 0.14)",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.035)",
  },
  ".list-item.selected, .grid-item.selected, .image-item.selected": {
    backgroundColor: "rgba(37, 99, 235, 0.075)",
    borderColor: "rgba(37, 99, 235, 0.24)",
    boxShadow: "inset 3px 0 0 rgba(37, 99, 235, 0.58)",
  },
  ".hope-ui-dark .list .title": {
    background: "rgba(148, 163, 184, 0.07)",
  },
  ".hope-ui-dark .list-item:hover, .hope-ui-dark .grid-item:hover, .hope-ui-dark .image-item:hover":
    {
      backgroundColor: "rgba(96, 165, 250, 0.075)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.16)",
    },
  ".center-toolbar, .left-toolbar-box": {
    zIndex: "$popover",
  },
  ".hope-breadcrumb__list": {
    flexWrap: "wrap",
    rowGap: "0 !important",
  },
  ".lightgallery-container": {
    "& .lg-backdrop": {
      zIndex: "$popover",
    },
    "& .lg-outer": {
      zIndex: "calc($popover + 10)",
    },
  },
  ".viselect-selection-area": {
    background: "rgba(46, 115, 252, 0.11)",
    border: "2px solid rgba(98, 155, 255, 0.81)",
    borderRadius: "0.1em",
  },
  ".viselect-container": {
    userSelect: "none",
    "& .viselect-item": {
      "-webkit-user-drag": "none",
      "& img": {
        "-webkit-user-drag": "none",
      },
    },
  },
})

export { theme }
