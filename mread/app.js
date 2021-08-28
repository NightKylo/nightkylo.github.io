var entrySide = new Array(document.querySelectorAll(".entry").length);
var maximumSide = new Array(document.querySelectorAll(".entry").length);

const navInteraction = () => {
    const icon = document.querySelector(".icon");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    document.documentElement.style.setProperty('--nav-link-count', navLinks.length);

    icon.addEventListener("click", () => {
        nav.classList.toggle("nav-active");

        navLinks.forEach((link, index) => {
            if(link.style.animation) {
                link.style.animation = "";
            }else {
                link.style.animation = `navLinkFade 0.25s ease forwards ${index / 7 + 0.2}s`;
            }
        });
        icon.classList.toggle("toggled");
    });
};

const slideInteraction = () => {
    const nextIcons = document.querySelectorAll(".next-icon");
    const lastIcons = document.querySelectorAll(".last-icon");
    const entrys = document.querySelectorAll(".entry");

    nextIcons.forEach(icon => {
        icon.addEventListener("click", function click(event) {
            const entry = event.target.parentNode;
            
            for(i = 0; i < entrys.length; i++)
            {
                if(entrys[i] == entry)
                {
                    const imageList = entry.childNodes[3];
                    const jumpSteps = getjumpSteps(imageList);
                    if(jumpSteps == 0)
                    {
                        return;
                    }
                    const textElement = imageList.childNodes[0];
                    // console.log(imageList.childNodes);
                    /* [1 2 3 4 5 6 7 8 9]
                        [1 2 3 4 5 6 7 8 -]
                        [7 8 1 2 3 4 5 6 -]
                        [7 8 1 2 3 4 5 6 9]
                    
                    */
                    imageList.removeChild(imageList.childNodes[imageList.childNodes.length - 1]);

                    for(j = 0; j < jumpSteps * 2; j++)
                    {
                        const node = imageList.childNodes[0];
                        // console.log(node);
                        imageList.removeChild(node);
                        imageList.appendChild(node);
                    }

                    imageList.appendChild(textElement.cloneNode());
                    // console.log(imageList.childNodes);

                    if(entrySide[i] + 1 <= maximumSide[i])
                        entrySide[i]++;
                    else
                        entrySide[i] = 1;
                    entry.childNodes[1].childNodes[3].innerHTML = `${entrySide[i]}/${maximumSide[i]}`;
                    return;
                }
            }
        });
    });

    lastIcons.forEach(icon => {
        icon.addEventListener("click", function click(event) {
            const entry = event.target.parentNode;
            for(i = 0; i < entrys.length; i++)
            {
                if(entrys[i] == entry)
                {
                    const imageList = entry.childNodes[3];
                    const jumpSteps = getjumpSteps(imageList);
                    if(jumpSteps == 0)
                        return;
                    var nodes = new Array(jumpSteps * 2);
                    var c = 0;

                    //console.log(imageList.childNodes);
                    imageList.removeChild(imageList.childNodes[imageList.childNodes.length - 1]);
                    for(j = imageList.childNodes.length - 1; j >= imageList.childNodes.length - jumpSteps * 2; j--)
                    {
                        //console.log(`${j} ${imageList.childNodes.length - jumpSteps * 2}`);
                        nodes[c] = imageList.childNodes[j];
                        //console.log(`${j} ${imageList.childNodes[j]}`);
                        c++;
                    }

                    //console.log(nodes);

                    for(j = 0; j < nodes.length; j++)
                    {
                        imageList.removeChild(nodes[j]);
                        imageList.insertBefore(nodes[j], imageList.childNodes[0]);
                    }
                    imageList.appendChild(nodes[0].cloneNode());
                    
                    //console.log(imageList.childNodes);
                    if(entrySide[i] - 1 > 0)
                        entrySide[i]--;
                    else
                        entrySide[i] = maximumSide[i];
                    
                    entry.childNodes[1].childNodes[3].innerHTML = `${entrySide[i]}/${maximumSide[i]}`;
                    return;
                }
            }
        });
    });

    // loops through each entry and hides the buttons if they are not necessary and set all pages
    var i = 0;
    entrys.forEach(entry => {
        const images = entry.childNodes[3];
        const jumpStps = getjumpSteps(images);
        entry.childNodes[1].childNodes[3].innerHTML = `${entrySide[i]}/${maximumSide[i]}`;  // Set the number of all pages
        if(jumpStps == 0)
        {
            entry.childNodes[5].style.display = "none";
            entry.childNodes[7].style.display = "none";
        }
        i++;
    });
};

const getjumpSteps = (images) => {
    const maxItems = computeFirstRowItems();

    var actualItems = Math.floor(images.childNodes.length / 2);
    // console.log(`${maxItems} ${actualItems}`);
    if(maxItems >= actualItems)
        return 0;

    var x = 0;

    const textElement = images.childNodes[0];

    // console.log(textElement);

    // add empty elements to create a nice spaced out view
    while(actualItems % maxItems != 0)
    {
        if(x == 10)
        {
            console.error("Too many repetitions");
            break;
        }
        const elem = document.createElement("li");
        elem.classList.toggle("cover");
        images.appendChild(elem);
        images.appendChild(textElement.cloneNode());
        actualItems = Math.floor(images.childNodes.length / 2);
        //console.log(actualItems);
        //console.log(images.childNodes);
        x++;
    }

    //console.log(`${maxItems} ${actualItems}`);
    return maxItems;
};

const outerWidthMargin = (el) => {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);
  
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
};

const width = (el) => {
    return parseFloat(getComputedStyle(el, null).width.replace("px", ""));
};

const height = (el) => {
    return getComputedStyle(el, null).height;
};

const computeFirstRowItems = () => {
    const ul = document.querySelector(".entry:first-child ul.img-list")
    const li = document.querySelector(".entry:first-child ul.img-list > li")
    // console.log(`${width(ul)} ${outerWidthMargin(li)} ${width(ul) / outerWidthMargin(li)}`);
    return Math.round(width(ul) / outerWidthMargin(li));
};

const initSideCounter = () => {
    for(i = 0; i < entrySide.length; i++)
        entrySide[i] = 1;


    const entrys = document.querySelectorAll(".entry");
    for(i = 0; i < maximumSide.length; i++)
    {
        const images = entrys[i].childNodes[3];
        const jumpWidth = getjumpSteps(images);
        if(jumpWidth == 0)
        {
            maximumSide[i] = 1;
            continue;
        }
        const totalElements = Math.floor(images.childNodes.length / 2);
        //console.log(`${jumpWidth} ${totalElements} ${Math.floor(totalElements / jumpWidth)}`);
        maximumSide[i] = Math.floor(totalElements / jumpWidth);
    }
    //console.log(maximumSide);
};

const app = () => {
    initSideCounter();
    navInteraction();
    slideInteraction();
};

app();
