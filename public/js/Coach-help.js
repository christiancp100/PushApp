async function mySubmit(e) {
    e.preventDefault();
    let name =  document.getElementById("user").value;
    console.log("This is name:");
    console.log(name);
    try {
        let res = await fetch('./username', {
            method: "POST",
            body: JSON.stringify({username: name}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let result = await res.json();
        console.log(result);
        return result;
    }
    catch (e) {
        throw new Error(e);
    }
}

