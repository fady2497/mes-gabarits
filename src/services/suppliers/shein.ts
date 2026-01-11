export async function createOrderShein(payload: any, cfg: { api_base?: string; api_key?: string }) {
  return { supplier_order_id: `shein-${Date.now()}` };
}
export async function fetchProductsShein(
  query: string,
  cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
