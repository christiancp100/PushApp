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

    if(retrieveDay() !== 'Session' && retrieveClientId() !== ''){
        let foundSession = await fetch('workouts/sessions/search' + "?weekday=" + retrieveDay() + "&_clientId=" + retrieveClientId() + "&_coachId=" + localStorage.userAccountId, {
            method: "GET",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
        });

        if(foundSession.status === 404){
            return;
        }

        let session = await foundSession.json();

        let exerciseIds = await session.exercises;

        if(exerciseIds === undefined){
            return;
        }

        let exerciseList = [];

        for(let i = 0; i < exerciseIds.length; i++){
            let exercise = await fetch('workouts/exercises/search' + "?_id=" + exerciseIds[i], {
                method: "GET",
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
            });
            let x = await exercise.json();
            console.log("x ", x);
            exerciseList.push(x);
        }

        console.log("PRCDD " , exerciseList);
        for(let i = 0; i < exerciseList.length; i++){
            addRow();
            document.getElementById('exerciseName' + i).innerHTML = exerciseList[i].name;
            document.getElementById('exerciseReps' + i).innerHTML = exerciseList[i].name;
            document.getElementById('exerciseSets' + i).innerHTML = exerciseList[i].name;
            document.getElementById('exerciseWeight' + i).innerHTML = exerciseList[i].name;
            document.getElementById('exerciseComments' + i).innerHTML = exerciseList[i].name;

        }
    }
}