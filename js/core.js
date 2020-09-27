/*
    core.js
    handling of functions, used often
*/ 

help_url = 'https://nightkylo.github.io/help'

window.addEventListener('load', function(){
    setcookie('Username', 'Night Kylo', 365);
});

document.getElementById('copy_button').addEventListener('click', function(){
    output = document.getElementById('output').innerHTML;
    list = [];

    if(output.lengt == 0){
        return;
    }

    for(i = 0; i < output.length; i++){
        if(output.charAt(i) != ' '){
            list.push(output.charAt(i));
        }
    }

    output = list.join('');

    for(i = 0; i < output.length; i++){
        if(output.charAt(i) == '='){
            result = output.split('=', 2)[1];
            //console.log(result);
            copyToClipboard(result);
            return;
        }
    }

    copyToClipboard(output);
});

document.getElementById('help_button').addEventListener('click', function(){
    window.location.href = help_url;
});

function copyToClipboard(str){
    navigator.clipboard.writeText(str)
}

function getClipboardContent(){
    navigator.clipboard.readText().then(function(text){
        write(text);
    });

    function write(text){
        if(text != ''){
            document.getElementById('copy_button').style.marginTop = "-61px";
            document.getElementById('output').innerHTML += text;
        }
    }
}

function setcookie(name, content, expiredate){
    var d = new Date();
    d.setTime(d.getTime() + (expiredate * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + content + ";" + expires + ";path=/";
    console.log('Created cookie ' + name + ' with the value ' + content);
}

function readcookie(name){
    var cookiename = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cookiename) == 0){
            return c.substring(cookiename.length, c.length);
        }
    }
    return "";
}

function checkcookie(name){
    var cookie = getCookie(name);
    if (cookie != ""){
        return true;
    }else {
        return false;
    }
}