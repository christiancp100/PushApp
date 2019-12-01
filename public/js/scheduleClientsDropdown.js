async function clientDropdown() {
    let dropDown = document.getElementById("pickUser");
    let selectedUser = dropDown.options[dropDown.selectedIndex].text;
    console.log(selectedUser);

    let clientsArray;

    try{
        let result = await fetch('/coaches/hire/coach/5ddfdae5de74d3324af464a2')
            .then(result => result.json())
            .then(data => {
                console.log(data.length);
                console.log(JSON.stringify(data));
                console.log(data[0]);
                console.log('ID ' + data[0]._clientId);
                return data;
            })
            .catch((e)=>{
                console.log(e);
            });

        if(result.length > 0){
            for(let i = 0; i < result.length; i++){
                try{
                    let found = await fetch('/coaches/search?_id=' + result[i]._clientId);
                    let x = found.json()
                        .then((client)=>{
                            // console.log(client[i]);
                            let toDust = {
                                firstName: client[i].firstName,
                                lastName: client[i].lastName,
                                photo: client[i].photo,
                            };
                            // console.log(toDust);
                            dust.render('./../../views/dashboard_partials', {clients: toDust}, (err, out)=>{
                                if(err){
                                    console.log(err);
                                }
                                if(out){
                                    console.log(out);
                                }
                            });
                        })
                }catch(e){
                    console.log('impossible');
                }
            }
        }else{
            console.log('No client hired you...');
        }
    }catch(e){
        console.log(e);
    }
}