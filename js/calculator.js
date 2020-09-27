/*
    calculator.js
    Default calculator handling
*/

output_field = document.getElementById('output');
document.onkeydown = handle_keypress;

window.addEventListener('load', function(){
    console.log('Window loaded');
    console.log('');

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
    enter('000');
});;
document.getElementById('button.').addEventListener('click', function(){
    enter('.');
});
document.getElementById('buttonc').addEventListener('click', function(){
    rewrite('');
    document.getElementById('copy_button').style.marginTop = "-37px";
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
});

function calculate(calculation){
    calculate_signs = ['+', '-', '×', '÷', '='];
    input_chars = [];
    signs = [];
    add = [];
    nums = [];
    line_signs = [];
    new_nums = [];
    index = -1;
    result = 0;
    a = 0;
    c = 0;
    last_result = 0;

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
        result = nums[0];
        console.log('"result":"' + result + '"');
        write(' = ' + result);
        return;
    }
    
    /*Debug messages
    console.log('Input_chars: ' + input_chars);
    console.log('Signs: ' + signs);
    console.log('Numbers: ' + nums);
    */

    //The result is calculated here
    if(!calculation.includes('×') && !calculation.includes('÷')){
        for(i = 0; i < signs.length; i++){
            //console.log(signs[i])
            if(signs[i] == '+'){
                if(i == 0){
                    result = parseFloat(nums[i], 10) + parseFloat(nums[i + 1], 10);
                }
                else{
                    result += parseFloat(nums[i + 1], 10);
                }
            }
            else{
                if(i == 0){
                    result = parseFloat(nums[i], 10) - parseFloat(nums[i + 1], 10);
                }
                else{
                    result -= parseFloat(nums[i + 1], 10);
                }
            }
        }
    }
    else if(!calculation.includes('+') && !calculation.includes('-')){
        for(i = 0; i < signs.length; i++){
            //console.log(signs[i])
            if(signs[i] == '×'){
                if(i == 0){
                    result = parseFloat(nums[i], 10) * parseFloat(nums[i + 1], 10);
                }
                else{
                    result *= parseFloat(nums[i + 1], 10);
                }
            }
            else{
                if(i == 0){
                    result = parseFloat(nums[i], 10) / parseFloat(nums[i + 1], 10);
                }
                else{
                    result /= parseFloat(nums[i + 1], 10);
                }
            }
        }
    }
    else{
        for(i = 0; i < signs.length; i++){
            if(signs[i] != '×' && signs[i] != '÷'){
                line_signs.push(signs[i]);
            }
        }

        //console.log('Nums: ' + nums);
        //console.log('Signs: ' + signs);

        for(i = 0; i < signs.length; i++){
            if(signs[i] == '×'){
                if(a == 0){
                    last_result = parseFloat(nums[i]) * parseFloat(nums[i + 1])
                    new_nums.push(last_result);
                    //console.log('Pushed succesfully');
                }
                else{
                    index = new_nums.findIndex(function(value){ return value == last_result; });
                    if(index != -1){
                        new_nums[index] = last_result * parseFloat(nums[i + 1], 10);
                        last_result *= parseFloat(nums[i + 1], 10);
                    }
                    else{
                        //console.error('Error, index of ' + last_result + ' not found');
                    }
                }
                a++;
                //console.log('New Nums: ' + new_nums);
            }
            else if(signs[i] == '÷'){
                if(a == 0){
                    last_result = parseFloat(nums[i]) / parseFloat(nums[i + 1])
                    new_nums.push(last_result);
                    //console.log('Pushed succesfully');
                }
                else{
                    index = new_nums.findIndex(function(value){ return value == last_result; });
                    if(index != -1){
                        new_nums[index] = last_result / parseFloat(nums[i + 1], 10);
                        last_result /= parseFloat(nums[i + 1], 10);
                    }
                    else{
                        //console.error('Error, index of ' + last_result + ' not found');
                    }
                }
                a++;
                //console.log('New Nums: ' + new_nums);
            }
            else{
                c++;
                l = i + c

                if(nums[l] == null){
                    for(b = 0; b < nums.length; b++){
                        l = b;
                    }
                }

                //console.log('Push index: ' + l);
                new_nums.push(parseFloat(nums[l]));
            }
            index = -1;
        }
        
        //console.log('Nums: ' + nums);
        //console.log('Final_new_nums: ' + new_nums);
        //console.log('Final line_signs: ' + line_signs);

        for(i = 0; i < line_signs.length; i++){
            if(line_signs[i] == '+'){
                if(i == 0){
                    result = new_nums[i] + new_nums[i + 1];
                }
                else{
                    result += new_nums[i + 1];
                }
            }
            else{
                if(i == 0){
                    result = new_nums[i] - new_nums[i + 1];
                }
                else{
                    result -= new_nums[i + 1];
                }
            }
        }
    }

    console.log('"result":"' + result + '"');
    write(' = ' + result);
}

function enter(content){
    output = output_field.innerHTML;
    list = [];
    counter = 0;

    document.getElementById('copy_button').style.marginTop = "-61px";

    //Removing all whiespaces from the string
    for (i = 0; i < output.length; i++) {
        if(output.charAt(i) != ' '){
            list[counter] = output.charAt(i);
            counter++;
        }
    }

    //Searching a result entered before
    for(i = 0; i < output.length; i++){
        if(output.charAt(i) == '='){
            start_number = '';
            for(a = i + 2; a < output.length; a++){
                start_number += output[a];
            }
            
            if(start_number != 'Nan'){
                rewrite(start_number);
            }
            else{
                rewrite('');
            }
            break;
        }
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
    
        calculate(list.join(''));
    }

    if(key.code == 'Backspace' || key.code == 'Delete'){
        rewrite('');
        document.getElementById('copy_button').style.marginTop = "-37px";
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
        getClipboardContent();
    }

    for(i = 0; i < key.code.length; i++){
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

function write(content){
    output_field.innerHTML += content;
}

function rewrite(content){
    output_field.innerHTML = content;
}