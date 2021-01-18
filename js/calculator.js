/*
    /js/calculator.js
    JavaScript calculator
    Copyright © M. Kraus (NightKylo)
*/

const output_field = document.getElementById('output');
document.onkeydown = handle_keypress;

window.addEventListener('load', function(){
    console.log('Window loaded');
    console.log(' ');

    if(window.innerWidth <= 425){
        document.getElementById('copy_button').className = 'unselectable invisible';
    }

    if(window.innerWidth >= 1850){
        console.log('updated');
        document.getElementById('help_button').style.float = 'none';
        document.getElementById('help_button').style.setProperty('margin-left', '-1500px', 'important');
    }
});

document.getElementById('button0').addEventListener('click', function(){
    enter('0');
});
document.getElementById('button1').addEventListener('click', function(){
    enter('1');
});
document.getElementById('button2').addEventListener('click', function(){
    enter('2');
});
document.getElementById('button3').addEventListener('click', function(){
    enter('3');
});
document.getElementById('button4').addEventListener('click', function(){
    enter('4');
});
document.getElementById('button5').addEventListener('click', function(){
    enter('5');
});
document.getElementById('button6').addEventListener('click', function(){
    enter('6');
});
document.getElementById('button7').addEventListener('click', function(){
    enter('7');
});
document.getElementById('button8').addEventListener('click', function(){
    enter('8');
});
document.getElementById('button9').addEventListener('click', function(){
    enter('9');
});

document.getElementById('button1000').addEventListener('click', function(){
    write('000');
});;
document.getElementById('button.').addEventListener('click', function(){
    enter('.');
})
document.getElementById('buttonc').addEventListener('click', function(){
    rewrite('');
    if(window.innerWidth > 425){
        document.getElementById('copy_button').style.marginTop = "-37px";
        document.getElementById('buttonc').style.marginTop = "-35px";
    }
    else{
        document.getElementById('buttonc').style.marginTop = "-35px";
    }
});

document.getElementById('button+').addEventListener('click', function(){
    enter(' + ');
});
document.getElementById('button-').addEventListener('click', function(){
    enter(' - ');
});
document.getElementById('buttonx').addEventListener('click', function(){
    enter(' &times; ');
});
document.getElementById('button/').addEventListener('click', function(){
    enter(' &divide; ');
});;
document.getElementById('button=').addEventListener('click', function(){
    output = output_field.innerHTML;
    
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
    console.log(list.join(''));
    result = calculate(list.join(''));
    console.log('"result":"' + result + '"');
});

function calculate(calculation){
    calculate_signs = ['+', '-', '×', '÷', '='];
    input_chars = [];
    signs = [];
    add = [];
    nums = [];
    result = 0;

    //console.log('');
    //console.log('started calculation: ' + calculation);
    
    //The Array will be filled with empty strings
    for(i = 0; i < calculation.length; i++){
        input_chars[i] = '';
    }
    
    //The numbers will be seperated from the inputs
    for(i = 0; i < calculation.length; i++){
        //console.log(calculation[i])
        if(!calculate_signs.includes(calculation[i])){
            input_chars[i] = calculation[i];
        }
        else{
            //console.log(calculation[i]);
            signs.push(calculation[i]);
        }
    }

    //The numbers are connected to real numbers
    for(i = 0; i < input_chars.length; i++){
        if(input_chars[i] != '' || i == input_chars.length - 1){
            add.push(input_chars[i]);
            //console.log('Current add: ' + add)

            if(i == input_chars.length - 1){
                //console.log('Add: ' + add)
                nums.push(add.join(''));
                add = [];
            }
        }
        else{
            //console.log('Add: ' + add)
            nums.push(add.join(''));
            add = [];
        }
    }

    if(signs.length == 0){
        return;
    }
    
    /*Debug messages
    console.log('Input_chars: ' + input_chars);
    console.log('Signs: ' + signs);
    console.log('Numbers: ' + nums);
    */

    //The result is calculated here
    for(i = 0; i < signs.length; i++){
        //console.log(signs[i])
        if(signs[i] == '+'){
            result = parseFloat(nums[i], 10) + parseFloat(nums[i + 1], 10);
        }
        else if (signs[i] == '-'){
            result = parseFloat(nums[i], 10) - parseFloat(nums[i + 1], 10);
        }
        else if (signs[i] == '×'){
            result = parseFloat(nums[i], 10) * parseFloat(nums[i + 1], 10);
        }
        else if (signs[i] == '÷'){
            result = parseFloat(nums[i], 10) / parseFloat(nums[i + 1], 10);
        }
    }

    rewrite(result);
    return result;
}

function enter(content){
    signs = ['+', '-', '×', '÷'];
    output = output_field.innerHTML;
    list = [];
    counter = 0;
    changed_sign = false;

    if(window.innerWidth > 425){
        document.getElementById('copy_button').style.marginTop = "-61px";
        document.getElementById('buttonc').style.marginTop = "-59px";
    }
    else{
        document.getElementById('buttonc').style.marginTop = "-59px";
    }

    //Removing all whiespaces from the string
    for (i = 0; i < output.length; i++) {
        if(output.charAt(i) != ' '){
            list[counter] = output.charAt(i);
            counter++;
        }
    }

    //Checking if the last sign in the calculation is a sign and if it is, changing it to the new given sign
    //console.log("out:", output, ", con:", content)
    signs.forEach(sign => {
        if(output.charAt(output.length - 2) == sign && content.length == 3){
            // console.log("out:", output, ", con:", content);
            new_output = "";
            for(i = 0; i < output.length; i++){
                if(i < output.length - 3){
                    new_output += output[i];
                }
            }
            rewrite(new_output);
            changed_sign = true;
        }
    });

    // Calculate a result, if the calculation contains a sign
    if(content.length > 1 && !changed_sign){
        signs.forEach(sign => {
            if(list.join('').includes(sign)){
                calculate(list.join(''));
                return
            }
        });
    }
    write(content);
}

function handle_keypress(key){
    nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    //console.log(key.code);
    if(key.code == 'NumpadEnter' || key.code == 'Enter'){
        output = output_field.innerHTML;
    
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
    
        result = calculate(list.join(''));
        console.log('"result":"' + result + '"');
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

    if(key.code == 'KeyC'){
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
                copyToClipboard(result);
                return;
            }
        }

        copyToClipboard(output);
    }

    if(key.code == 'KeyV'){
        output = output_field.innerHTML;
        pasteClipboard();
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

    if(key.code == "Comma" || key.code == "Period"){
        enter('.');
    }
}

function write(content){
    output_field.innerHTML += content;
}

function rewrite(content){
    output_field.innerHTML = content;
}
