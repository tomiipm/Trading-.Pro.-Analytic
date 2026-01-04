"use client"

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => number
      reset: (widgetId: number) => void
      getResponse: (widgetId: number) => string
    }
  }
}

interface ReCaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  siteKey: string
}

export interface ReCaptchaRef {
  reset: () => void
}

export const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  ({ onVerify, onExpire, siteKey }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<number | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
      },
    }))

    useEffect(() => {
      // Load reCAPTCHA script
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
      script.async = true
      script.defer = true
      script.onload = () => setIsLoaded(true)
      document.body.appendChild(script)

      return () => {
        // Cleanup
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    }, [])

    useEffect(() => {
      if (!isLoaded || !containerRef.current || !window.grecaptcha || !siteKey) return

      window.grecaptcha.ready(() => {
        if (containerRef.current && !widgetIdRef.current && siteKey) {
          try {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => {
                onVerify(token)
              },
              "expired-callback": () => {
                if (onExpire) {
                  onExpire()
                }
                if (widgetIdRef.current !== null) {
                  window.grecaptcha.reset(widgetIdRef.current)
                }
              },
            })
          } catch (error) {
            // Silently fail if reCAPTCHA cannot be rendered
          }
        }
      })
    }, [isLoaded, siteKey, onVerify, onExpire])

    return <div ref={containerRef} />
  }
)

ReCaptcha.displayName = "ReCaptcha"

