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
    resetTable();
    level = 0;

    if(retrieveDay() !== 'Session' && retrieveClientId() !== ''){
        let foundSession = await fetch('workouts/sessions/search' + "?weekday=" + retrieveDay() + "&_clientId=" + retrieveClientId() + "&_coachId=" + localStorage.userAccountId, {
            method: "GET",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
        });

        if(foundSession.status === 404){
            resetTable();
            level = 0;
            return;
        }

        let session = await foundSession.json();

        let exerciseIds = await session.exercises;

        if(exerciseIds === undefined){
            resetTable();
            level = 0;
            return;
        }

        let exerciseList = [];
        // console.log('LENGTH', exerciseIds.length);
        // console.log('exerciseIds', exerciseIds);
        // for(let i = 0; i < exerciseIds.length; i++){
        //     console.log(i, exerciseIds[i]);
        // }

        for(let i = 0; i < exerciseIds.length; i++){
            // console.log(i, exerciseIds[i]);

            let exercise = await fetch('workouts/exercises/search' + "?_id=" + exerciseIds[i], {
                method: "GET",
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                }
            });
            let x = await exercise.json();
            exerciseList.push(x);
        }
        for(let i = 0; i < exerciseList.length; i++){
            addRow();
            document.getElementById('exerciseName' + i).innerHTML = exerciseList[i].name;
            document.getElementById('exerciseReps' + i).innerHTML = exerciseList[i].repetitions;
            document.getElementById('exerciseSets' + i).innerHTML = exerciseList[i].set;
            document.getElementById('exerciseWeight' + i).innerHTML = exerciseList[i].pumpWeight;
            document.getElementById('exerciseComments' + i).innerHTML = exerciseList[i].description;
        }
    }
}

function resetTable(){
    let table = document.getElementById('scheduleTable');
    let rowCounter = 0;
    while(document.getElementById('row' + rowCounter)){
        table.removeChild(document.getElementById('row' + rowCounter));
        rowCounter++;
    }
}

async function deleteFromDatabase(){
    let table = document.getElementById('scheduleTable');
    let rowCounter = 0;
    while(document.getElementById('row' + rowCounter)){
        let filter = {
            name : document.getElementById('exerciseName' + rowCounter).innerHTML,
            repetitions : document.getElementById('exerciseReps' + rowCounter).innerHTML,
            set : document.getElementById('exerciseSets' + rowCounter).innerHTML,
            pumpWeight : document.getElementById('exerciseWeight' + rowCounter).innerHTML,
            description : document.getElementById('exerciseComments' + rowCounter).innerHTML,
        };
        try{

            let exercise = await fetch('workouts/exercises/delete' + "?_id=" + exerciseIds[i], {
                method: "DELETE",
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                }
            });


            let found = await Exercise.find(filter);
            found.remove();
            console.log('removed');
        }catch(e){
            console.log(e);
        }
        table.removeChild(document.getElementById('row' + rowCounter));
        rowCounter++;
    }
}