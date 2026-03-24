'use client'

import { useState } from 'react'
import { Check, Copy, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => window.open(twitterUrl, '_blank', 'width=550,height=420')}
      >
        <Twitter className="h-3.5 w-3.5" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={() => window.open(linkedinUrl, '_blank', 'width=550,height=420')}
      >
        <Linkedin className="h-3.5 w-3.5" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>
    </div>
  )
}
