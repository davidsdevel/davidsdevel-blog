const Database = require("./lib/server/database")

const db = new Database();

async function main() {
  await db.connect('sqlite3');
  await db.init('David', 'Gonzalez', 'email@example.com', '1234');
  const isInstalled = await db.isInstalled();
  await db.clear();
        await db.destroy();
}  

main()