import { Bluetooth, CircleDot, Flame, Gauge, KeyRound, Navigation, ParkingCircle, ShieldCheck, Snowflake, Tablet, Usb } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Vehicle } from '@/lib/vehicles'

export const FEATURE_ICONS: { key: string; label: string; icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>; match: RegExp }[] = [
  { key: 'clim', label: 'Climatisation', icon: Snowflake, match: /clim/i },
  { key: 'gps', label: 'GPS', icon: Navigation, match: /gps|cartograph|navigation/i },
  { key: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, match: /bluetooth|mains-libres/i },
  { key: 'regulateur', label: 'Régulateur de vitesse', icon: Gauge, match: /régulateur|regulateur/i },
  { key: 'radar', label: 'Radar de stationnement', icon: ParkingCircle, match: /radar|stationnement/i },
  { key: 'chauffants', label: 'Sièges chauffants', icon: Flame, match: /chauffant/i },
  { key: 'ecran', label: 'Écran tactile', icon: Tablet, match: /écran|ecran|tactile/i },
  { key: 'usb', label: 'Prise USB', icon: Usb, match: /usb/i },
  { key: 'sans-cle', label: 'Démarrage sans clé', icon: KeyRound, match: /sans clé|sans cle|démarrage sans/i },
  { key: 'jantes', label: 'Jantes alu', icon: CircleDot, match: /jantes/i },
  { key: 'securite', label: 'ABS / ESP / Airbags', icon: ShieldCheck, match: /abs|esp|airbag|antipatinage/i },
]

export const getFeatureIcons = (vehicle: Vehicle) => {
  const items = (vehicle.equipment ?? []).flatMap((group) => group.items)
  return FEATURE_ICONS.filter((def) => items.some((item) => def.match.test(item)))
}
