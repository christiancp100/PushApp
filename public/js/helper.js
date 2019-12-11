function gotoCheckout(e) {
    e.preventDefault();
    orderData.serviceId = e.target.name;
    dust.render("checkout", {}, function (err, out) {
        document.getElementById("searchBox").remove();
        document.getElementById("grid").innerHTML = out;
    });
    initStripe();
};

var orderData = {
    items: [{id: "PushApp membership"}],
    serviceId: ""
};

function fetchClient(e) {
    e.preventDefault();
    fetch('/register/client', {method: "GET"})
        .then(res => res.text())
        .then((text) => {
            console.log(text);
            document.getElementById("reg").innerHTML = text
        });
}

function fetchCoach(e) {
    e.preventDefault();
    console.log("HERE");
    fetch('/register/coach', {method: "GET"})
        .then(res => res.text())
        .then((text) => {
            console.log(text);
            document.getElementById("reg").innerHTML = text
        });
}

function getImage() {
    let file = document.getElementById("image").files[0];
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let data = fileReader.result;
        console.log(data);
        document.getElementById("im").src = data;
        document.getElementById("putimage").value = data;
    }
    fileReader.readAsDataURL(file);
}

function fetchRating(e, coach) {
    e.preventDefault();
    fetch('/clients/rating', {
        method: "POST",
        body: JSON.stringify({coach : coach})//todo send coach or its id when you have ended the session
    })
        .then(res => res.text())
        .then(text => {
            //todo bring form of rating to page
        })
}

function starsRating(e) {
    e.preventDefault();
    let uncolorClass = "unchecked fa fa-star";
    let colorClass = "fa fa-star checked";
    let save = e.target.nextSibling;
    let child = e.target;
    //color the stars
    while (child.nodeName != "H2") {
        child.className = colorClass;
        child = child.previousSibling;
    }
    //uncolor the stars
    while (save.nodeName != "BR") {
        save.className = uncolorClass;
        save = save.nextSibling;
    }
}

function addReview(e, id) {
    console.log(id);
    e.preventDefault();
    let rating = 0;
    let first = document.getElementById("firstStar");
    while (first.nodeName == "SPAN") {
        if (first.className == "fa fa-star checked") {
            ++rating;
        }
        first = first.nextSibling;
    }
    let comment = document.getElementById("commentReview").value;
    let title = document.getElementById("titleReview").value;
    fetch('/coaches/newrating', {
        method: "POST",
        body: JSON.stringify({
            score: rating,
            title: title,
            comment: comment,
            id: id
        }),
        /*headers: {
            'Content-type' : 'application/json'
        }*/
    })
}

function starColor(score) {
    document.getElementById("titleReview").validity.valid;
    document.getElementById("commentReview").validity.valid;
    let uncolorClass = "unchecked hov fa fa-star";
    let colorClass = "hov fa fa-star checked";
    let star = document.getElementById("firstStar");
    while (score > 0) {
        star.className = colorClass;
        --score;
        star = star.nextSibling;
    }
    if (star.nodeName != "BR") {
        while (star.nodeName != "BR") {
            star.className = uncolorClass;
            star = star.nextSibling;
        }
    }
}

function changeRev(e, objId) {
    e.preventDefault();
    let comment = document.getElementById("commentReview").value;
    let title = document.getElementById("titleReview").value;
    let rating = 0;
    let first = document.getElementById("firstStar");
    while (first.nodeName == "SPAN") {
        /*TODO make the class work without touching again stars*/
        if (first.className == "fa fa-star checked") {
            ++rating;
        }
        first = first.nextSibling;
    }
    fetch('/coaches/rating', {
        method: "PUT",
        body: JSON.stringify({
            score: rating,
            title: title,
            comment: comment,
            objId: objId
        })
    }).then((res) => {
        /*todo whatever needed*/
    }).catch(err => new Error(err))
}


/*_______________00__________________
________________0000_________________
_______________000000________________
____00_________000000__________00____
_____0000______000000______00000_____
_____000000____0000000___0000000_____
______000000___0000000_0000000_______
_______0000000_000000_0000000________
_________000000_00000_000000_________
_0000_____000000_000_0000__000000000_
__000000000__0000_0_000_000000000____
_____000000000__0_0_0_000000000______
_________0000000000000000____________
______________000_0_0000_____________
____________00000_0__00000___________
___________00_____0______00__________
*/
function changeReview(e, objId) {
    e.preventDefault();
    console.log("objId", objId);
    document.getElementById("titleReview").disabled = false;
    document.getElementById("commentReview").disabled = false;
    document.getElementById("buttons").innerHTML = '<button id="rate" type="button">Rate</button>';
    document.getElementById("rate").addEventListener("mousedown", function () {
        changeRev(e, objId)
    })
    document.querySelectorAll("span").forEach((el) => {
        console.log(el);
        el.addEventListener("mousedown", starsRating)
    });
}
