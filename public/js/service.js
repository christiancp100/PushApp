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

async function getService(_id){
    try{
        let servicesFound = await fetch('/coaches/services/' + _id, {
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

async function postServices(body){
    try{
        let createService = await fetch('/coaches/services/new', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify(body)
        });
        let createdService = await createService.json();
        return createdService;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function putServices(body, id){
    try{
        let modifyService = await fetch('/coaches/services/edit/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify(body)
        });
        let modifiedService = await modifyService.json();
        return modifyService;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function deleteServices(id){
    try{
        let deleteService = await fetch('/coaches/services/delete/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            }
        });
        let deletedService = await deleteService.json();
        return deletedService;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

function resetDocument(){
    let container = document.getElementsByClassName("container")[0];
    container.innerHTML = '';
}

async function serviceInitialize(){
    let container = document.getElementsByClassName("container")[0];
    resetDocument();
    try{
        let services = await getServices();
        dust.render("dashboard_partials/services", { services: services }, function(err, out) {
            container.innerHTML = out;
        });
    }catch(e){
        console.log(e);
        return undefined;
    }
}

function windowToNewService(){
    let container = document.getElementsByClassName("container")[0];
    resetDocument();
    dust.render("coaches_services_new", {}, function(err, out) {
        container.innerHTML = out;
    });
}

async function newService(){
    let name = document.getElementsByName("name")[0].value;
    let duration = document.getElementsByName("duration")[0].value;
    let fee = document.getElementsByName("fee")[0].value;
    let description = document.getElementsByName("description")[1].value;
    let body = {
        _coachId: await retrieveCoachId(),
        name : name,
        duration: duration,
        fee: fee,
        description: description
    };
    await postServices(body);
    await serviceInitialize();
}

async function windowToEditService(event){
    let parent = event.target.parentNode.parentNode;
    let serviceId = parent.childNodes[0].childNodes[5].value;
    let container = document.getElementsByClassName("container")[0];
    resetDocument();
    dust.render("coaches_services_edit", {}, function(err, out) {
        container.innerHTML = out;
    });
    let found = await getService(serviceId);
    document.getElementsByName("name")[0].value = found[0].name;
    document.getElementsByName("duration")[0].value = found[0].duration;
    document.getElementsByName("fee")[0].value = found[0].fee;
    document.getElementsByName("description")[1].value = found[0].description;
    document.getElementsByName("_id")[0].value = serviceId;
}

async function editService(event){
    let name = document.getElementsByName("name")[0].value;
    let duration = document.getElementsByName("duration")[0].value;
    let fee = document.getElementsByName("fee")[0].value;
    let description = document.getElementsByName("description")[0].value;
    let body = {
        name: name,
        duration: duration,
        fee: fee,
        description: description
    };
    let serviceId = document.querySelectorAll('input')[0].value;
    await putServices(body, serviceId);
    await serviceInitialize();
}

async function deleteService(event){
    let parent = event.target.parentNode.parentNode;
    let serviceId = parent.childNodes[0].childNodes[5].value;
    await deleteServices(serviceId);
    await serviceInitialize();
}