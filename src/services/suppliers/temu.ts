export async function createOrderTemu(payload: any, cfg: { api_base?: string; api_key?: string }) {
  return { supplier_order_id: `temu-${Date.now()}` };
}
export async function fetchProductsTemu(
  query: string,
  cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
