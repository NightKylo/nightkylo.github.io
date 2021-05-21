document.getElementById("upload").onchange = loadFile;

function loadFile(event) {
    var file, img;
    if ((file = this.files[0])) {
        img = new Image();
        var objectUrl = URL.createObjectURL(file);
        img.onload = function () {
            console.log(this.width + " " + this.height);
            if(this.width != this.height)
                alert("Non squared shape");
            document.getElementsByClassName("img")[0].src = objectUrl;
            document.getElementsByClassName("img")[0].style.display = "block";
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    }
}
