'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'

/** Full-screen viewer (same look as the public vehicle page) to browse every photo of a request. */
function PhotoViewer({ photos, startIndex, onClose }: { photos: string[]; startIndex: number; onClose: () => void }) {
    const [active, setActive] = useState(startIndex)
    const hasSeveral = photos.length > 1
    const go = useCallback((direction: number) => setActive((current) => (current + direction + photos.length) % photos.length), [photos.length])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
            if (event.key === 'ArrowLeft') go(-1)
            if (event.key === 'ArrowRight') go(1)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [go, onClose])

    return (
        <div className="vehicle-lightbox" role="dialog" aria-modal="true" aria-label={`Photo ${active + 1} sur ${photos.length}`} onClick={onClose}>
            <a
                href={photos[active]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="absolute top-6 left-6 flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
                <ExternalLink className="size-4" /> Ouvrir l&apos;original
            </a>
            <button type="button" className="vehicle-lightbox-close" aria-label="Fermer" onClick={onClose}>
                <X />
            </button>
            {hasSeveral && (
                <button type="button" className="vehicle-lightbox-prev" aria-label="Photo précédente" onClick={(event) => { event.stopPropagation(); go(-1) }}>
                    <ChevronLeft />
                </button>
            )}
            <img src={photos[active]} alt={`Photo ${active + 1}`} onClick={(event) => event.stopPropagation()} />
            {hasSeveral && (
                <button type="button" className="vehicle-lightbox-next" aria-label="Photo suivante" onClick={(event) => { event.stopPropagation(); go(1) }}>
                    <ChevronRight />
                </button>
            )}
            {hasSeveral && (
                <span className="vehicle-lightbox-count">
                    {String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </span>
            )}
        </div>
    )
}

function useViewer(photos: string[]) {
    const [openAt, setOpenAt] = useState<number | null>(null)
    // Rendered on <body>: a faded "Traité" card would otherwise fade the viewer too.
    const viewer = openAt !== null && createPortal(<PhotoViewer photos={photos} startIndex={openAt} onClose={() => setOpenAt(null)} />, document.body)
    return { open: setOpenAt, viewer }
}

/** Big cover photo shown on larger screens, with a "+N" badge when there are more. */
export function LeadCoverPhoto({ photos }: { photos: string[] }) {
    const { open, viewer } = useViewer(photos)
    const extraCount = photos.length - 1

    return (
        <>
            <button
                type="button"
                onClick={() => open(0)}
                aria-label={extraCount > 0 ? `Voir les ${photos.length} photos` : 'Voir la photo'}
                className="group relative hidden size-32 shrink-0 cursor-zoom-in overflow-hidden rounded-lg bg-muted sm:block"
            >
                <Image src={photos[0]} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                {extraCount > 0 && (
                    <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
                        +{extraCount}
                    </span>
                )}
            </button>
            {viewer}
        </>
    )
}

/** Row of thumbnails; each one opens the viewer on that photo. */
export function LeadPhotoStrip({ photos, className = '' }: { photos: string[]; className?: string }) {
    const { open, viewer } = useViewer(photos)

    return (
        <>
            <div className={`flex flex-wrap gap-2 pt-1 ${className}`}>
                {photos.map((url, index) => (
                    <button key={url} type="button" onClick={() => open(index)} aria-label={`Voir la photo ${index + 1}`} className="group cursor-zoom-in">
                        <div className="relative size-20 overflow-hidden rounded-lg bg-muted transition-transform group-hover:scale-105">
                            <Image src={url} alt="" fill className="object-cover" />
                        </div>
                    </button>
                ))}
            </div>
            {viewer}
        </>
    )
}
