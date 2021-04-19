const api = "http://192.168.178.58/api";
const types = ["None.svg", "Discord.svg", "WhatsApp.png"];
const usernameField = document.getElementsByName("username")[0];
const passwordField = document.getElementsByName("password")[0];
const tokenField = document.getElementsByName("token")[0];
const uidField = document.getElementsByName("uid")[0];

// Removes the get parameters from the url
function ReplaceGetParameters(keys=[]) {
    const url = new URL(window.location.href);

    if(!url.href.includes("?"))
        return;

    history.replaceState({}, document.title, url.href.split("?")[0]);
}

// Sets the token
function SetToken() {
    var token = GetParameters(window.location.search.substr(1));
    ReplaceGetParameters(["token"]);
    if(token != undefined)
        tokenField.value = token["token"];
}

// The default error raising function
function DefaultError(status) {
    alert("An error with HTTP status-code \"" + status + "\" occured.");
}

// Parses the api response into a dictionary and calls a callback
function ParseApiResponse(promise, success, error=DefaultError) {
    promise.then(function(resp) {
        if(resp.status != 200)
        {
            error(resp.status);
            return Promise.reject(resp);
        }
        return resp.text();
    }).then(function(text) {
        if(!text.includes("="))
            success({});
        success(GetParameters(text));
    }).catch(function() {});
}

// Logs in with the credentials of the user
function Login(response) {
    if(response instanceof PointerEvent) {
        //console.log(usernameField.value + ", " + passwordField.value + ", " + tokenField.value);

        ParseApiResponse(
            fetch(api + "/login", {
                method: "POST",
                body: "username=" + usernameField.value + "&password=" + passwordField.value
            }),
            Login,
            function(status) {
                if(status == 400) 
                    alert("Wrong password or wrong username");
                else
                    DefaultError(status);
            }
        );


        /* Test 
        ParseApiResponse(
            Promise.resolve(new Test("uid=123456789", 200)),
            Login,
            function(status) {
                if(status == 400) 
                    alert("Wrong password or wrong username");
                else
                    DefaultError(status);
            }
        );*/
        return;
    }
    uidField.value = response["uid"];
    passwordField.value = "";
    SetValues();
}

// Sets the values of the second box
function SetValues(response) {
    if(response == undefined) {
        ParseApiResponse(
            fetch(api + "/auth?token="+ document.getElementsByName("token")[0].value + "&uid=" + uidField.value, {
                method: "GET"
            }),
            SetValues
        );
        
        /* Test 
        ParseApiResponse(
            Promise.resolve(new Test("user=cracksii#5639&type=1", 200)),
            SetValues
        );*/
        return;
    }
    document.getElementsByClassName("icon")[0].src = "icons/" + types[response["type"]];
    document.getElementsByClassName("authUser")[0].innerHTML = response["user"];
    document.getElementsByClassName("authUser")[1].innerHTML = usernameField.value;
    document.getElementsByClassName("loginButton")[0].parentElement.classList.add("hidden");
    document.getElementsByClassName("authButton")[0].parentElement.classList.remove("hidden");
}

// Authenticates the two users
function Authenticate(response) {
    if(response instanceof PointerEvent) {
        ParseApiResponse(
            fetch(api + "/auth", {
                method: "POST",
                body: "uid=" + uidField.value + "&token=" + tokenField.value
            }), 
            Authenticate
        );

        /* Test 
        ParseApiResponse(
            Promise.resolve(new Test("succeeded=true", 200)),
            Authenticate
        )*/
        return;    
    }

    if(response["succeeded"] == "true")
    {
        document.getElementsByClassName("imgContainer")[0].parentElement.classList.add("hidden");
        document.getElementsByClassName("resultText")[0].parentElement.classList.remove("hidden");
    }
    else
        DefaultError(400);
}

// Gets all get parameters
function GetParameters(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for(var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

// A class for testing without an api
class Test {
    constructor(info, status){
        this.info = info;
        this.status = status;
    }

    text() {
        return this.info;
    }
}

document.getElementsByClassName("loginButton")[0].addEventListener("click", Login);
document.getElementsByClassName("authButton")[0].addEventListener("click", Authenticate);
SetToken();
