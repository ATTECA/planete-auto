'use client'

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ImagePlus, Plus, X } from 'lucide-react'

type DetailRow = { label: string; value: string }
type EquipmentRow = { category: string; items: string }

const emptyDetail = (): DetailRow => ({ label: '', value: '' })
const emptyEquipment = (): EquipmentRow => ({ category: '', items: '' })

export default function AdminNewVehiclePage() {
  const [passcode, setPasscode] = useState('')
  const [name, setName] = useState('')
  const [meta, setMeta] = useState('')
  const [year, setYear] = useState('')
  const [km, setKm] = useState('')
  const [fuel, setFuel] = useState('Diesel')
  const [gearbox, setGearbox] = useState('Manuelle')
  const [price, setPrice] = useState('')
  const [tag, setTag] = useState('Nouveauté')
  const [status, setStatus] = useState('Disponible')
  const [mainPhoto, setMainPhoto] = useState<File | null>(null)
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([])
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [featuredOrder, setFeaturedOrder] = useState('')
  const [details, setDetails] = useState<DetailRow[]>([emptyDetail()])
  const [equipment, setEquipment] = useState<EquipmentRow[]>([emptyEquipment()])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<number | null>(null)

  const mainPhotoInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)

  const updateDetail = (index: number, patch: Partial<DetailRow>) =>
    setDetails((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  const updateEquipment = (index: number, patch: Partial<EquipmentRow>) =>
    setEquipment((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)))

  const pickMainPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setMainPhoto(file)
    event.target.value = ''
  }

  const pickGalleryPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setGalleryPhotos((current) => [...current, ...files])
    event.target.value = ''
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess(null)
    if (!mainPhoto) { setError('Ajoutez une photo principale.'); return }
    setSending(true)
    try {
      const form = new FormData()
      form.set('passcode', passcode)
      form.set('name', name)
      form.set('meta', meta)
      form.set('year', year)
      form.set('km', km)
      form.set('fuel', fuel)
      form.set('gearbox', gearbox)
      form.set('price', price)
      form.set('tag', tag)
      form.set('status', status)
      form.set('description', description)
      form.set('featured', String(featured))
      form.set('featuredOrder', featuredOrder)
      form.set('mainPhoto', mainPhoto)
      galleryPhotos.forEach((photo) => form.append('galleryPhotos', photo))
      form.set('details', JSON.stringify(details.filter((row) => row.label.trim() && row.value.trim()).map((row) => [row.label.trim(), row.value.trim()])))
      form.set('equipment', JSON.stringify(equipment
        .filter((row) => row.category.trim() && row.items.trim())
        .map((row) => ({ category: row.category.trim(), items: row.items.split(',').map((item) => item.trim()).filter(Boolean) }))))

      const response = await fetch('/api/admin/vehicles', { method: 'POST', body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setSuccess(result.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'L’envoi a échoué.')
    } finally {
      setSending(false)
    }
  }

  return <main className="admin-shell">
    <div className="admin-form-wrap">
      <h1>Ajouter un véhicule</h1>
      {success && <p className="admin-success">Véhicule #{success} ajouté avec succès.</p>}
      <form className="admin-form" onSubmit={submit}>
        <label>Code d'accès admin<input type="password" required value={passcode} onChange={(e) => setPasscode(e.target.value)} /></label>

        <div className="admin-grid">
          <label>Nom<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Audi A5 Cabriolet" /></label>
          <label>Version / finition<input required value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="Ex. 3.0 V6 TDI 245ch S line" /></label>
          <label>Année<input required value={year} onChange={(e) => setYear(e.target.value)} placeholder="2012" /></label>
          <label>Kilométrage<input required value={km} onChange={(e) => setKm(e.target.value)} placeholder="259 897 km" /></label>
          <label>Carburant<select value={fuel} onChange={(e) => setFuel(e.target.value)}><option>Essence</option><option>Diesel</option><option>Hybride</option><option>Électrique</option></select></label>
          <label>Boîte<select value={gearbox} onChange={(e) => setGearbox(e.target.value)}><option>Manuelle</option><option>Automatique</option></select></label>
          <label>Prix<input required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="11 990 €" /></label>
          <label>Étiquette<input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Nouveauté" /></label>
          <label>Statut<input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Disponible" /></label>
        </div>

        <div className="admin-photos">
          <span className="admin-photos-label">Photo principale</span>
          <div className="admin-photos-grid">
            {mainPhoto ? (
              <div className="admin-photo">
                <img src={URL.createObjectURL(mainPhoto)} alt="" />
                <button type="button" onClick={() => setMainPhoto(null)} aria-label="Retirer la photo principale"><X size={14} /></button>
              </div>
            ) : (
              <button type="button" className="admin-photo-add" onClick={() => mainPhotoInput.current?.click()}><ImagePlus size={20} /><span>Ajouter</span></button>
            )}
          </div>
          <input ref={mainPhotoInput} type="file" accept="image/*" hidden onChange={pickMainPhoto} />
        </div>

        <div className="admin-photos">
          <span className="admin-photos-label">Galerie (photos supplémentaires) <span>({galleryPhotos.length})</span></span>
          <div className="admin-photos-grid">
            {galleryPhotos.map((photo, index) => (
              <div className="admin-photo" key={`${photo.name}-${index}`}>
                <img src={URL.createObjectURL(photo)} alt="" />
                <button type="button" onClick={() => setGalleryPhotos((current) => current.filter((_, i) => i !== index))} aria-label="Retirer la photo"><X size={14} /></button>
              </div>
            ))}
            <button type="button" className="admin-photo-add" onClick={() => galleryInput.current?.click()}><ImagePlus size={20} /><span>Ajouter</span></button>
          </div>
          <input ref={galleryInput} type="file" accept="image/*" multiple hidden onChange={pickGalleryPhotos} />
        </div>

        <label>Description<textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} /></label>

        <label className="admin-checkbox"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Véhicule mis en avant</label>
        {featured && <label>Ordre de mise en avant<input value={featuredOrder} onChange={(e) => setFeaturedOrder(e.target.value)} placeholder="1" /></label>}

        <h2>Fiche technique</h2>
        {details.map((row, index) => (
          <div className="admin-row" key={index}>
            <input value={row.label} onChange={(e) => updateDetail(index, { label: e.target.value })} placeholder="Marque" />
            <input value={row.value} onChange={(e) => updateDetail(index, { value: e.target.value })} placeholder="AUDI" />
            <button type="button" onClick={() => setDetails((current) => current.filter((_, i) => i !== index))} aria-label="Retirer"><X size={16} /></button>
          </div>
        ))}
        <button type="button" className="admin-add" onClick={() => setDetails((current) => [...current, emptyDetail()])}><Plus size={15} /> Ajouter une caractéristique</button>

        <h2>Équipements</h2>
        {equipment.map((row, index) => (
          <div className="admin-row" key={index}>
            <input value={row.category} onChange={(e) => updateEquipment(index, { category: e.target.value })} placeholder="Sécurité" />
            <input value={row.items} onChange={(e) => updateEquipment(index, { items: e.target.value })} placeholder="ABS, ESP, Airbags..." />
            <button type="button" onClick={() => setEquipment((current) => current.filter((_, i) => i !== index))} aria-label="Retirer"><X size={16} /></button>
          </div>
        ))}
        <button type="button" className="admin-add" onClick={() => setEquipment((current) => [...current, emptyEquipment()])}><Plus size={15} /> Ajouter une catégorie</button>

        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-submit" type="submit" disabled={sending}>{sending ? 'Enregistrement...' : 'Ajouter le véhicule'}</button>
      </form>
    </div>
  </main>
}
