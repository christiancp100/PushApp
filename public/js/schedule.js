let level = 0;
//clicking the add button will call this function that simply creates the row in the table.
function addRow(e) {

    let table = document.getElementById('scheduleTable');
    let rows =  table.querySelectorAll("tr");

    let lastRow = table.childNodes[rows.length-1];//The lastRow elements s.t. we can retrieve the content and put it in the table

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

    // let newExerciseDeleteAllInput = document.createElement('input');
    // newExerciseDeleteAllInput.type = 'submit';
    // newExerciseDeleteAllInput.value = 'cancel';
    // newExerciseRemoveInput.className = 'valign-wrapper btn-floating btn-small waves-effect waves-light black';

    newExerciseRemoveInput.addEventListener('click', removeRow);

    console.log("Adding a row...");

    let icon = document.createElement('i');//just for beauty reason
    icon.className= 'material-icons';
    newExerciseRemoveInput.appendChild(icon);


    table.insertBefore(newExerciseRow, table.childNodes[rows.length-1]);
    newExerciseRow.appendChild(newExerciseName);
    newExerciseRow.appendChild(newExerciseReps);
    newExerciseRow.appendChild(newExerciseSets);
    newExerciseRow.appendChild(newExerciseWeight);
    newExerciseRow.appendChild(newExerciseComments);
    newExerciseRow.appendChild(newExerciseRemoveInput);
    level++;
}

//-----------  SCHEDULE INIT AND EXERCISE CREATION----------------------------------------
//CREATES new "empty" Schedule and Takes the rows to work with them to create new exercise

async function takeRows(e){


    let A = [];

    let table = document.getElementById("scheduleTable");
    let children = table.childNodes;

    let client_btn = document.getElementById("pickUser");
    let client_id = client_btn.options[client_btn.selectedIndex].getAttribute("value");

    let sched= {
        _coachId: localStorage.userAccountId,
        _clientId: client_id,
        name: 'scheduleName placeholder',
        sessions: [],
        startDate: Date.now(),
        endDate: Date.now(),
    };

    let res = await fetch(
        "/workouts/schedules/new", {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(sched)
        }
    );

    let fields = await res.json();

    for(let i = 0; i <children.length; i++){
        if(children[i].tagName === 'TR'){
            // console.log(children[i], " is a tr for me!");
            let ex;
            let ex_id;

            this.count++;

            if(children[i].id){

                let exerciseName = children[i].childNodes[0].innerHTML;
                let rep = children[i].childNodes[1].innerHTML;
                let sets = children[i].childNodes[2].innerHTML;
                let weight = children[i].childNodes[3].innerHTML;
                let comment = children[i].childNodes[4].innerHTML;

                try{
                    ex = {
                        name: exerciseName,
                        description: 'description placeholder',
                        repetitions: rep,
                        set: sets,
                        comment: comment,
                        pumpWeight: weight,
                        weightUnit: 'weightUnit placeholder',
                        bodyPart: 'body part placeholder'
                    };

                    let res = await fetch(
                        '/workouts/exercises/new',
                        {method : 'POST',
                            body: JSON.stringify(ex),
                            headers: {'Content-Type':'application/json'}
                        });

                    let fields = await res.json();
                    ex_id = fields._id;
                    A.push(ex_id);

                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
    await saveInSessionAndSchedule(A,fields);
}

//-----------  SESSION CREATION AND SCHEDULE UPDATING----------------------------------------
//Creates a new Session taking the exercises of the previous function, push them into an array of exercises and
//In schedule pushes into the array of sessions the newly created session
async function saveInSessionAndSchedule(array, schedFields){

    let day_btn = document.getElementById("day_btn");
    let day = day_btn.options[day_btn.selectedIndex].text;

    let client_btn = document.getElementById("pickUser");
    let client_id = client_btn.options[client_btn.selectedIndex].getAttribute("value");

    let sess = {
        _coachId: localStorage.userAccountId,
        _clientId: client_id,
        weekday: day,
        exercises: array
    };

    try {
        let res = await fetch("/workouts/sessions/new", {
            method: "POST",
            body: JSON.stringify(sess),
            headers: {
                'Content-Type':'application/json'
            },
        });

        let fields = await res.json();
        let sArray = schedFields.sessions;  //puts the new session id into existing schedule
        let s_id = schedFields._id;
        sArray.push(fields._id);
        // let response = await fetch('/workouts/schedules/edit/'+ s_id, {method: "PUT",
        //     })
    }catch(err){
        console.log(err);
    }
}

function cancelAll() {
    let table = document.getElementById("scheduleTable");
    let children = table.childNodes;
    console.log(children);
    for (let i = 0; i < children.length; i++) {
        if (children[i].id !== undefined) {
            table.removeChild(children[i]);
        }
    }
}
function removeRow(){
    let toRemove = this.parentNode;
    console.log('Looking for the exercise to remove...');
    toRemove.parentNode.removeChild(toRemove);
}
