const express = require("express");

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const {initApp, testDatabase, install} = require("./server");
const {join} = require("path");

var serverLintening;

function main() {
    const static = join(__dirname, "public");
    const installationFolder = join(__dirname, "installation")

    const server = express();

    server.use(express.static(static));

    server
        .get("/", (req, res) => res.redirect(302, "/install"))
        .get("/install", (req, res) => res.sendFile(join(installationFolder, "index.html")))
        .get('/test-connection', async (req, res) => {
            try {
              const data = await testDatabase(req.query);

              res.send(data);
            } catch (err) {
              res.sendStatus(500).send('error');
            }
        })
        .get('/init-app', async (req, res, next) => {
            try {
                await install(req.query);

                serverLintening.close(async () => {
                    console.log("Installed App --- Launching");
                    res.send("success");

                    await initApp();
                });
            } catch(err) {
                res.status(500).send(err.toString());
            }
        })
        .get("/js/index.js", (req, res) => {
            if (dev)
                return res.sendFile(join(installationFolder, "src", "index.js"))
            else
                return res.sendFile(join(installationFolder, "build", "index.js"))
        })
        .get("/css/index.css", (req, res) => {
            if (dev)
                return res.sendFile(join(installationFolder, "src", "index.css"))
            else
                return res.sendFile(join(installationFolder, "build", "index.css"))
        })
        .get("*", (req, res) => res.sendFile(req.url));

    serverLintening = server.listen(PORT, () => console.log("> Listen Installation"));
}

main();
