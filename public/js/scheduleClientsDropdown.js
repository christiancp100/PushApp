let dust = require('dustjs-linkedin');

async function clientDropdown() {
    // let dropDown = document.getElementById("pickUser");
    // let selectedUser = dropDown.options[dropDown.selectedIndex].text;
    // console.log(selectedUser);

    let clientsArray = [];

    try{
        let result = await fetch('/coaches/hire/coach/5ddfdae5de74d3324af464a2')
            .then(result => result.json())
            .then(data => {
                return data;
            })
            .catch((e)=>{
                console.log(e);
            });

        if(result.length > 0){
            for(let i = 0; i < result.length; i++){
                try{
                    let found = await fetch('/coaches/search?_id=' + result[i]._clientId);
                    let client = await found.json();
                    let clientInfo = {
                        firstName: client[i].firstName,
                        lastName: client[i].lastName,
                        photo: client[i].photo,
                    };
                    clientsArray.push(clientInfo);
                }catch(e){
                    console.log(e);
                }
            }
        }else{
            console.log('No client hired you...');
        }
    }catch(e){
        console.log(e);
    }
    return clientsArray;
}

async function renderClients(){
    console.log("DENTRO");
    try{
        let clientsArray = await clientDropdown();
        dust.render('dashboard_partials/schedule', {clients: clientsArray}, (err, out)=>{
            if(err){
                console.log(err);
            }
            if(out){
                console.log(out);
            }
        });
    }catch(e){
        console.log(e);
    }
}