//store into array on server
let arr;
async function findName() {
     let res = await fetch('/coaches/username', {
            method: "POST",
            body: JSON.stringify({username: name}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
     arr = await res.json();
     console.log(arr);
    /*let result = await res.json();
    console.log(result);
    return result;*/
}
function mySubmit() {
     console.log("SUMBINT");
     let name = document.getElementById("user").value;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].username === name){
            return false;
        }
    }
    return true;
}

function testing() {
    localStorage.setItem('username', 'casual name');
}