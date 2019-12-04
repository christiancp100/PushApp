let level = 0;

const table = document.getElementById('scheduleTable');
const rows =  table.querySelectorAll("tr");
const lastRow = table.childNodes[rows.length-1];//The lastRow elements s.t. we can retrieve the content and put it in the table

//last row inputs
let exName = lastRow.querySelectorAll('td input')[0];
let exReps = lastRow.querySelectorAll('td input')[1];
let exSets = lastRow.querySelectorAll('td input')[2];
let exWeight = lastRow.querySelectorAll('td input')[3];
let exComments = lastRow.querySelectorAll('td input')[4];

async function doneScheduleName(){
    let title = document.getElementById("title")
    let scheduleName = retrieveScheduleName();
    let schedName = document.getElementById("schedName");
    schedName.remove();
    // let creatingSchedule =
    let h2 = document.createElement("h2");
    h2.innerHTML = scheduleName;
    h2.id = "title";
    h2.className = "center";

    title.insertAdjacentElement("afterend",h2);
    title.remove();
    console.log(h2);

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
    let string = '<div class="input-field col s6" id="schedName"><input id="last_name" type="text" class="validate" value='+scheduleName+'><label for="last_name">Schedule Name</label><a class="valign-wrapper btn-floating btn-small waves-effect waves-light black" onclick="doneScheduleName()"><i class="material-icons" id="done_outline" >done_outline</i> </a> </div> </div>';
    h2.innerHTML = string;
}
//clicking the add button will call this function that simply creates the row in the table.
function addRow() {


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

    let sessionFields = await sessionFound.json();
    let sessionExercisesToRemove = sessionFields.exercises;

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

        let sessionId = sessionFields._id;
        let deleteSession = await fetch('workouts/sessions/delete/' + sessionId, {
            method: 'DELETE',
            headers: {
                'Content-Type':'Application/json',
            }
        });
        await deleteSession;
    }

    let exerciseArray = [];
    let sessionsArray = [];

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
        sessionsArray.push(await res.json());

    }catch(e) {
        console.log(e);
    }
}

// //-----------  SESSION CREATION AND SCHEDULE UPDATING----------------------------------------
// //Creates a new Session taking the exercises of the previous function, push them into an array of exercises and
// //In schedule pushes into the array of sessions the newly created session
async function saveInSessionAndSchedule(array) {

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

        // await saveSchedule(sessionsArray);
    }catch(err){
        console.log(err);
    }
}
// //-----------  SCHEDULE UPDATING-------------------------------
// //pushes into the array of sessions the newly created session.
// async function saveSchedule(array){
//     let body = {
//         _clientId: retrieveClientId(),
//         _coachId: retrieveCoachId().userAccountId,
//         name: retrieveScheduleName(),
//         sessions:array,
//         startDate: Date.now,
//         endDate: Date.now,
//     };
// }

function removeRow(){
    let toRemove = this.parentNode;
    removeSingleExerciseFromDatabase(toRemove.id);
    console.log('Looking for the exercise to remove...');
    toRemove.parentNode.removeChild(toRemove);
}