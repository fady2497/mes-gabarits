import { supabase } from '../../lib/supabase';
import { createOrderAmazon } from './amazon';
import { createOrderAliexpress } from './aliexpress';
import { createOrderAlibaba } from './alibaba';
import { createOrderShein } from './shein';
import { createOrderTemu } from './temu';

const creators: Record<string, (payload: any, cfg: any) => Promise<{ supplier_order_id: string }>> =
  {
    amazon: createOrderAmazon,
    aliexpress: createOrderAliexpress,
    alibaba: createOrderAlibaba,
    shein: createOrderShein,
    temu: createOrderTemu
  };

export async function dispatchDropShip(
  orderId: string,
  items: Array<{ supplier_id: string | null; product_id: string; quantity: number }>
) {
  const grouped: Record<string, Array<{ product_id: string; quantity: number }>> = {};
  items.forEach((it) => {
    const sid = it.supplier_id || 'unknown';
    grouped[sid] = grouped[sid] || [];
    grouped[sid].push({ product_id: it.product_id, quantity: it.quantity });
  });
  const { data: suppliers } = await (supabase as any)
    .from('suppliers')
    .select('id, api_base, api_key');
  const cfgMap: Record<string, any> = {};
  (suppliers || []).forEach((s: any) => (cfgMap[s.id] = s));
  for (const sid of Object.keys(grouped)) {
    const creator = creators[sid];
    if (!creator) continue;
    const res = await creator({ orderId, items: grouped[sid] }, cfgMap[sid] || {});
    await (supabase as any).from('order_shipments').insert({
      order_id: orderId,
      supplier_id: sid,
      supplier_order_id: res.supplier_order_id,
      status: 'processing'
    });
  }
}
