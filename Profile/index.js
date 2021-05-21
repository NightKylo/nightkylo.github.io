document.getElementById("upload").onchange = loadFile;

function loadFile () {
    var file, img;
    if (file = this.files[0]) {
        img = new Image();
        var objectUrl = URL.createObjectURL(file);
        img.onload = function () {
            console.log(this.width + " " + this.height);
            if(this.width != this.height)
                alert("The image is not in a squared form. You may experience weird behavoiur. Cut the image to a square to get the most realistic view.");
            for(i = 0; i < document.getElementsByClassName("img").length; i++)
                document.getElementsByClassName("img")[i].src = objectUrl;
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    }
}
