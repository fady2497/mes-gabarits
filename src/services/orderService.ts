import { supabase } from '../lib/supabase'

export type OrderStatus = 'pending_drop_ship' | 'processing' | 'shipped' | 'cancelled'

export async function createOrder(payload: {
  customer: { firstName: string, lastName: string, email: string, phone: string, address: string, city: string, postalCode: string, country: string },
  items: Array<{ product_id: string, name: string, price: number, quantity: number, supplier_id?: string }>,
  totals: { subtotal: number, shipping: number, tax: number, total: number }
}) {
  const { data: orderData, error: orderErr } = await (supabase as any).from('orders').insert({
    status: 'pending_drop_ship',
    customer_first_name: payload.customer.firstName,
    customer_last_name: payload.customer.lastName,
    customer_email: payload.customer.email,
    customer_phone: payload.customer.phone,
    address: payload.customer.address,
    city: payload.customer.city,
    postal_code: payload.customer.postalCode,
    country: payload.customer.country,
    subtotal: payload.totals.subtotal,
    shipping: payload.totals.shipping,
    tax: payload.totals.tax,
    total: payload.totals.total
  }).select().single()
  if (orderErr) throw orderErr
  const orderId = orderData?.id || `local-${Date.now()}`
  const rows = payload.items.map(it => ({
    order_id: orderId,
    product_id: it.product_id,
    name: it.name,
    price: it.price,
    quantity: it.quantity,
    supplier_id: it.supplier_id || null
  }))
  await (supabase as any).from('order_items').insert(rows)
  return { id: orderId }
}

export async function listOrders() {
  const { data } = await (supabase as any).from('orders').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, tracking?: string) {
  await (supabase as any).from('orders').update({ status, tracking }).eq('id', orderId)
}
