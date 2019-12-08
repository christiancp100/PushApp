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

// async function renderDashboard(){
//     //container of the page
//     let container = document.getElementsByClassName("container")[0];
//     container.innerHTML = '';
//         dust.render("dashboard_partials/schedule",{}, function(err, out) {
//             container.innerHTML += out;
//         });
// }