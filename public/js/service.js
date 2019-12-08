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
    //container of the page
    let container = document.getElementsByClassName("container")[0];
    container.innerHTML = '';
    let services = await getServices();
    services.forEach((service) => {
        console.log("Service:", service);
        dust.render("dashboard_partials/services", { service: service }, function(err, out) {
            console.log("OUT",out);
            container.innerHTML += out;
        });
    })
}