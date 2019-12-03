let level = 0;
//clicking the add button will call this function that simply creates the row in the table.
function addRow() {

    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");

    let lastRow = table.childNodes[rows.length-1];//The lastRow elements s.t. we can retrieve the content and put it in the table

    let exName = lastRow.querySelectorAll('td input')[0];
    let exReps = lastRow.querySelectorAll('td input')[1];
    let exSets = lastRow.querySelectorAll('td input')[2];
    let exWeight = lastRow.querySelectorAll('td input')[3];
    let exComments = lastRow.querySelectorAll('td input')[4];

    //?check the required fields
    if(exName.value === ''){
        console.log("NOMEEEEE");
    }

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
    this.level++;
}

//-----------  SCHEDULE INIT AND EXERCISE CREATION----------------------------------------
//CREATES new "empty" Schedule and Takes the rows to work with them to create new exercise
function resetFields(){

    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");

    let lastRow = table.childNodes[rows.length-1];//The lastRow elements s.t. we can retrieve the content and put it in the table

    let exName = lastRow.querySelectorAll('td input')[0];
    let exReps = lastRow.querySelectorAll('td input')[1];
    let exSets = lastRow.querySelectorAll('td input')[2];
    let exWeight = lastRow.querySelectorAll('td input')[3];
    let exComments = lastRow.querySelectorAll('td input')[4];

    exName.value ='';
    exReps.value = '';
    exSets.value = '';
    exWeight.value = '';
    exComments.value ='';
}

async function takeRows(e) {

    let sessionFound = await fetch('/workouts/sessions/search?_coachId=' + await retrieveCoachId() + '&_clientId=' + retrieveClientId() + '&weekday=' + retrieveDay(), {
        method: 'GET',
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    });
    console.log("SES", sessionFound);
    let sessionx = await sessionFound.json();
    let sessionExercisesToRemove = sessionx.exercises;

    if(sessionFound.status === 200) {

        for(let i = 0; i < sessionExercisesToRemove.length; i++){
            let removeExercise = await fetch('workouts/exercises/delete/' + sessionExercisesToRemove[i], {
                method: 'DELETE',
                headers: {
                    'Content-Type':'Application/json',
                }
            });
            await removeExercise;
        }

        let sessionId = sessionx._id;
        let deleteSession = await fetch('workouts/sessions/delete/' + sessionId, {
            method: 'DELETE',
            headers: {
                'Content-Type':'Application/json',
            }
        });
        await deleteSession;
    }

    let exerciseArray = [];

    let table = document.getElementById("scheduleTable");
    let children = table.childNodes;

    let body;
    for (let i = 0; i < children.length; i++) {
        if (children[i].tagName === 'TR') {
            this.count++;
            if (children[i].id) {
                let exerciseName = children[i].childNodes[0].innerHTML;
                let rep = children[i].childNodes[1].innerHTML;
                let sets = children[i].childNodes[2].innerHTML;
                let weight = children[i].childNodes[3].innerHTML;
                let comment = children[i].childNodes[4].innerHTML;
                body = {
                    name: exerciseName,
                    description: 'description placeholder',
                    repetitions: rep,
                    set: sets,
                    comment: comment,
                    pumpWeight: weight,
                    weightUnit: 'weightUnit placeholder',
                    bodyPart: 'body part placeholder'
                };

                try{
                    console.log("A");
                    let createdExercise = await fetch('/workouts/exercises/new',
                        {
                            method: 'POST',
                            body: JSON.stringify(body),
                            headers: {'Content-Type': 'application/json'}
                        });

                    let exercise = await createdExercise.json();
                    let exId = exercise._id;
                    exerciseArray.push(exId);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
    let bodySession = {
        _coachId: await retrieveCoachId(),
        _clientId: retrieveClientId(),
        weekday: retrieveDay(),
        exercises: exerciseArray
    };

    try {
        console.log("B");
        let res = await fetch("/workouts/sessions/new", {
            method: "POST",
            body: JSON.stringify(bodySession),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        await res.json();

    }catch(e) {
        console.log(e);
    }
}

// //-----------  SESSION CREATION AND SCHEDULE UPDATING----------------------------------------
// //Creates a new Session taking the exercises of the previous function, push them into an array of exercises and
// //In schedule pushes into the array of sessions the newly created session
async function saveInSessionAndSchedule(array){

    let day_btn = document.getElementById("day_btn");
    let day = day_btn.options[day_btn.selectedIndex].text;

    let client_btn = document.getElementById("pickUser");
    let client_id = client_btn.options[client_btn.selectedIndex].getAttribute("value");

    let sess = {
        _coachId: await retrieveCoachId(),
        _clientId: client_id,
        weekday: day,
        exercises: array
    };
    try {
            console.log("C");
            let res = await fetch("/workouts/sessions/new", {
                method: "POST",
                body: JSON.stringify(sess),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            let fields = await res.json();
            let sArray = schedFields.sessions;  //puts the new session id into existing schedule
            let s_id = schedFields._id;
            sArray.push(fields._id);

        }catch(err){
        console.log(err);
    }
}

function removeRow(){
    let toRemove = this.parentNode;
    removeSingleExerciseFromDatabase(toRemove.id);
    console.log('Looking for the exercise to remove...');
    toRemove.parentNode.removeChild(toRemove);
}