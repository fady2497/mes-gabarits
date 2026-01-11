let cached = null;

async function getPool() {
  try {
    if (cached) return cached;
    const enabled = process.env.MSSQL_ENABLED === 'true';
    if (!enabled) return null;
    const sql = require('mssql');
    const config = {
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      server: process.env.MSSQL_HOST || 'localhost',
      database: process.env.MSSQL_DATABASE,
      port: process.env.MSSQL_PORT ? parseInt(process.env.MSSQL_PORT, 10) : 1433,
      options: { encrypt: true, trustServerCertificate: true }
    };
    if (!config.user || !config.password || !config.database) return null;
    cached = await sql.connect(config);
    return cached;
  } catch (e) {
    console.warn('MSSQL disabled or failed:', e.message);
    return null;
  }
}

module.exports = { getPool };
