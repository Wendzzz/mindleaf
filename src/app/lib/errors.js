// Turns auth and network failures into messages a reader can act on.
// Each error says what happened and what to do next, and never exposes raw server text.
export class AppError extends Error {
  constructor(kind, message, extra = {}) {
    super(message)
    this.kind = kind
    Object.assign(this, extra)
  }
}

const secondsFrom = (text) => {
  const m = /after (\d+) seconds?/i.exec(text || '')
  return m ? Number(m[1]) : null
}

export function toAppError(err, context = 'general') {
  if (err instanceof AppError) return err
  const text = String(err?.message || err || '')
  const status = err?.status ?? err?.code

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return new AppError('offline', 'You’re offline. Check your connection and try again.')
  }
  if (/failed to fetch|networkerror|network request failed|load failed/i.test(text)) {
    return new AppError('network', 'We couldn’t reach Mindleaf. Check your connection and try again.')
  }
  if (status === 429 || /rate limit|too many|only request this after/i.test(text)) {
    const wait = secondsFrom(text)
    return new AppError('rate', wait
      ? `Too many tries. Wait ${wait} seconds, then ask for a new code.`
      : 'Too many tries. Wait a minute, then try again.', { wait: wait ?? 60 })
  }
  if (context === 'verify' && /expired|invalid|otp|token/i.test(text)) {
    return new AppError('code', 'That code didn’t work. It may be mistyped or expired. Check the latest email, or ask for a new code.')
  }
  if (context === 'send' && /invalid.*email|email.*invalid|unable to validate email/i.test(text)) {
    return new AppError('email', 'That email address doesn’t look right. Check it and try again.')
  }
  if (/signups? not allowed|signup is disabled/i.test(text)) {
    return new AppError('closed', 'New sign-ups are paused right now. Please try again later.')
  }
  if (/jwt|session|not authenticated|refresh token/i.test(text)) {
    return new AppError('session', 'You’ve been signed out. Sign in again to keep going.')
  }
  return new AppError('unknown', 'Something went wrong on our side. Try again in a moment.')
}
