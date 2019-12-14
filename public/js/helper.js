function gotoCheckout(e) {
    e.preventDefault();
    orderData.serviceId = e.target.name;
    dust.render("checkout", {}, function (err, out) {
        document.getElementById("searchBox").remove();
        document.getElementById("grid").innerHTML = out;
    });
    initStripe();
}

let orderData = {
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
/*sets image to default (in part)*/
function deleteButton() {
    document.getElementById('putimage').value = '';
    document.getElementById('im').src = "";
}
function getImage() {
    let file = document.getElementById("image").files[0];
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let data = fileReader.result;
        console.log(data);
        document.getElementById("im").src = data;
        document.getElementById("putimage").value = data;
    };
    fileReader.readAsDataURL(file);
}

async function fetchRating() {
    // e.preventDefault();
    try {
        let res = await fetch('/clients/rating');
        return await res.text();
    }
    catch (e) {
        console.log(e);
    }

}

function starsRating(e) {
    e.preventDefault();
    let uncolorClass = "unchecked fa fa-star";
    let colorClass = "fa fa-star checked";
    let save = e.target.nextSibling;
    let child = e.target;
    //color the stars
    while (child.nodeName !== "H2") {
        child.className = colorClass;
        child = child.previousSibling;
    }
    //uncolor the stars
    while (save.nodeName !== "BR") {
        save.className = uncolorClass;
        save = save.nextSibling;
    }
}

function addReview(e, id) {
    console.log(id);
    e.preventDefault();
    let rating = 0;
    let first = document.getElementById("firstStar");
    while (first.nodeName === "SPAN") {
        if (first.className === "fa fa-star checked") {
            ++rating;
        }
        first = first.nextSibling;
    }
    let comment = document.getElementById("commentReview");
    let title = document.getElementById("titleReview");
    if (!title.checkValidity() || !comment.checkValidity()){
        document.getElementById("alert").innerText = "Please fill all fields";
    } else {
        comment = comment.value;
        title = title.value;
        document.getElementById("alert").innerText = "";
        fetch('/workouts/finish-workout', {
            method: "POST",
            body: JSON.stringify({
                score: rating,
                title: title,
                comment: comment,
                id: id, //id of coach,
                new: 'Y'
            }),
            headers : {
                'content-type' : 'application/json',
                'accept' : 'text/html'
            },
        })
            .then(res => res.text())
            .then(text => page.innerHTML = text)
            .catch((err) => console.log(err))
    }
}


function changeRev(objId) {
    let comment = document.getElementById("commentReview");
    let title = document.getElementById("titleReview");
    if (!title.checkValidity() || !comment.checkValidity()){
        document.getElementById("alert").innerText = "Please fill all fields";
    } else {
        comment = comment.value;
        title = title.value;
        document.getElementById("alert").innerText = "";
        let rating = 0;
        let first = document.getElementById("firstStar");
        while (first.nodeName == "SPAN") {
            if (first.className == "fa fa-star checked") {
                ++rating;
            }
            first = first.nextSibling;
        }
        fetch('/workouts/finish-workout', {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'accept': 'text/html'
            },
            body: JSON.stringify({
                score: rating,
                title: title,
                comment: comment,
                objId: objId,
                new: 'N'
            })
        })
            .then((res) => res.text())
            .then(text => page.innerHTML = text)
            .catch(err => console.log(err))
    }
}

function noReviewChange() {
    fetch('/workouts/finish-workout', {
        method: "POST",
        headers: {
            'content-type': 'application/json',
            'accept': 'text/html'
        },
        body: JSON.stringify({
            new: 'X'
        })
    })
        .then((res) => res.text())
        .then(text => page.innerHTML = text)
        .catch(err => console.log(err))
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
YOU HAVE FOUND AN EASTER EGG
*/

function changeReview(e, objId) {
    e.preventDefault();
    document.getElementById("titleReview").disabled = false;
    document.getElementById("commentReview").disabled = false;
    document.getElementById("buttons").innerHTML = '<button id="rate" type="button">Rate</button>';
    document.getElementById("rate").addEventListener("mousedown", function () {
        changeRev(objId)
    })
    document.querySelectorAll("SPAN").forEach((el) => {
        el.addEventListener("mousedown", starsRating)
    });
}

getUser = async () => {
    let obj = await fetch('/auth/getuserinfo');
    obj = await obj.json();
    return obj.username;
};

async function redirectDashboard(){
    return window.location.assign("http://127.0.0.1:3000/" + await getUser());
}
