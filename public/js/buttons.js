//myService
function buttons(){
    let buttons = document.querySelectorAll('.no-padding ul li a');

    let buttonClients = buttons[1];
    buttonClients.addEventListener("click", () => {
        renderClients();
    });

    let buttonService = buttons[3];
    buttonService.addEventListener("click", () => {
        serviceInitialize();
    });

    let buttonDashboard = buttons[0];
    buttonDashboard.addEventListener("click", () => {
        renderDashboard();
    });
}

function clientButtons(){
    let buttons = document.querySelectorAll('.no-padding ul li a');
    let buttonCoach = buttons[4];
    console.log(buttonCoach);
    buttonCoach.addEventListener("click", () => {
        renderCoaches();
    });
}

async function renderClients(){
    let hiringClients = await getHiringClients();
    let clients = [];
    for(let i = 0; i < hiringClients.length; i++){
        let client = await getClientAccount(hiringClients[i]._clientId);
        let clientJson = await client.json();
        clients.push(clientJson[0]);
    }

}