'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const scrollArea = document.getElementById('admin-main')
        if (!scrollArea) return

        const handleScroll = () => setVisible(scrollArea.scrollTop > 400)
        handleScroll()
        scrollArea.addEventListener('scroll', handleScroll)
        return () => scrollArea.removeEventListener('scroll', handleScroll)
    }, [])

    if (!visible) return null

    return (
        <button
            type="button"
            onClick={() => document.getElementById('admin-main')?.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Retour en haut"
            title="Retour en haut"
            className="fixed bottom-8 right-8 z-30 flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:-translate-y-0.5"
        >
            <ArrowUp className="size-5" />
        </button>
    )
}
