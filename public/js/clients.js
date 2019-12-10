async function renderClients(){
    console.log("FFFF");
    let hiringClients = await getHiringClients();
    let hiringClientsJSON = await hiringClients.json();
    let clients = [];
    for(let i = 0; i < hiringClientsJSON.length; i++){
        let client = await getClientAccount(hiringClientsJSON[i]._clientId);
        let clientJSON = await client.json();
        clients.push(clientJSON);
    }
    console.log("AAA", clientJSON);
}

//prendere i clientId di ogni clientCoach relation

//hire relation of the coach
//extract clientIds
//retrieve list of clients with the given ids