var u = document.getElementsByName("username")[0];

function Do(str) {
    document.getElementsByName("username")[0].value = str;
}

document.getElementsByName("username")[0].value = "b";

Do("a");

console.log(u.value);
console.log(document.getElementsByName("username")[0].value);
