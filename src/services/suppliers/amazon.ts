export async function createOrderAmazon(_payload: unknown, _cfg: { api_base?: string, api_key?: string }) {
  return { supplier_order_id: `amazon-${Date.now()}` }
}
export async function fetchProductsAmazon(_query: string, _cfg: { api_base?: string, api_key?: string }) {
  return []
}
