type BackgroundMode = "light" | "dark"
export type BackgroundStatus = "idle" | "loading" | "ready" | "fallback"

const HEALTH_URL = "https://img-random.dormant.top/health"
const IMAGE_URL = "https://img-random.dormant.top/"
const HEALTH_TIMEOUT = 3500
const IMAGE_TIMEOUT = 9000

let healthAvailable: boolean | undefined
let status: BackgroundStatus = "idle"
const cachedUrls: Partial<Record<BackgroundMode, string>> = {}

const timeoutSignal = (timeout: number) => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)
  return { controller, timer }
}

const setBackgroundStatus = (next: BackgroundStatus) => {
  status = next
  document.body.dataset.backgroundStatus = next
}

const checkHealth = async () => {
  if (healthAvailable !== undefined) return healthAvailable
  const { controller, timer } = timeoutSignal(HEALTH_TIMEOUT)
  try {
    const resp = await fetch(HEALTH_URL, {
      signal: controller.signal,
      cache: "no-store",
    })
    if (!resp.ok) {
      healthAvailable = false
      return false
    }
    const data = (await resp.json()) as { status?: string }
    healthAvailable = data.status === "ok"
    return healthAvailable
  } catch {
    healthAvailable = false
    return false
  } finally {
    window.clearTimeout(timer)
  }
}

const decodeImage = (url: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error("Background image failed to load"))
    image.src = url
  })

const loadBackgroundImage = async (mode: BackgroundMode) => {
  if (cachedUrls[mode]) return cachedUrls[mode]!
  const { controller, timer } = timeoutSignal(IMAGE_TIMEOUT)
  try {
    const resp = await fetch(`${IMAGE_URL}?category=${mode}`, {
      signal: controller.signal,
      cache: "no-store",
    })
    if (!resp.ok) throw new Error("Background image request failed")
    const blob = await resp.blob()
    const objectUrl = URL.createObjectURL(blob)
    await decodeImage(objectUrl)
    cachedUrls[mode] = objectUrl
    return objectUrl
  } finally {
    window.clearTimeout(timer)
  }
}

export const getBackgroundStatus = () => status

export const prepareAppBackground = async (mode: BackgroundMode) => {
  setBackgroundStatus("loading")
  try {
    if (!(await checkHealth())) {
      setBackgroundStatus("fallback")
      return false
    }
    const imageUrl = await loadBackgroundImage(mode)
    document.body.style.setProperty("--openlist-bg-image", `url("${imageUrl}")`)
    document.body.dataset.backgroundMode = mode
    setBackgroundStatus("ready")
    return true
  } catch {
    setBackgroundStatus("fallback")
    return false
  }
}
