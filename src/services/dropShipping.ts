import { supabase } from '../lib/supabase';

export async function routeOrderItems(items: Array<{ product_id: string; quantity: number }>) {
  const ids = items.map((i) => i.product_id);
  const { data } = await (supabase as any)
    .from('products')
    .select('id,supplier_id,name,price')
    .in('id', ids);
  const map: Record<string, any> = {};
  (data || []).forEach((p: any) => {
    map[p.id] = p;
  });
  return items.map((i) => {
    const p = map[i.product_id] || {};
    return {
      product_id: i.product_id,
      name: p.name || 'Produit',
      price: p.price || 0,
      quantity: i.quantity,
      supplier_id: p.supplier_id || null
    };
  });
}
