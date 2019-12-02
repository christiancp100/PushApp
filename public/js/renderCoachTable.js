require('../../models/Exercise');
require('../../models/Session');
require('../../models/Schedule');

let Exercise = mongoose.model('Exercise');
let Session = mongoose.model('Session');
let Schedule = mongoose.model('Schedule');

function retrieveDay(){
    let day_btn = document.getElementById("day_btn");
    let day = day_btn.options[day_btn.selectedIndex].text;
}

function retrieveClienId(){
    let da
}

async function renderCoachTable(activeUser){

    let filter = {
        weekday : retrieveDay(),
        _clientId : '???',
        _coachId : localStorage.userAccountId
    };

    let session = await fetch('workouts/sessions/search', {
        method: "GET",
        body: JSON.stringify(filter),
        headers: {
            'Content-Type':'application/json',
            'Accept' : 'application/x-www-form-urlencoded'
        },
    });

    if(session){
        console.log(session);
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