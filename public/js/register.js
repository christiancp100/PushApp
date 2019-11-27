
function coachRegistration(event) {
    console.log("entrato!!!");
    event.preventDefault();
    
    let inputs = document.querySelectorAll("input");
    // console.log(inputs);

    let selects = document.querySelectorAll("select");
    // console.log(selects);

    let body = {
      firstName : inputs[0].value,
      lastName : inputs[1].value,
      username : inputs[2].value,
        address1 : inputs[3].value,
      address2 : inputs[4].value,
      email: inputs[5].value,
      photo : inputs[6].value,
      birthday: inputs[7].value,
        password : inputs[8].value,
        phone: inputs[9].value,
        city:inputs[10].value,
        zipCode:inputs[11].value,
        state:inputs[12].value,

        country: selects[0].value,
        sex: selects[1].value,
        currency: selects[2].value,
    };
    console.log(body);
        fetch("/coaches", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body : JSON.stringify(body)
        })
            .then(res => {
                dust.render("register_forms/registration_completed",{}, (err, out) => {
                    console.log(out)
                        document.getElementsByTagName("body")[0].innerHTML = out;
                    });
            });
    }