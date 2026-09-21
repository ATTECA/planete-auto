import {
  Armchair,
  Bluetooth,
  Check,
  CircleDot,
  Disc,
  Eye,
  Gauge,
  Lightbulb,
  type LucideIcon,
  MapPin,
  Monitor,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  ShieldPlus,
  Snowflake,
  Thermometer,
  Usb,
} from 'lucide-react'

/** Maps a known equipment item's exact label to its icon. Anything else falls back to DEFAULT_EQUIPMENT_ITEM_ICON. */
export const EQUIPMENT_ITEM_ICONS: Record<string, LucideIcon> = {
  'Kit mains-libres Bluetooth': Bluetooth,
  'GPS Cartographique': MapPin,
  'Prise USB': Usb,
  'Régulateur de vitesse': Gauge,
  'Palettes changement vitesses au volant': Settings2,
  'Jantes Alu': Disc,
  'Rétroviseurs électriques': Eye,
  'Feux de jour à LED': Lightbulb,
  'Clim automatique bi-zones': Snowflake,
  'Volant cuir': CircleDot,
  'Sièges avant chauffants': Thermometer,
  'Ordinateur de bord': Monitor,
  ABS: ShieldCheck,
  ESP: ShieldAlert,
  'Airbags latéraux avant': ShieldHalf,
  Antipatinage: ShieldPlus,
}

export const DEFAULT_EQUIPMENT_ITEM_ICON: LucideIcon = Check
export const DEFAULT_EQUIPMENT_CATEGORY_ICON: LucideIcon = Armchair
