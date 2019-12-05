function countRow(){
    let level = 0;
    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");
    level = rows.length - 1;
    return level;
}

async function retrieveCoachId() {
    let obj = await fetch('/auth/getuserinfo');
    obj = await obj.json();
    return obj.userAccountId;
}
function retrieveDay(){
    let day_btn = document.getElementById("day_btn");
    return day_btn.options[day_btn.selectedIndex].text;
}

function retrieveClientId(){
    let selectedUser = document.getElementById('pickUser');
    return selectedUser.options[selectedUser.selectedIndex].getAttribute("value");
}

function retrieveScheduleName(){
    return document.getElementById("last_name").value;
}

function isNullOrWhiteSpace(input){
    if(typeof input === undefined || input === null){
        return true;
    }
    return input.replace(/\s/g,'').length < 1;
}

let scheduleId;
let sessionsArray;
let scheduleName;

async function addRow() {

    let level = countRow();
    console.log('LEVEL', level);

    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");
    let lastRow = table.childNodes[rows.length-1];//The lastRow elements s.t. we can retrieve the content and put it in the table

    //last row inputs
    let exName = lastRow.querySelectorAll('td input')[0];
    let exReps = lastRow.querySelectorAll('td input')[1];
    let exSets = lastRow.querySelectorAll('td input')[2];
    let exWeight = lastRow.querySelectorAll('td input')[3];
    let exComments = lastRow.querySelectorAll('td input')[4];

    let newExerciseRow = document.createElement('tr');
    newExerciseRow.id = 'row' + level;

    let newExerciseName = document.createElement('td');
    newExerciseName.id = 'exerciseName' + level;
    newExerciseName.innerHTML = exName.value;

    let newExerciseReps = document.createElement('td');
    newExerciseReps.id = 'exerciseReps' + level;
    newExerciseReps.innerHTML = exReps.value;

    let newExerciseSets = document.createElement('td');
    newExerciseSets.id = 'exerciseSets' + level;
    newExerciseSets.innerHTML = exSets.value;

    let newExerciseWeight = document.createElement('td');
    newExerciseWeight.id = 'exerciseWeight' + level;
    newExerciseWeight.innerHTML = exWeight.value;

    let newExerciseComments = document.createElement('td');
    newExerciseComments.id = 'exerciseComments' + level;
    newExerciseComments.innerHTML = exComments.value;

    let newExerciseRemoveInput = document.createElement('input');
    newExerciseRemoveInput.type = 'submit';
    newExerciseRemoveInput.value = '-';
    newExerciseRemoveInput.className = 'valign-wrapper btn-floating btn-small waves-effect waves-light black';
    newExerciseRemoveInput.id = "remove_btn";
    newExerciseRemoveInput.addEventListener('click', removeRow);

    let icon = document.createElement('i');//just for beauty reason
    icon.className = 'material-icons';
    icon.id = "rem_btn"+ level;
    newExerciseRemoveInput.appendChild(icon);

    table.insertBefore(newExerciseRow, table.childNodes[rows.length-1]);
    newExerciseRow.appendChild(newExerciseName);
    newExerciseRow.appendChild(newExerciseReps);
    newExerciseRow.appendChild(newExerciseSets);
    newExerciseRow.appendChild(newExerciseWeight);
    newExerciseRow.appendChild(newExerciseComments);
    newExerciseRow.appendChild(newExerciseRemoveInput);


}

async function searchSession(){
    try{
        let sessionFound = await fetch('/workouts/sessions/search?_coachId=' + await retrieveCoachId() + '&_clientId=' + retrieveClientId() + '&weekday=' + retrieveDay(), {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        });
        return sessionFound;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function postSession(body){
    try{
        let createSession = await fetch("/workouts/sessions/new", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let session = await createSession.json();
        return session;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function postSchedule(body){
    try{
        let exerciseFound = await fetch('/workouts/schedules/new', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        });
        let exercises = await exerciseFound.json();
        return exercises;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function putSession(_id, body){
    try{
        let updatingSession = await fetch('workouts/sessions/edit/' + _id, {
            method: "PUT",
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(body)
        });
        let session = await updatingSession.json();
        return session;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function putSchedule(_id, body){
    try{
        let updatingSchedule = await fetch('workouts/schedules/edit/' + _id, {
            method: "PUT",
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(body),
        });
        let session = await updatingSchedule.json();
        return session;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function deleteSession(_id){
    try{
        let deleteSession = await fetch('workouts/sessions/delete/' + _id, {
            method: 'DELETE',
            headers: {
                'Content-Type':'Application/json',
            }
        });
        await deleteSession;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function postExercise(body){
    try{
        let createdExercise = await fetch('/workouts/exercises/new',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            });
        let exercise = await createdExercise.json();
        return exercise;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function deleteExercise(_id){
    try{
        let removeExercise = await fetch('workouts/exercises/delete/' + _id, {
            method: 'DELETE',
            headers: {
                'Content-Type':'Application/json',
            }
        });
        let removedExercise = await removeExercise;
        return removedExercise;
    }catch(e){
        console.log(e);
        return undefined;
    }
}

async function searchExercise(_id){
    try{
        let exerciseFound = await fetch('/workouts/exercises/search?_id=' + _id, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        });
        let exercises = await exerciseFound.json();
        return exercises;
    }catch(e){
        console.log(e);
        return undefined;
    }
}


function removeRow(){
    let toRemove = this.parentNode;
    removeSingleExerciseFromDatabase(toRemove.id);
    console.log('Looking for the exercise to remove...');
    toRemove.parentNode.removeChild(toRemove);
    let level = countRow();
    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");
    for(let i = 0; i < level; i++){
        rows[i].id = 'row' + i;
        let child = rows[i].children;
        child[0].id = 'exerciseName' + i;
        child[1].id = 'exerciseReps' + i;
        child[2].id = 'exerciseSets' + i;
        child[3].id = 'exerciseWeight' + i;
        child[4].id = 'exerciseComments' + i;
    }
}
async function newExercise() {

    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");
    let lastRow = table.childNodes[rows.length-1];//The lastRow elements s.t. we can retrieve the content and put it in the table

    //last row inputs
    let exName = lastRow.querySelectorAll('td input')[0];
    let exReps = lastRow.querySelectorAll('td input')[1];
    let exSets = lastRow.querySelectorAll('td input')[2];
    let exWeight = lastRow.querySelectorAll('td input')[3];
    let exComments = lastRow.querySelectorAll('td input')[4];

    let body = {
        name: exName.value,
        description: exComments.value,
        weightUnit: "kg",
        pumpWeight: exWeight.value,
        bodyPart: 'ok',
        set: exSets.value,
        repetitions: exReps.value,
    };
    let exercise = await postExercise(body);

    createAndModifySession(exercise._id);

    exName.value ='';
    exReps.value = '';
    exSets.value = '';
    exWeight.value = '';
    exComments.value ='';
}

async function createAndModifySession(_exerciseId){
    let session = await searchSession();
    if(session.status === 404){
        let body = {
            _coachId: await retrieveCoachId(),
            _clientId: await retrieveClientId(),
            weekday: retrieveDay(),
            exercises: [_exerciseId],
        };

        let session = await postSession(body);
        sessionsArray.push(session._id);

        let scheduleBody={
            _coachId: await retrieveCoachId(),
            _clientId: await retrieveClientId(),
            name: retrieveScheduleName(),
            sessions: sessionsArray,
            startDate: Date.now(),
            endDate: Date.now()
        };
        await putSchedule(scheduleId, scheduleBody);
        return;
    }

    let sessionJson = await session.json();
    let exercises = sessionJson.exercises;
    let _sessionId = sessionJson._id;

    exercises.push(_exerciseId);

    let body = {
        _coachId: await retrieveCoachId(),
        _clientId: retrieveClientId(),
        weekday: retrieveDay(),
        exercises: exercises,
    };
    await putSession(_sessionId, body);
}

function resetTable(){
    let table = document.getElementById('scheduleTable');
    let rowCounter = 0;
    while(document.getElementById('row' + rowCounter)){
        table.removeChild(document.getElementById('row' + rowCounter));
        rowCounter++;
    }
}

async function renderTable(){
    resetTable();
    let session = await searchSession();
    if(session.status === 404){
        return;
    }

    let sessionJson = await session.json();
    if(sessionJson.exercises === []){
        return;
    }

    let exercisesIds = sessionJson.exercises;

    let exerciseList = [];

    for(let i = 0; i < exercisesIds.length; i++){
        let exercise = await searchExercise(exercisesIds[i]);
        exerciseList.push(exercise);
    }

    for(let i = 0; i < exerciseList.length; i++) {
        addRow();
        document.getElementById('exerciseName' + i).innerHTML = exerciseList[i].name;
        document.getElementById('exerciseReps' + i).innerHTML = exerciseList[i].repetitions;
        document.getElementById('exerciseSets' + i).innerHTML = exerciseList[i].set;
        document.getElementById('exerciseWeight' + i).innerHTML = exerciseList[i].pumpWeight;
        document.getElementById('exerciseComments' + i).innerHTML = exerciseList[i].description;
    }
}

async function removeSingleExerciseFromDatabase(rowId){
    // let rowToBeRemovedFromDatabase = document.getElementById(rowId);
    try{
        let string = rowId.slice(3, rowId.length);
        let position = parseInt(string, 10);

        let foundSession = await searchSession();
        let session = await foundSession.json();

        let sessionExercises = session.exercises;
        let sessionId = session._id;

        let exId = session.exercises[position];

        sessionExercises.splice(sessionExercises.indexOf(exId), 1);

        let body = {
            _coachId: await retrieveCoachId(),
            _clientId: retrieveClientId(),
            weekday: retrieveDay(),
            exercises: sessionExercises
        };

        await putSession(sessionId,body);


        await deleteExercise(exId);

    }catch(e){
        console.log(e);
    }
}

async function deleteFromDatabase(){
    let rowCounter = 0;
    while(document.getElementById('row' + rowCounter)){

        try{
            let session = await searchSession();

            let sessionJson = await session.json();

            let exerciseIds = await sessionJson.exercises;

            for(let i = 0; i < exerciseIds.length; i++){
                await deleteExercise(exerciseIds[i]);
            }

            let sessionId = sessionJson._id;

            await deleteSession(sessionId);

            resetTable();

        }catch(e){
            console.log(e);
        }
        rowCounter++;
    }
}


async function doneScheduleName(){
    let title = document.getElementById("title");
    let scheduleName = retrieveScheduleName();

    let schedName = document.getElementById("schedName");
    schedName.remove();

    let body ={
        _coachId: await retrieveCoachId(),
        _clientId: retrieveClientId(),
        name: scheduleName,
        sessions: sessionsArray, // Day of the week
        startDate: Date.now(),
        endDate: Date.now(),
    };
    putSchedule(scheduleId, body);

    let h2 = document.createElement("h2");
    h2.innerHTML = scheduleName;
    h2.id = "title";
    h2.className = "center";

    title.insertAdjacentElement("afterend",h2);
    title.remove();

    let modify_a = document.createElement("a");
    modify_a.className = "valign-wrapper btn-floating btn-small waves-effect waves-light black";
    let  modify_i = document.createElement("i");
    modify_i.className = "material-icons";
    modify_i.innerHTML = "create";
    modify_a.appendChild(modify_i);
    h2.appendChild(modify_a);

    modify_a.addEventListener("click", ()=>{
        modifyScheduleName(scheduleName, h2);
    });
}

function modifyScheduleName(scheduleName, h2){
    //fetch put
    let string = '<div class="input-field col s6" id="schedName"><input id="last_name" type="text" class="validate"><label for="last_name">Schedule Name</label><a class="valign-wrapper btn-floating btn-small waves-effect waves-light black" onclick="doneScheduleName()"><i class="material-icons" id="done_outline" >done_outline</i> </a> </div> </div>';
    h2.innerHTML = string;
}

createSchedule = async() => {
    scheduleName = retrieveScheduleName();
    if(retrieveScheduleName()) {
        let body = {
            _coachId: await retrieveCoachId(),
            _clientId: retrieveClientId(),
            name: retrieveScheduleName(),
            sessions: [],
            startDate: Date.now(),
            endDate: Date.now(),
        };
        let created = await postSchedule(body);
        scheduleId = created._id;
    }else{
        let body = {
            _coachId: await retrieveCoachId(),
            _clientId: retrieveClientId(),
            name: '',
            sessions: [], // Day of the week
            startDate: {type: Date, required: true},
            endDate: {type: Date, required: true},
        };
        let created = await postSchedule(body);
        scheduleId = created._id;
    }
};