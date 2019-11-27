async function mySubmit() {
    //e.preventDefault();
    let name =  document.getElementById("user").value;
    console.log("This is name:");
    console.log(name);
    return await fetch('/coaches/username', {
        method : "GET",
        body : JSON.stringify({username : name}),
        headers: {
            'Content-Type': 'application/json'
        }})
}

