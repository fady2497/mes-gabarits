export type AdBanner = { title: string; subtitle?: string; ctaLabel?: string; ctaHref?: string };
export type AdSlot = { title: string; subtitle?: string; href?: string };
export type AdsResponse = { banner?: AdBanner; slots: AdSlot[] };

export async function fetchAds(): Promise<AdsResponse> {
  try {
    const { data } = await (supabase as any)
      .from('ads')
      .select('type, title, subtitle, href, active, position')
      .eq('active', true)
      .order('position', { ascending: true });
    const banner = Array.isArray(data)
      ? data.find((d: any) => d.type === 'banner') || undefined
      : undefined;
    const slots = Array.isArray(data) ? data.filter((d: any) => d.type === 'slot') : [];
    if (banner || slots.length) {
      return {
        banner: banner
          ? {
              title: banner.title,
              subtitle: banner.subtitle,
              ctaLabel: 'Voir',
              ctaHref: banner.href
            }
          : undefined,
        slots: slots.map((s: any) => ({ title: s.title, subtitle: s.subtitle, href: s.href }))
      };
    }
  } catch {}
  try {
    const res = await fetch('/ads.json');
    const data = await res.json();
    return { banner: data.banner, slots: Array.isArray(data.slots) ? data.slots : [] };
  } catch {
    return { banner: undefined, slots: [] };
  }
}
import { supabase } from '../lib/supabase';
