import { Presence } from '@radix-ui/react-presence'
import { Check, Clipboard, Link, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { Button } from '../../Button'

type ShareableLinkProps = {
  shared: boolean
}

export function ShareableLink({ shared }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopied(false)
    }, 2 * 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied])

  if (!shared && showQrCode) {
    setShowQrCode(false)
  }

  let clipboardIcon = <Clipboard data-cy="clipboard-icon" className="size-4" />
  if (copied) {
    clipboardIcon = <Check data-cy="check-icon" className="size-4" />
  }

  return (
    <>
      <Presence present={shared}>
        <div
          data-cy="share-link"
          data-state-shared={shared}
          className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-3 text-sm text-gray-600/90 data-[state-shared=true]:animate-in data-[state-shared=false]:animate-out data-[state-shared=false]:fade-out data-[state-shared=true]:fade-in data-[state-shared=false]:zoom-out-90 data-[state-shared=true]:zoom-in-90 dark:border-white/10 dark:bg-zinc-950 dark:text-gray-400"
        >
          <div className="truncate">
            <Link className="mr-2 inline size-4 -translate-y-0.5" />
            {location.href}
          </div>
          <div className="ml-5 flex h-5 items-center gap-2">
            <Button
              variant="icon"
              data-cy="qr-code-button"
              aria-label="Show QR code"
              onClick={() => {
                setShowQrCode(!showQrCode)
              }}
            >
              <QrCode className="size-4" />
            </Button>
            <Button
              variant="icon"
              data-cy="copy"
              aria-label="Copy to clipboard"
              onClick={async () => {
                await navigator.clipboard.writeText(location.href)
                setCopied(true)
              }}
            >
              {clipboardIcon}
            </Button>
          </div>
        </div>
      </Presence>

      <Presence present={showQrCode}>
        <div
          data-cy="qr-code"
          data-state-qr={showQrCode}
          className="rounded-xl border border-black/10 bg-white p-3 data-[state-qr=true]:animate-in data-[state-qr=false]:animate-out data-[state-qr=false]:fade-out data-[state-qr=true]:fade-in data-[state-qr=false]:zoom-out-90 data-[state-qr=true]:zoom-in-90 dark:border-white/10"
        >
          <QRCodeSVG value={location.href} className="size-full" />
        </div>
      </Presence>
    </>
  )
}
