const DB = require('./lib/server/Database');
const db = new DB(true);


async function main() {
  try {
    await db.connect('mysql', 'root', '', 'localhost', '3306', 'blog');
    await db.init("David", "González", "davidsdevel@gmail.com", "1234");

    const data = {
      title: "Hola Mundo",
      ID: "35",
      description: "Hola Mundo",
      tags: "hola mundo, prueba",
      content: `<img class="lazy" data-src="/image/3453026642/59E.jpg" src="/resize-image?url=/image/3453026642/59E.jpg&amp;width=50" alt="Hola Mundo - David's Devel" title="Hola Mundo - David's Devel" style="width: 1920px;"><p>Hola Mundo</p>`,
      image: "/image/3453026642/59E.jpg",
      url: "hola-mundo",
      category: "development",
      postStatus: "saved",
    };

    const login = await db.publishPost(data);

    return Promise.resolve(login);
  } catch (err) {
    return Promise.reject(err);
  }
}

main().then((e) => console.log(e)).catch((err) => console.error(err));
