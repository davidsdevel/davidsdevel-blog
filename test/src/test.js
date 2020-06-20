var step = 1;
        var ids = [];
        var databaseConnected = false;
        var databaseData = {
            server: "localhost",
            port:3306,
            user: "root",
            password: "",
            client: "mysql",
            database: "blog"
        };
        var userData = {};

        document.addEventListener("DOMContentLoaded", () => {
            ids = [
                document.getElementById("step-1"),
                document.getElementById("step-2"),
                document.getElementById("step-3"),
                document.getElementById("step-4")
            ];

            if (location.hash) {
                var stepHash = location.hash.replace("#step", "");
                step = stepHash * 1;
                changeTab();
            }
        }, false);

        function next() {
            step++;
            changeTab();
        }
        function prev() {
            step--;
            changeTab();
        }
        function changeTab() {
            for (let i of 4) {
                if (i < step) {
                    ids[i - 1].style.left = "-100%";
                } else if (i === step) {
                    ids[i - 1].style.left = "0";
                }
                else {
                    ids[i - 1].style.left = "100%";
                }
            }
        }
        function handleInputDatabase(event) {
            var name = event.target.name;
            var value = event.target.value;

            if (name === "client"){
                var stepTwoTag = document.getElementById("step-2");
                var html;

                if (value === "sqlite3") {
                    html = '<span>Base de Datos</span><div><label for="username">Cliente</label><div><select onchange="handleInputDatabase(event)" name="client" id="client" default="' + value + '"><option value="pg">PostsgreSQL</option><option value="mysql">MySQL</option><option value="sqlite3">SQLite</option></select></div></div><div><label for="filenameDatabase">Nombre de Archivo</label><div><input onchange="handleInputDatabase(event)" type="text" name="filenameDatabase" id="filenameDatabase" value="test.db" placeholder="UsuarioBaseDeDatos"></div></div><button class="black" onclick="testDB()">Probar Base de Datos</button><div><button class="gray" onclick="prev()">Anterior</button><button class="black" id="step-2-next" disabled onclick="next()">Siguiente</button></div>'
                } else {
                    html = '<span>Base de Datos</span><div><label for="username">Cliente</label><div><select onchange="handleInputDatabase(event)" name="client" id="client" value="' + value + '"><option value="pg">PostsgreSQL</option><option value="mysql">MySQL</option><option value="sqlite3">SQLite</option></select></div></div><div><label for="user">Nombre de Usuario</label><div><input onchange="handleInputDatabase(event)" type="text" name="user" id="user" value="root" placeholder="UsuarioBaseDeDatos"></div></div><div><label for="password">Contraseña</label><div><input onchange="handleInputDatabase(event)" type="text" name="password" id="password" value="" placeholder="SuperSecreto"></div></div><div><label for="server">Servidor</label><div><input onchange="handleInputDatabase(event)" type="text" name="server" id="server" value="localhost" placeholder="dominio.algo.com"></div></div><div><label for="port">Puerto</label><div><input onchange="handleInputDatabase(event)" type="text" name="port" id="port" value="3306" placeholder="8080"></div></div><button class="black" onclick="testDB()">Probar Base de Datos</button><div><button class="gray" onclick="prev()">Anterior</button><button class="black" id="step-2-next" disabled onclick="next()">Siguiente</button></div>';

                }

                stepTwoTag.innerHTML = html;

                document.getElementById("client").value = value;

            }

            databaseData[name] = value;
        }
        function handleInputUser(event) {
            var name = event.target.name;
            var value = event.target.value;

            userData[name] = value;
        }
async function testDB() {
    try {

        var mapped = Object.entries(databaseData).map(e => e[0] + "=" + e[1]);
            
        const res = await fetch("/test-connection?" + mapped.join("&"))
        const data = await res.test();

        if (data === "success") {
            alert("Conexión Exitosa");
            document.getElementById("step-2-next").disabled = false;
        } else {
            alert("Error al establecer la conexión");
        }
    } catch(err) {
        console.error(err);
        alert("Error al establecer la conexión");
    }
}