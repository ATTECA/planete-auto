'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function VehicleGallery({ name, meta, images }: { name: string; meta: string; images: readonly string[] }) {
  const [active, setActive] = useState(0)
  const go = (direction: number) => setActive((current) => (current + direction + images.length) % images.length)
  return <section className="vehicle-gallery" aria-label={`Photos de ${name}`}>
    <div className="vehicle-main-photo">
      <img src={images[active]} alt={`${name} ${meta}, photo ${active + 1}`} />
      <button type="button" aria-label="Photo précédente" onClick={() => go(-1)}><ChevronLeft /></button>
      <button type="button" aria-label="Photo suivante" onClick={() => go(1)}><ChevronRight /></button>
      <span className="photo-count">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
    </div>
    <div className="vehicle-thumbnails" role="tablist" aria-label="Choisir une photo">
      {images.map((image, index) => <button type="button" role="tab" aria-selected={active === index} aria-label={`Afficher la photo ${index + 1}`} className={active === index ? 'is-active' : ''} key={image} onClick={() => setActive(index)}><img src={image} alt="" /></button>)}
    </div>
  </section>
}
