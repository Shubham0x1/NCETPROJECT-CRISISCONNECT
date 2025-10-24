export interface GeocodeResult { lat: string; lon: string; display_name?: string }

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
  const res = await fetch(url, { headers: { 'User-Agent': 'CrisisConnect App' } })
  if (!res.ok) return null
  const data = await res.json()
  if (Array.isArray(data) && data.length > 0) return data[0] as GeocodeResult
  return null
}
