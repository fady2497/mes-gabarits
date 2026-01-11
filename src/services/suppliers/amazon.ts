export async function createOrderAmazon(payload: any, cfg: { api_base?: string, api_key?: string }) {
  return { supplier_order_id: `amazon-${Date.now()}` }
}
export async function fetchProductsAmazon(query: string, cfg: { api_base?: string, api_key?: string }) {
  return []
}
