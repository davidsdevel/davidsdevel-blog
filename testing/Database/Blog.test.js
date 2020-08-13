const Database = require("../../lib/server/Database")

const db = new Database();

describe("Blog Database Testing", () => {
    beforeEach(async () => {
        await db.connect(process.env.DB_CLENT, process.env.DATABASE_URL);
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