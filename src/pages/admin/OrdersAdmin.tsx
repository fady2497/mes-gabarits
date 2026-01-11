import React, { useEffect, useState } from 'react'
import { listOrders, updateOrderStatus } from '../../services/orderService'

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tracking, setTracking] = useState<Record<string, string>>({})
  const load = async () => {
    setLoading(true)
    const data = await listOrders()
    setOrders(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  const setShip = async (id: string) => {
    await updateOrderStatus(id, 'shipped', tracking[id] || '')
    await load()
  }
  return (
    <div className="container-amazon py-8">
      <div className="text-secondary-900 font-bold text-xl mb-4">Commandes</div>
      {loading && <div className="card-amazon p-4">Chargement...</div>}
      {!loading && orders.length === 0 && <div className="card-amazon p-4">Aucune commande</div>}
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="card-amazon p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-secondary-900">#{o.id} • {o.status}</div>
                <div className="text-secondary-700 text-sm">{o.customer_first_name} {o.customer_last_name} — {o.city}</div>
                <div className="text-secondary-600 text-sm">Total: {o.total}€</div>
              </div>
              <div className="flex items-center gap-2">
                <input value={tracking[o.id] || ''} onChange={e=>setTracking(t=>({ ...t, [o.id]: e.target.value }))} placeholder="N° suivi" className="input-amazon w-40" />
                <button className="btn-primary" onClick={()=>setShip(o.id)}>Marquer expédiée</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
