'use client'

import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { useEffect, useState } from 'react'

export function VehicleGallery({ name, meta, images, showWarranty }: { name: string; meta: string; images: readonly string[]; showWarranty?: boolean }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const go = (direction: number) => setActive((current) => (current + direction + images.length) % images.length)

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen])

  return <section className="vehicle-gallery" aria-label={`Photos de ${name}`}>
    <div className="vehicle-main-photo">
      <button type="button" className="vehicle-main-photo-open" onClick={() => setLightboxOpen(true)} aria-label="Agrandir la photo">
        <img src={images[active]} alt={`${name} ${meta}, photo ${active + 1}`} />
        <span className="vehicle-zoom-hint"><ZoomIn size={16} /> Agrandir</span>
      </button>
      {showWarranty && <img className="warranty-badge" src="/garantie-icon.png" alt="Garantie 3 mois" />}
      <button type="button" className="vehicle-nav-btn vehicle-nav-prev" aria-label="Photo précédente" onClick={() => go(-1)}><ChevronLeft /></button>
      <button type="button" className="vehicle-nav-btn vehicle-nav-next" aria-label="Photo suivante" onClick={() => go(1)}><ChevronRight /></button>
      <span className="photo-count">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
    </div>
    <div className="vehicle-thumbnails" role="tablist" aria-label="Choisir une photo">
      {images.map((image, index) => <button type="button" role="tab" aria-selected={active === index} aria-label={`Afficher la photo ${index + 1}`} className={active === index ? 'is-active' : ''} key={image} onClick={() => setActive(index)}><img src={image} alt="" /></button>)}
    </div>

    {lightboxOpen && (
      <div className="vehicle-lightbox" role="dialog" aria-modal="true" aria-label={`${name} ${meta}, photo ${active + 1} agrandie`} onClick={() => setLightboxOpen(false)}>
        <button type="button" className="vehicle-lightbox-close" aria-label="Fermer" onClick={() => setLightboxOpen(false)}><X /></button>
        <button type="button" className="vehicle-lightbox-prev" aria-label="Photo précédente" onClick={(event) => { event.stopPropagation(); go(-1) }}><ChevronLeft /></button>
        <img src={images[active]} alt={`${name} ${meta}, photo ${active + 1}`} onClick={(event) => event.stopPropagation()} />
        <button type="button" className="vehicle-lightbox-next" aria-label="Photo suivante" onClick={(event) => { event.stopPropagation(); go(1) }}><ChevronRight /></button>
        <span className="vehicle-lightbox-count">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>
    )}
  </section>
}
