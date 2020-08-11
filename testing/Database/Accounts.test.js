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
    test('Should Create a Colaborator', async () => {
        const ID = await db.createColaborator({
            name: 'David',
            lastname: 'Gonzalez',
            email: 'anotherEmail@example.com',
            password: 'MyEncryptedPassword'
        });

        expect(ID).toBeGreaterThanOrEqual(2);
    });
    test('Should Return a promise with exists Email', () => {
        const Create = db.createColaborator({
            email: 'email@example.com',
        });

        return expect(Create).resolves.toBe('Email already exists')
    });

    test("Fetch colaborators", async () => {
        const ID = await db.createColaborator({
            name: 'name', 
            lastname: 'lastname', 
            description: 'description', 
            ocupation: 'developer', 
            type: 'colaborator', 
            photo: 'photo', 
            email: 'email@email.com', 
            password: 'password', 
            facebook: 'facebook', 
            twitter: 'twitter', 
            instagram: 'instagram', 
            linkedin: 'linkedin', 
        });
        const colaborators = await db.allColaborators();

        expect(colaborators).toEqual({
            colaborators: [
                {
                    ID: 2,
                    name: 'name', 
                    lastname: 'lastname', 
                    description: 'description',
                    type: 'colaborator', 
                    photo: 'photo', 
                    email: 'email@email.com', 
                    password: 'password', 
                    facebook: 'facebook', 
                    twitter: 'twitter', 
                    instagram: 'instagram', 
                    linkedin: 'linkedin',
                    ocupation: "developer"
                }
            ]
        })
    })

    test('Login success', async () => {
        const login = await db.login('email@example.com', '1234');

        expect(login).toHaveProperty('email', 'email@example.com');
    })
    test('Login bad Email', async () => {
        const login = await db.login('badEmail@example.com', '1234');

        expect(login).toEqual({
            pass: false,
            message: "Email no existe"
        });
    })
    test('Login bad Password', async () => {
        const login = await db.login('email@example.com', '123');

        expect(login).toEqual({
            pass: false,
            message: "Contraseña incorrecta"
        });
    })
})