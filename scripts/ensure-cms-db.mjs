import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const dbName = "shlash_website";
const adminUrl = url.replace(/\/[^/?]+(\?|$)/, "/postgres$1");

const client = new pg.Client({ connectionString: adminUrl });
await client.connect();
const exists = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
if (!exists.rowCount) {
  await client.query(`CREATE DATABASE ${dbName}`);
  console.log(`Created database ${dbName}`);
} else {
  console.log(`Database ${dbName} already exists`);
}
await client.end();
