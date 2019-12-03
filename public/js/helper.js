
function fetchClient(e) {
    e.preventDefault();
    fetch('/register/client', {method: "GET"})
        .then(res => res.text())
        .then((text) => {console.log(text);
            document.getElementById("reg").innerHTML = text});
}
function fetchCoach(e) {
     e.preventDefault();
     console.log("HERE");
     fetch('/register/coach', {method: "GET"})
         .then(res => res.text())
         .then((text) => {console.log(text);
             document.getElementById("reg").innerHTML = text});
}

async function getActiveUser(name) {
    let res = await fetch('/auth/getuserinfo', {
        method: "POST",
        body: JSON.stringify({'username': name}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    let activeUser = await res.json();
    localStorage.setItem('userAccountId', activeUser.userAccountId);
    localStorage.setItem('username', activeUser.username);
}
//todo delete this function logout
/*function logOut() {
    debugger
    localStorage.removeItem('userAccountId');
    localStorage.removeItem('username');
    window.location.replace("/login");
}*/

function fetchRating(e, coach) {
    e.preventDefault();
    fetch('/clients/rating', {
        method: "POST",
        body: {coach : coach}//todo send coach or its id when you have ended the session
    })
        .then(res => res.text())
        .then(text => {
            //todo bring form of rating to page
        })
}
function starsRating(e) {
    e.preventDefault();
    let uncolorClass = "unchecked hov fa fa-star";
    let colorClass = "hov fa fa-star checked";
    let save = e.target.nextSibling;
    let child = e.target;
    //color the stars
    while (child.nodeName != "H2"){
        child.className = colorClass;
        child = child.previousSibling;
    }
    //uncolor the stars
    while (save.nodeName != "BR"){
        save.className = uncolorClass;
        save = save.nextSibling;
    }
}

function addReview(e, id) {
    e.preventDefault();
    let rating = 0;
    let first = document.getElementById("firstStar");
    while (first.nodeName == "SPAN"){
        if (first.className == "hov fa fa-star checked"){
            ++rating;
        }
        first = first.nextSibling;
    }
    let comment = document.getElementById("commentReview").value;
    let title = document.getElementById("titleReview").value;
    fetch('/coaches/rating',{
        method: "POST",
        body : JSON.stringify({
            score : rating,
            title : title,
            comment: comment,
            id: id
        }),
        /*headers: {
            'Content-type' : 'application/json'
        }*/
    })
}