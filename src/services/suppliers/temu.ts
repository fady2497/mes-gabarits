export async function createOrderTemu(_payload: unknown, _cfg: { api_base?: string; api_key?: string }) {
  return { supplier_order_id: `temu-${Date.now()}` };
}
export async function fetchProductsTemu(
  _query: string,
  _cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
