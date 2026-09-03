export const vehicles = [
  { id: 1, name: 'Peugeot 3008', meta: '1.5 BlueHDi 130 GT Line', year: '2020', km: '64 800 km', fuel: 'Diesel', gearbox: 'Automatique', price: '21 490 €', tag: 'Coup de cœur', status: 'Disponible', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85' },
  { id: 2, name: 'Audi A3 Sportback', meta: '35 TFSI 150 S line', year: '2021', km: '42 300 km', fuel: 'Essence', gearbox: 'Automatique', price: '24 990 €', tag: 'Nouveauté', status: 'Disponible', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85' },
  { id: 3, name: 'Renault Clio V', meta: 'TCe 90 Intens', year: '2022', km: '28 150 km', fuel: 'Essence', gearbox: 'Manuelle', price: '15 490 €', tag: 'Bon plan', status: 'Disponible', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=85' },
] as const

export type Vehicle = (typeof vehicles)[number]
export function getVehicle(id: string) { return vehicles.find((vehicle) => vehicle.id === Number(id)) }
