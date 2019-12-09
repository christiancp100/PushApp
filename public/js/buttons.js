//myService
function buttons(){
    let buttons = document.querySelectorAll('.no-padding ul li a');
    let buttonService = buttons[4];
    buttonService.addEventListener("click", () => {
        serviceInitialize();
    });
    // let buttonDashboard = buttons[0];
    // buttonDashboard.addEventListener("click", () => {
    //     renderDashboard();
    // });
}

function clientButtons(){
    let buttons = document.querySelectorAll('.no-padding ul li a');
    let buttonCoach = buttons[4];
    console.log(buttonCoach);
    buttonCoach.addEventListener("click", () => {
        renderCoaches();
    });
}

async function renderCoaches() {

        //container of the page
        let container = document.getElementsByClassName("container")[0];
        container.innerHTML = '';

        let div =  document.createElement('div');
        div.className ="row";
        div.id= "divtitle";

        container.appendChild(div);
        dust.render("dashboard_partials/coaches", {}, function(err, out) {
            div.innerHTML += out;
            getCoaches();
        });
}
// async function renderDashboard(){
//     //container of the page
//     let container = document.getElementsByClassName("container")[0];
//     container.innerHTML = '';
//         dust.render("dashboard_partials/schedule",{}, function(err, out) {
//             container.innerHTML += out;
//         });
// }