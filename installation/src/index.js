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
var blogData = {}

document.addEventListener("DOMContentLoaded", function() {
    ids = [
        document.getElementById("step-1"),
        document.getElementById("step-2"),
        document.getElementById("step-3"),
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
    for (var i = 1; i <= 3; i++) {
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

    databaseData[name] = value;
}
function handleInputUser(event) {
    var name = event.target.name;
    var value = event.target.value;

    userData[name] = value;
}
async function testDB() {
    try {
        var mapped = Object.entries(databaseData).map(e => {
            return e[0] + "=" + e[1];
        });

        const res = await fetch("/test-connection?" + mapped.join("&"));

        const data = await res.text();
        
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
async function install() {
    try {
        console.log(userData, databaseData);
        //const res = await fetch("/init-app")
    } catch(err) {

    }
}