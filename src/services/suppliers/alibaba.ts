export async function createOrderAlibaba(
  _payload: unknown,
  _cfg: { api_base?: string; api_key?: string }
) {
  return { supplier_order_id: `alibaba-${Date.now()}` };
}
export async function fetchProductsAlibaba(
  _query: string,
  _cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
