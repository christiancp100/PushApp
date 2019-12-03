async function retrieveCoachId() {
    let obj = await fetch('/auth/getuserinfo');
    obj = await obj.json();
    return obj.userAccountId;
}
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

    if(retrieveDay() !== 'Session' && retrieveClientId() !== ''){
        let foundSession = await fetch('workouts/sessions/search' + "?weekday=" + retrieveDay() + "&_clientId=" + retrieveClientId() + "&_coachId=" + await retrieveCoachId(), {
            method: "GET",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
        });

        if(foundSession.status === 404){
            resetTable();
            // level = 0;
            return;
        }

        let session = await foundSession.json();

        let exerciseIds = await session.exercises;

        if(exerciseIds === undefined){
            resetTable();
            // level = 0;
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
            level++;
        }
    }
    level = 0;
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
            let foundSession = await fetch('workouts/sessions/search' + "?weekday=" + retrieveDay() + "&_clientId=" + retrieveClientId() + "&_coachId=" + await retrieveCoachId(), {
                method: "GET",
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
            });
            let session = await foundSession.json();

            let exerciseIds = await session.exercises;

            //remove session
            let removeSession = await fetch('workouts/sessions/delete/' + session._id, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
            });
            await removeSession;

            for(let i = 0; i < exerciseIds.length; i++){
                try {
                    let removeExercise = await fetch('workouts/exercises/delete/' + exerciseIds[i], {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                    });
                    await removeExercise;
                }catch(e){
                    console.log(e);
                }
            }
        }catch(e){
            console.log(e);
        }
        table.removeChild(document.getElementById('row' + rowCounter));
        rowCounter++;
    }
}

async function removeSingleExerciseFromDatabase(rowId){
    let rowToBeRemovedFromDatabase = document.getElementById(rowId);
    console.log('ROW: ', rowToBeRemovedFromDatabase);

    try{
        let exerciseName = rowToBeRemovedFromDatabase.childNodes[0].innerHTML;
        let exerciseReps = rowToBeRemovedFromDatabase.childNodes[1].innerHTML;
        let exerciseSets = rowToBeRemovedFromDatabase.childNodes[2].innerHTML;
        let exerciseWeight = rowToBeRemovedFromDatabase.childNodes[3].innerHTML;
        let exerciseDescription = rowToBeRemovedFromDatabase.childNodes[4].innerHTML;

        console.log(exerciseName);
        console.log(exerciseReps);
        console.log(exerciseSets);
        console.log(exerciseWeight);
        console.log(exerciseDescription);

        let foundExercise = await fetch('workouts/exercises/search'
            + "?name=" + exerciseName
            + "&repetitions=" + exerciseReps
            + "&set=" + exerciseSets
            + "&pumpWeight=" + exerciseWeight
            + "&description=" + exerciseDescription, {
            method: "GET",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
        });
        let exercise = await foundExercise.json();

        let exId = exercise._id;

        let foundSession = await fetch('workouts/sessions/search' + "?weekday=" + retrieveDay() + "&_clientId=" + retrieveClientId() + "&_coachId=" + await retrieveCoachId(), {
            method: "GET",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
        });
        let session = await foundSession.json();
        let sessionOldExercises = session.exercises;

        let sessionId = session._id;

        sessionOldExercises.splice(sessionOldExercises.indexOf(exId), 1);

        let body = {
            _coachId: await retrieveCoachId(),
            _clientId: retrieveClientId(),
            weekday: retrieveDay(),
            exercises: sessionOldExercises
        };

        let updatingSession = await fetch('workouts/sessions/edit/' + sessionId, {
            method: "PUT",
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(body)
        });
        await updatingSession.json();


        let removeExercise = await fetch('workouts/exercises/delete/' + exId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });
        await removeExercise;

        console.log('Session Updated Succesfully');

    }catch(e){
        console.log(e);
    }
}