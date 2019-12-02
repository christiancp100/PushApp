require('../../models/Exercise');
require('../../models/Session');
require('../../models/Schedule');

let Exercise = mongoose.model('Exercise');
let Session = mongoose.model('Session');
let Schedule = mongoose.model('Schedule');

function retrieveDay(){
    let day_btn = document.getElementById("day_btn");
    let day = day_btn.options[day_btn.selectedIndex].text;
    return day;
}

function retrieveClientId(){
    let selectedUser = document.getElementById('pickUser');
    let _clientId = selectedUser.options[selectedUser.selectedIndex].getAttribute("value");
    return _clientId;
}

async function renderCoachTable(){

    console.log("AAA" + retrieveDay());

    let session = await fetch('workouts/sessions/search' + "?weekday=" + retrieveDay() + "&_clientId=" + retrieveClientId() + "&_coachId=" + localStorage.userAccountId, {
        method: "GET",
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
    });
    if(session){
        console.log(session.url);
    } else {
        console.log("NO");
    }

    // let exercises = [];
    // let found = await Session.find(filter);
    // if(found){
    //     for(let i = 0; i < found.exercises.length; i++){
    //         exercises.push(found.exercise[i]);
    //     }
    //     return exercises;
    // }else{
    //     return [];
    // }
}