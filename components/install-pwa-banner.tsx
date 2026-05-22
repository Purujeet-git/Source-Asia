'use client'

import {
  useEffect,
  useState,
} from 'react'

export default function
InstallPWABanner() {

  const [
    deferredPrompt,
    setDeferredPrompt,
  ] = useState<any>(null)

  const [
    visible,
    setVisible,
  ] = useState(false)

  useEffect(() => {

    const handler =
      (e: any) => {

        e.preventDefault()

        setDeferredPrompt(e)

        setVisible(true)
      }

    window.addEventListener(
      'beforeinstallprompt',
      handler
    )

    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handler
      )

  }, [])

  const installApp =
    async () => {

      if (!deferredPrompt)
        return

      deferredPrompt.prompt()

      await deferredPrompt.userChoice

      setVisible(false)
    }

  if (!visible)
    return null

  return (

    <div className="
      fixed
      bottom-4
      left-4
      right-4
      z-50
      rounded-2xl
      bg-black
      p-4
      text-white
      shadow-xl
    ">

      <div className="
        flex
        items-center
        justify-between
      ">

        <p>
          Install SkyBook App
        </p>

        <button
          onClick={installApp}

          className="
            rounded-lg
            bg-white
            px-4
            py-2
            text-black
          "
        >

          Install

        </button>

      </div>

    </div>
  )
}