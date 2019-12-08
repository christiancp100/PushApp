async function retrieveCoachId() {
    let obj = await fetch('/auth/getuserinfo');
    obj = await obj.json();
    return obj.userAccountId;
}

async function getServices(){
    try{
        let servicesFound = await fetch('/coaches/services/' + await retrieveCoachId(), {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            }
        });
        let services = await servicesFound.json();
        return services;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function renderServices(){
    let services = await getServices();
    services.forEach((service) => {
        dust.render("dashboard_partials/services.dust", { service: service }, function(err, out) {
            console.log(out);
            document.getElementById("grid").innerHTML += out;
        });
    })
}