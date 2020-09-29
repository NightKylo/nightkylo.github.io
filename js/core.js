/*
    core.js
    handling of functions, used often, and/or are very important
    Copyright © 2020 Marius Kraus (NightKylo)
*/ 

document.onkeydown = key_check;

const help_url = 'https://nightkylo.github.io/help';
const reset_time = 2500;
var last_key_was_cmd = false;
var index = -1;
var next_reset = 0;
var paint_objects = [];
const colors = [
    'linear-gradient(0deg, #004BFA 0%, #00123B 100%)', //Blau
    'linear-gradient(0deg, #8000FF 0%, #200040 100%)', //Lila
    'linear-gradient(0deg, #F8A255 0%, #E14B56 100%)', //Gelb-Orange
    'linear-gradient(0deg, #28F7D1 0%, #32ADF0 100%)', //Hellblau
    'linear-gradient(0deg, #00CC7E 0%, #0DFCE4 100%)', //Grün
    'linear-gradient(0deg, #222559 0%, #F2293A 100%)', //Rot-Blau
    'linear-gradient(0deg, #000000 0%, #FF0000 100%)'  //Schwarz-Rot
]

//Design overwritings
window.addEventListener('load', function(){
    if(!checkcookie('background')){
        setcookie('background', '-1', 365);
    }
    else{
        var color_index = readcookie('background');
        index = color_index;
        //console.log(color_index);
        draw_background(color_index, false);
    }
    setInterval(update_style, 100);

    //This function checks if copying or pasting is possible (it times up, when the cmd button has to be clicked again)
    setInterval(function(){
        var utc = Date.now();
        //console.log(utc);
        if(utc >= next_reset && next_reset != 0){
            //console.log('Resetted Values');
            last_key_was_cmd = false;
            next_reset = 0;
        }
    }, 20);
});

//Copy-Button Logic
if(document.title == 'Calculator++ | Home'){
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
}
//Help-Button Logic
document.getElementById('help_button').addEventListener('click', function(){
    window.location.href = help_url;
});

function copyToClipboard(){
    output = output_field.innerHTML;
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
            navigator.clipboard.writeText(result)
            return;
        }
    }

    navigator.clipboard.writeText(output)
}

function pasteClipboard(){
    navigator.clipboard.readText().then(function(text){
        write(text);
    });

    function write(text){
        if(document.title == 'Calculator++ | Home'){
            if(text != ''){
                if(window.innerWidth > 425){
                    document.getElementById('copy_button').style.marginTop = "-61px";
                    document.getElementById('buttonc').style.marginTop = "-59px";
                }
                else{
                    document.getElementById('buttonc').style.marginTop = "-59px";
                }
                document.getElementById('output').innerHTML += text;
            }
        }
    }
}

function setcookie(name, content, expiredate, print=true){
    var d = new Date();
    d.setTime(d.getTime() + (expiredate * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + content + ";" + expires + ";path=/";
    if(print == true){
        console.log('Created cookie "' + name + '" with the value "' + content + '"');
    }
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
    var cookie = readcookie(name);
    if (cookie != ""){
        return true;
    }else {
        return false;
    }
}

function key_check(key){
    if(key.code == 'ControlLeft' || key.code == 'ControlRight'){
        last_key_was_cmd = true;
        next_reset = Date.now() + reset_time;
    }

    if(key.code == 'KeyC'){
        if(last_key_was_cmd == false){
            return;
        }
        copyToClipboard();
    }

    if(key.code == 'KeyV'){
        if(last_key_was_cmd == true){
            pasteClipboard();
        }
    }

    if(key.code == 'KeyB'){
        if(last_key_was_cmd == true){
            if(index == colors.length - 1){
                index = -1;
            }
            else{
                index++;
            }
            draw_background(index);
        }
    }

    if(document.title == 'Calculator++ | Home'){
        nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
        if(key.code == 'NumpadEnter' || key.code == 'Enter'){
            output = output_field.innerHTML;
        
            if(output == ''){
                return;
            }

            for(i = 0; i < output.length; i++){
                if(output.charAt(i) == '='){
                    return;
                }
            }
            counter = 0;
            calculation = output_field.innerHTML;
        
            list = [];
        
        
            for (i = 0; i < calculation.length; i++) {
                if(calculation.charAt(i) != ' '){
                    list[counter] = calculation.charAt(i);
                    counter++;
                }
            }
        
            for (i = 0; i < calculation.length; i++) {
                if(calculation.charAt(i) == '/' || calculation.charAt(i) == '<' || calculation.charAt(i) == '(' || calculation.charAt(i) == 's' || calculation.charAt(i) == '?'){
                    rewrite('You are offically the worst hacker visited this site ever! Train your skills, when you want to hack websites!');
                    return;
                }
            }
        
            calculate(list.join(''));
        }

        if(key.code == 'Backspace' || key.code == 'Delete'){
            rewrite('');
            if(window.innerWidth > 425){
                document.getElementById('copy_button').style.marginTop = "-37px";
                document.getElementById('buttonc').style.marginTop = "-35px";
            }
            else{
                document.getElementById('buttonc').style.marginTop = "-35px";
            }
            return;
        }
        
        for(i = 0; i < key.code.length; i++){
            if(key.code.charAt(i) == 'F'){
                break;
            }
            for(a = 0; a < nums.length; a++){
                if(key.code.charAt(i) == nums[a]){
                    enter(a);
                    return;
                }
            }
        }

        if(key.code == 'NumpadAdd'){
            enter(' + ');
        }
        else if(key.code == 'NumpadSubtract'){
            enter(' - ');
        }
        else if(key.code == 'NumpadMultiply'){
            enter(' × ');
        }
        else if(key.code == 'NumpadDivide'){
            enter(' ÷ ');
        }
    }
}

function draw_background(b, save_in_cookies=true, print=false){

    paint_objects.length = 0;
    paint_objects.push(document.getElementsByTagName('main')[0]);
    for(i = 0; i < document.getElementsByClassName('bg-circle').length; i++){
        paint_objects.push(document.getElementsByClassName('bg-circle')[i]);
    }
    for(i = 0; i < paint_objects.length; i++){
        if(b == -1){
            paint_objects[i].style.background = 'linear-gradient(0deg, #FF6A00 0%, #EE0979 100%)';
        }
        paint_objects[i].style.background = colors[b];
    }

    if(save_in_cookies == true){
        if(print == true){
            setcookie('background', b, 365);
        }
        else{
            setcookie('background', b, 365, false);
        }
    }
}

function update_style(){
    if(document.title == 'Calculator++ | Help'){
        if(window.innerWidth >= 425){
            document.getElementsByTagName('main')[0].style.paddingBottom = '6rem';
            document.getElementsByTagName('main')[0].style.paddingTop = 'calc(9rem - 8px)';
        }
        else{
            document.getElementsByTagName('main')[0].style.paddingTop = '45px';
            document.getElementsByTagName('main')[0].style.paddingBottom = '0';
            var border_divs = document.getElementsByClassName('border_div');
            for(i = 0; i < border_divs.length; i++){
                border_divs[i].style.marginTop = '-130px';
            }
            var imgs = document.getElementsByClassName('entry_img');
            for(i = 0; i < imgs.length; i++){
                imgs[i].style.width = '350px';
                imgs[i].style.height = '130px';
                imgs[i].style.marginTopLeft = '-225px';
            }
            var lis = document.getElementsByClassName('help_li');
            for(i = 0; i < lis.length; i++){
                lis[i].style.width = '350px';
                lis[i].style.margin = '2.5rem auto 2.5rem -29px';
            }
            var texts = document.getElementsByClassName('help_text');
            for(i = 0; i < texts.length; i++){
                texts[i].style.padding = '5px';
                texts[i].style.margin = '0.25rem 0 0.25rem -1px';
                texts[i].style.width = '340px';
            }
        }
    }
}