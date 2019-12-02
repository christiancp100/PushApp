//store into array on server
let arr;

// async function findName() {
//     let res = await fetch('/coaches/username', {
//         method: "POST",
//         body: JSON.stringify({username: name}),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//     arr = await res.json();
//     console.log(arr);
//     /*let result = await res.json();
//     console.log(result);
//     return result;*/
// }

function mySubmit() {
    let name = document.getElementById("user").value;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].username === name) {
            return false;
        }
    }
    return true;
}
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

// function testing(name) {
//     localStorage.setItem('username', name);
// }

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

function logOut() {
    debugger
    localStorage.removeItem('userAccountId');
    localStorage.removeItem('username');
    window.location.replace("/login");
}
