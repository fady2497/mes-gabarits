export async function createOrderAlibaba(
  payload: any,
  cfg: { api_base?: string; api_key?: string }
) {
  return { supplier_order_id: `alibaba-${Date.now()}` };
}
export async function fetchProductsAlibaba(
  query: string,
  cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
