const log = require('electron-log');
log.transports.file.resolvePath = () => __dirname + "/logs/2n.log";

const lock1 = document.getElementById("lock1Class");
const lock2 = document.getElementById("lock2Class");
const lock3 = document.getElementById("lock3Class");
const checkStatusID = document.getElementById("checkStatus");
const checkDoorOpenColor = document.getElementById('lock');
const checkDoorOpenColor2 = document.getElementById('lock2');
const checkDoorOpenColor3 = document.getElementById('lock3');
const nameOutput = document.getElementById('nameOutput');
const emailOutput = document.getElementById('emailOutput');
const pinOutput = document.getElementById('pinOutput');
const dateStartOutput = document.getElementById('dateStart');
const dateEndOutput = document.getElementById('dateEnd');
const array1 = [];
const array2 = [];

let userUuid;
let count = 0;
let count2 = 1;
let status = '';
let password = 'Welkom2019!'//sessionStorage["wachtwoord"];
let username = 'admin'//sessionStorage["naam"];
let name = username + ":" + password;
let b64 = btoa(name);
let response;
let response2;
let response3;
let response4;
let checkDoorLock;

var url = 'https://192.168.33.10/api/log/subscribe?filter=SwitchStateChanged,OutputChanged';
var id;
var url2;

log.transports.console.level = false;
log.transports.file.maxSize = 512000;

document.getElementById("loggedInUsername").innerHTML = username;
window.onload = function () {
    window.location.replace('xcube-control.html?#');
    var checkDoor = window.setInterval(function () {
        const url = "https://192.168.33.10/api/switch/status";
        const urlCheck2N = "https://192.168.33.10/api/system/status";
        const xhr = new XMLHttpRequest();
        const xhr2 = new XMLHttpRequest();
        const xhr3 = new XMLHttpRequest();

        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            response = JSON.stringify(data.result.switches[0].active);
            const checkDoor = JSON.stringify(data.result.switches[0].locked);
            if (checkDoor == 'false') {
                checkDoorLock = 'unlocked';
                lock3.className = "fa fa-unlock";
                checkDoorOpenColor3.style.color = 'green';
            } else {
                checkDoorLock = 'locked';
                lock3.className = 'fa fa-lock';
                checkDoorOpenColor3.style.color = 'red';
            }
            if (response == 'true') {
                count = 1;
                lock1.className = "fa fa-unlock";
                checkDoorOpenColor.style.color = 'green';
            } else {
                count2 = 1;
                getLog();
                checkDoorOpenColor.style.color = "red";
                lock1.className = "fa fa-lock";
            }

        };
        xhr2.onload = () => {
            const data2 = JSON.parse(xhr2.responseText);
            response2 = JSON.stringify(data2.result.switches[1].active);
            if (response2 == 'true') {
                checkDoorOpenColor2.style.color = 'green';
                lock2.className = "fa fa-unlock";
            } else {
                if (checkDoorOpenColor2.style.color == "green") {
                    checkDoorOpenColor2.style.color = "red";
                    lock2.className = "fa fa-lock";
                }
            }
        };
        xhr3.onload = () => {
            const data3 = JSON.parse(xhr3.responseText);
            const checkSuccess = JSON.stringify(data3.success);
            if (checkSuccess === 'true'){
                checkStatusID.style.color = 'green';
            }else{
                checkStatusID.style.color = 'red';
            }
        }
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr.send();
        xhr2.open("GET", url);
        xhr2.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr2.send();
        xhr3.open("GET", urlCheck2N);
        xhr3.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr3.send();
    }, 100);
    function getLog() {
        if (count == 1) {
            count = 0;
            const xhr4 = new XMLHttpRequest();
            xhr4.onload = () => {
                const data4 = JSON.parse(xhr4.responseText);
                const data4Length = Object.keys(data4.result.events).length;
                for (var i=0;i<data4Length;i++){
                    log.info(data4.result.events[i].event,":",data4.result.events[i].params.state);
                    if (i == data4Length-2){
                        log.info(data4.result.events[i].event,":",data4.result.events[i].params.state,'\n');
                        break;
                    }
                }
            }
            xhr4.open("GET", url2);
            xhr4.setRequestHeader('Authorization', 'Basic ' + b64);
            xhr4.send();
        }
    }
};
function getUrlLog() {
    if (count2 == 1) {
        count2 = 0;
        const xhr3 = new XMLHttpRequest();
        xhr3.onload = () => {
            const data3 = JSON.parse(xhr3.response);
            id = JSON.stringify(data3.result.id);
            url2 = "https://192.168.33.10/api/log/pull?id=" + id;
        }
        xhr3.open("GET", url);
        xhr3.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr3.send();
    }
}
function focusInput() {
    document.getElementById("input_value").focus();
}
function doorLockCheck() {
    if (checkDoorLock == 'locked') doorUnlock();
    else doorLock();
}
function doorLock() {
    const url = "https://192.168.33.10/api/switch/ctrl?switch=1&action=lock";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send();
}
function doorUnlock() {
    const url = "https://192.168.33.10/api/switch/ctrl?switch=1&action=unlock";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send();
}
const input = document.getElementById('input_value');
input.addEventListener('change', openDoor2);
function openDoor2() {
    if (input.value === '2730616') {
        //deur openen voor 3 seconden
        const url = "https://192.168.33.10/api/switch/ctrl?switch=1&action=trigger";
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr.send();
        input.value = '';
    } else {
        alert('test');
        input.value = '';
    }
}
function logout() {
    //uitloggen en terug naar login pagina.
    sessionStorage.clear();
    window.location.replace('index.html?#');
}
function tijdBeginHkeydown() { document.getElementById("tijdBeginH").style.border = ""; }
function tijdEindeHkeydown() { document.getElementById("tijdEindeH").style.border = ""; }
function tijdBeginMkeydown() { document.getElementById("tijdBeginM").style.border = ""; }
function tijdEindeMkeydown() { document.getElementById("tijdEindeM").style.border = ""; }
function maandklik() { document.getElementById("maand").style.border = ""; }
function dagklik() { document.getElementById("dag").style.border = ""; }
function jaarklik() { document.getElementById("jaar").style.border = ""; }
function naamkeydown() { document.getElementById("naam").style.border = ""; }
function emailkeydown() { document.getElementById("email").style.border = ""; }
function create() {
    //user toevoegen.
    const tijdBeginH = document.getElementById("tijdBeginH").value;
    const tijdBeginM = document.getElementById("tijdBeginM").value;
    const tijdEindeH = document.getElementById("tijdEindeH").value;
    const tijdEindeM = document.getElementById("tijdEindeM").value;
    const tijdBeginSeconds = (+tijdBeginH) * 60 * 60 + (+tijdBeginM) * 60;
    const tijdEindeSeconds = (+tijdEindeH) * 60 * 60 + (+tijdEindeM) * 60;
    let jaar = document.getElementById("jaar").value;
    let maand = document.getElementById("maand").value;
    let dag = document.getElementById("dag").value;
    const dagArray = ["1577836800", "86400", "172800", "259200", "345600", "432000", "518400", "604800", "691200", "777600", "864000", "950400", "1036800", "1123200", "1209600", "1296000", "1382400", "1468800", "1555200", "1641600", "1728000", "1814400", "1900800", "1987200", "2073600", "2160000", "2246400", "2332800", "2419200", "2505600", "2592000"];
    const maandArray = ["1577836800", "2667606", "5173212", "7851618", "10443624", "13122030", "15714036", "18392402", "21070848", "23662854", "26341200", "28933206"];
    let naam = document.getElementById("naam").value;
    let email = document.getElementById("email").value;
    if (dag === "- Dag -") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("dag").style.border = "2px red solid";
        status = 'fout';
    }
    if (dag !== "- Dag -") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("dag").style.border = "none";
        status = 'goed';
    }
    if (maand === "- Maand -") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("maand").style.border = "2px red solid";
        status = 'fout';
    }
    if (maand !== "- Maand -") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("maand").style.border = "none";
        status = 'goed';
    }
    if (jaar === "- Jaar -") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("jaar").style.border = "2px red solid";
        status = 'fout';
    }
    if (jaar !== "- Jaar -") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("jaar").style.border = "none";
        status = 'goed';
    }
    if (tijdBeginH === "") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("tijdBeginH").style.border = "2px red solid";
        status = 'fout';
    }
    if (tijdEindeH === "") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("tijdEindeH").style.border = "2px red solid";
        status = 'fout';
    }
    if (tijdBeginH !== "") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("tijdBeginH").style.border = "none";
        status = 'goed';
    }
    if (tijdEindeH !== "") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("tijdEindeH").style.border = "none";
        status = 'goed';
    }
    if (tijdBeginM === "") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("tijdBeginM").style.border = "2px red solid";
        status = 'fout';
    }
    if (tijdEindeM === "") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        document.getElementById("tijdEindeM").style.border = "2px red solid";
        status = 'goed';
    }
    if (tijdBeginM !== "") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("tijdBeginM").style.border = "none";
        status = 'goed';
    }
    if (tijdEindeM !== "") {
        document.getElementById("error").innerHTML = "";
        document.getElementById("tijdEindeM").style.border = "none";
        status = 'goed';
    }
    if (jaar === "- Jaar -") {
        document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
        status = 'fout';
    }
    //jaar 2020
    // if (jaar === "2020") {
    //     jaar = "1656210912";
    // }
    //jaar 2021
    //if(jaar === "2021")jaar = "1609383600";
    //jaar 2022
    if (jaar === "2022") {
        jaar = "1640919600";//1640919600.1672455600
    }
    //jaar 2023
    if (jaar === "2023") {
        jaar = "1672455600";
    }
    //jaar 2024
    if (jaar === "2024") {
        jaar = "1704078000";
    }
    //jaar 2025
    // if (jaar === "2025") {
    //     jaar = "1704075408";
    // }
    if (maand === "- Maand -") {
        maand = "";
    }
    if (maand === "Januari(1)") {
        jaar = maandArray[0];
        maand = "";
    }
    if (maand === "Februari(2)") if (dag === "30" || dag === "31") {
        document.getElementById("errorDag").innerHTML = "Voer een geldige dag in!";
        document.getElementById("dag").style.border = "2px red solid";
    } else {
        maand = maandArray[1];
    }
    if (maand === "Maart(3)") {
        maand = maandArray[2];
    }
    if (maand === "April(4)") {
        maand = maandArray[3];
    }
    if (maand === "Mei(5)") {
        maand = maandArray[4];
    }
    if (maand === "Juni(6)") {
        maand = maandArray[5];
    }
    if (maand === "Juli(7)") {
        maand = maandArray[6];
    }
    if (maand === "Augustus(8)") {
        maand = maandArray[7];
    }
    if (maand === "September(9)") {
        maand = maandArray[8];
    }
    if (maand === "Oktober(10)") {
        maand = maandArray[9];
    }
    if (maand === "November(11)") {
        maand = maandArray[10];
    }
    if (maand === "December(12)") {
        maand = maandArray[11];
    }
    if (dag === "- Dag -") {
        dag = "";
    } else {
        dag = dagArray[dag - 1];
    }
    let beginDatum = +maand + +dag + +jaar + +tijdBeginSeconds;
    let eindDatum = +maand + +dag + +jaar + +tijdEindeSeconds;
    if (isNaN(beginDatum)) {
        console.log("Error, geen begin datum");
    } else {
        console.log(beginDatum);
    }
    if (isNaN(eindDatum)) {
        console.log("Error, geen eind datum");
    } else {
        console.log(eindDatum);
    }
    if (naam === '' || email === '') {
        if (naam === '') {
            document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
            document.getElementById("naam").style.border = "2px red solid";
            status = 'fout';
        }
        if (naam !== '') {
            document.getElementById("error").innerHTML = "";
            document.getElementById("naam").style.border = "none";
            status = 'goed';
        }
        if (email === '') {
            document.getElementById("error").innerHTML = "U heeft niet alles goed ingevuld!";
            document.getElementById("email").style.border = "2px red solid";
            status = 'fout';
        }
        if (email !== '') {
            document.getElementById("error").innerHTML = "";
            document.getElementById("email").style.border = "none";
            status = 'goed';
        }
    } else {
        if (status === 'goed') {
            let cijfer1 = Math.floor(Math.random() * 9) + 1;
            let cijfer2 = Math.floor(Math.random() * 9) + 1;
            let cijfer3 = Math.floor(Math.random() * 9) + 1;
            let cijfer4 = Math.floor(Math.random() * 9) + 1;
            let cijfer5 = Math.floor(Math.random() * 9) + 1;
            let cijfer6 = Math.floor(Math.random() * 9) + 1;
            let code = `${cijfer1}${cijfer2}${cijfer3}${cijfer4}${cijfer5}${cijfer6}`;

            document.getElementById("naam").style.border = "none";
            document.getElementById("email").style.border = "none";
            const toSend = {
                users: [
                    {
                        uuid: '',
                        owner: "My2N",
                        name: naam,
                        email: email,
                        access: {
                            validFrom: beginDatum,
                            validTo: eindDatum,
                            pin: code
                        }
                    }
                ]
            };
            const url = "https://192.168.33.10/api/dir/create";
            const jsonString = JSON.stringify(toSend);
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                console.log(`response = `, data);
            }

            xhr.open("PUT", url);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Basic ' + b64);
            xhr.send(jsonString);
            document.getElementById("naam").value = "";
            document.getElementById("email").value = "";
            document.getElementById("form").innerHTML = "Persoon is toegevoegd";
            setTimeout(function () {
                document.getElementById("form").innerHTML = "";
            }, 5000);
            document.getElementById("naamTxt").innerHTML = "Naam: " + naam;
            document.getElementById("emailTxt").innerHTML = "Email: " + email;
            document.getElementById("codeTxt").innerHTML = "Code: " + code;
            setTimeout(function () {
                document.getElementById("naamTxt").innerHTML = "";
                document.getElementById("emailTxt").innerHTML = "";
                document.getElementById("codeTxt").innerHTML = "";
            }, 5000);
        }
    }
}
function deleteUsers() {
    //alle users verwijderen
    document.getElementById("naam").style.border = "none";
    document.getElementById("email").style.border = "none";
    document.getElementById("dag").style.border = "none";
    document.getElementById("maand").style.border = "none";
    document.getElementById("jaar").style.border = "none";
    document.getElementById("tijdBeginH").style.border = "";
    document.getElementById("tijdBeginM").style.border = "";
    document.getElementById("tijdEindeH").style.border = "";
    document.getElementById("tijdEindeM").style.border = "";
    document.getElementById("check_delete").style.display = 'block';
    const check_ja = document.getElementById('check_ja');
    const check_nee = document.getElementById('check_nee');

    check_ja.addEventListener('click', function handleClick() {
        document.getElementById("check_delete").style.display = 'none';
        document.getElementById("error").innerHTML = "";
        // Hier staat eigenlijk dat je alle users met de owner 'My2N' pakt en daarna verwijdert
        const toSend = {
            owner: "My2N"
        };
        // Dit is de api om de users te verwijderen
        const url = "https://192.168.33.10/api/dir/delete";
        const jsonString = JSON.stringify(toSend);
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr.send(jsonString);
        document.getElementById("deleteMSG").innerHTML = "Alle users zijn verwijdert";
        setTimeout(function () {
            document.getElementById("deleteMSG").innerHTML = "";
        }, 2500)
    });
    check_nee.addEventListener('click', function handleClick() {
        document.getElementById("check_delete").style.display = 'none';
    });
}

function noodOpen() {
    //nood deur openen.
    if (response2 == 'false') {
        const url = "https://192.168.33.10/api/switch/ctrl?switch=2&action=on";
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr.send();
    } else {
        noodDicht();
    }
}
function noodDicht() {
    //nood deur dicht doen
    const url = "https://192.168.33.10/api/switch/ctrl?switch=2&action=off";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send();
}
function deviceInfo() {
    //info over je device
    let e = document.getElementById("box");
    let reset = document.getElementById("reset");
    document.getElementById("box").innerHTML = "<iframe class='info' src='https://192.168.33.10/api/system/info'></iframe>";
    if (e.style.display === 'block') {
        e.style.display = 'none';
        reset.style.display = 'none';
    }
    else {
        e.style.display = 'block';
        reset.style.display = 'inline-block';
    }
}
function reset() {
    document.getElementById("box").innerHTML = "<iframe class='info' src='https://192.168.33.10/api/system/info'></iframe>";
}
function openDoor() {
    //deur openen voor 3 seconden
    getUrlLog();
    if (response == 'false') {
        const url = "https://192.168.33.10/api/switch/ctrl?switch=1&action=trigger";
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', 'Basic ' + b64);
        xhr.send();
    }
}
function deviceRestart() {
    // Het device opnieuw opstarten
    const url = "https://192.168.33.10/api/system/restart";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send();
    document.getElementById("text3").innerHTML = "Uw device is opnieuw opgestart";
    setTimeout(function () {
        document.getElementById("text3").innerHTML = "";
    }, 3000)
}
// Met deze function zoek je alle users op en krijgt dan een JSON response terug met alle users.
function searchUserName() {
    const url = "https://192.168.33.10/api/dir/query";
    const xhr = new XMLHttpRequest();
    const toSend = {
        "series": "2966931592397881469",
        "fields": [
            "name",
            "email",
            "callPos.peer",
            "callPos[1].grouped"
        ],
        "iterator": { "timestamp": 6 }
    };
    const jsonString = JSON.stringify(toSend);//2966931592397881469
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        var test = Object.keys(data.result.users).length;
        for (i = 0; i < test; i++) {
            response3 = JSON.stringify(data.result.users[i].name);
            response4 = JSON.stringify(data.result.users[i].uuid);
            array1.push(response3);
            array2.push(response4);
        }
        var test = array1.findIndex(checkUser);
        var splitUuid = array2[test];
        if (splitUuid != undefined) {
            userUuid = splitUuid.replace(/"/g, '');
            returnUserInfo();
            document.getElementById('noUser').innerHTML = '';
        } else {
            nameOutput.innerHTML = '';
            emailOutput.innerHTML = '';
            pinOutput.innerHTML = '';
            dateStartOutput.innerHTML = '';
            dateEndOutput.innerHTML = '';
            document.getElementById('noUser').innerHTML = 'Gebruiker ' + document.getElementById('name').value + ' bestaat niet!';
        }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send(jsonString);
}
function checkUser(user) {
    return user == '"' + document.getElementById("name").value + '"';
}
function deleteSearchUser() {
    document.getElementById('deleteUser').addEventListener('click', function handleClick() {
        if (userUuid == undefined) {
            console.log('No uuid!');
        } else {
            const toSend = {
                "users": [
                    { "uuid": userUuid }
                ]
            };
            const url = "https://192.168.33.10/api/dir/delete";
            const jsonString = JSON.stringify(toSend);
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                console.log(`response = `, data);
            }
            xhr.open("PUT", url);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Basic ' + b64);
            xhr.send(jsonString);
            nameOutput.innerHTML = '';
            emailOutput.innerHTML = '';
            pinOutput.innerHTML = '';
            dateStartOutput.innerHTML = '';
            dateEndOutput.innerHTML = '';
        }
    });
}
function returnUserInfo() {
    let name,
        email,
        pin,
        dateStart,
        dateEnd;
    const url = "https://192.168.33.10/api/dir/get";
    const xhr = new XMLHttpRequest();
    const toSend = {
        "fields": [
            "name",
            "email",
            "access",
            "callPos.peer",
            "callPos[1].grouped"
        ],
        "users": [
            { "uuid": userUuid }
        ]
    };
    const jsonString = JSON.stringify(toSend);
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        name = data.result.users[0].name;
        email = data.result.users[0].email;
        pin = data.result.users[0].access.pin;

        var date1 = new Date(data.result.users[0].access.validFrom * 1000);
        var date2 = new Date(data.result.users[0].access.validTo * 1000);

        date1.setMonth(date1.getMonth() + 1);
        date2.setMonth(date2.getMonth() + 1);

        if (date1.getFullYear() == 2024) date1.setHours(date1.getHours() - 1);
        if (date2.getFullYear() == 2024) date2.setHours(date2.getHours() - 1);
        if (date1.getFullYear() == 2022) date1.setHours(date1.getHours() - 1);
        if (date2.getFullYear() == 2022) date2.setHours(date2.getHours() - 1);
        if (date1.getFullYear() == 2023) date1.setHours(date1.getHours() - 2);
        else date1.setHours(date1.getHours() - 1);
        if (date2.getFullYear() == 2023) date2.setHours(date2.getHours() - 2);
        else date2.setHours(date2.getHours() - 1);

        dateStart = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear() + ' / ' + date1.getHours() + ':' + date1.getMinutes();
        dateEnd = date2.getDate() + '-' + date2.getMonth() + '-' + date2.getFullYear() + ' / ' + date2.getHours() + ':' + date2.getMinutes();
        nameOutput.innerHTML = 'Naam: ' + name;
        emailOutput.innerHTML = 'Email: ' + email;
        pinOutput.innerHTML = 'Pin: ' + pin;
        dateStartOutput.innerHTML = 'Start datum: ' + dateStart;
        dateEndOutput.innerHTML = 'Eind datum: ' + dateEnd;
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send(jsonString);
}
function image(){
    const url = "https://192.168.33.10/api/display/image?display=ext2";
    const xhr = new XMLHttpRequest();
    const toSend = {
        "blob-video" : "blob:https://www.youtube.com/81b0ed39-30b1-45c0-8e5a-ab64518fc1df"
    };
    const jsonString = JSON.stringify(toSend);
    xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
    }
    xhr.open("PUT", url);
    xhr.setRequestHeader('Content-type', 'application/json');
    // xhr.setRequestHeader('Content-Disposition', 'form-data; name="blob-image"; filename="x-cube.jpg"');
    xhr.setRequestHeader('Authorization', 'Basic ' + b64);
    xhr.send();     
}