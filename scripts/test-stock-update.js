async function main() {
  const url = 'http://localhost:5002/api/stock';
  const payload = { id: 'B-011', current: 11, target: 20 };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': 'DEV_STOCK_TOKEN' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
