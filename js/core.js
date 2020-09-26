/*
    core.js
    handling of functions, used often
*/ 
help_url = 'https://nightkylo.github.io/help'

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
    //console.log('Copyed: ' + str + ' to the clipboard');
    element = document.createElement('textarea');
    element.value = str;
    element.setAttribute('readonly', '');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
}