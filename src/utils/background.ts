type BackgroundMode = "light" | "dark"
export type BackgroundStatus = "idle" | "loading" | "ready" | "fallback"
export type BackgroundPrepareResult = {
  ok: boolean
  fallback: boolean
}
export type BackgroundProgressHandler = (progress: number) => void

const HEALTH_URL = "https://img-random.dormant.top/health"
const IMAGE_URL = "https://img-random.dormant.top/"
const HEALTH_TIMEOUT = 3500
const IMAGE_TIMEOUT = 9000
const MAX_BACKGROUND_ATTEMPTS = 3

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

const retry = async <T>(task: () => Promise<T>, attempts: number) => {
  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await task()
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const fetchHealthOnce = async () => {
  const { controller, timer } = timeoutSignal(HEALTH_TIMEOUT)
  try {
    const resp = await fetch(HEALTH_URL, {
      signal: controller.signal,
      cache: "no-store",
    })
    if (!resp.ok) throw new Error("Background health request failed")
    const data = (await resp.json()) as { status?: string }
    if (data.status !== "ok") throw new Error("Background service is not ready")
    return true
  } finally {
    window.clearTimeout(timer)
  }
}

const checkHealth = async () => {
  if (healthAvailable !== undefined) return healthAvailable
  try {
    healthAvailable = await retry(fetchHealthOnce, MAX_BACKGROUND_ATTEMPTS)
    return healthAvailable
  } catch {
    return false
  }
}

const decodeImage = (url: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error("Background image failed to load"))
    image.src = url
  })

const readResponseBlob = async (
  resp: Response,
  onProgress?: BackgroundProgressHandler,
) => {
  const total = Number(resp.headers.get("Content-Length") || 0)
  if (!resp.body || !Number.isFinite(total) || total <= 0) {
    return resp.blob()
  }

  const reader = resp.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue
    chunks.push(value)
    received += value.byteLength
    onProgress?.(Math.min(1, received / total))
  }

  onProgress?.(1)
  return new Blob(chunks, {
    type: resp.headers.get("Content-Type") || "application/octet-stream",
  })
}

const loadBackgroundImageOnce = async (
  mode: BackgroundMode,
  onProgress?: BackgroundProgressHandler,
) => {
  const { controller, timer } = timeoutSignal(IMAGE_TIMEOUT)
  let objectUrl: string | undefined
  try {
    const resp = await fetch(`${IMAGE_URL}?category=${mode}`, {
      signal: controller.signal,
      cache: "no-store",
    })
    if (!resp.ok) throw new Error("Background image request failed")
    const blob = await readResponseBlob(resp, onProgress)
    objectUrl = URL.createObjectURL(blob)
    await decodeImage(objectUrl)
    return objectUrl
  } catch (error) {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

const loadBackgroundImage = async (
  mode: BackgroundMode,
  onProgress?: BackgroundProgressHandler,
) => {
  if (cachedUrls[mode]) return cachedUrls[mode]!
  const objectUrl = await retry(
    () => loadBackgroundImageOnce(mode, onProgress),
    MAX_BACKGROUND_ATTEMPTS,
  )
  cachedUrls[mode] = objectUrl
  return objectUrl
}

export const getBackgroundStatus = () => status

export const prepareAppBackground = async (
  mode: BackgroundMode,
  onStep?: (message: string) => void,
  onProgress?: BackgroundProgressHandler,
): Promise<BackgroundPrepareResult> => {
  setBackgroundStatus("loading")
  try {
    onStep?.("Checking background service ...")
    if (!(await checkHealth())) {
      setBackgroundStatus("fallback")
      return { ok: false, fallback: true }
    }
    onStep?.("Loading background image ...")
    const imageUrl = await loadBackgroundImage(mode, onProgress)
    onStep?.("Applying background ...")
    document.body.style.setProperty("--openlist-bg-image", `url("${imageUrl}")`)
    document.body.dataset.backgroundMode = mode
    setBackgroundStatus("ready")
    return { ok: true, fallback: false }
  } catch {
    setBackgroundStatus("fallback")
    return { ok: false, fallback: true }
  }
}
