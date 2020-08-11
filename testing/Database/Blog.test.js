const Database = require("../../lib/server/database")

const db = new Database();

describe("Account Database Testing", () => {
    beforeEach(async () => {
        await db.connect('sqlite3');
        await db.init('David', 'Gonzalez', 'email@example.com', '1234');
    });

    afterEach(async () => {
        await db.clear();
        await db.destroy();
    })
    test("Blog is Installed", async () => {
        const isInstalled = await db.isInstalled();
        expect(isInstalled).toBeTruthy();
    })
});  