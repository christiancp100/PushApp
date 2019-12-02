


//clicking the add button will call this function that simply creates the row in the table.
function addRow(e) {
    let level = 0;

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
    newExerciseWeight.id = 'exerciseReps' + level;
    newExerciseWeight.innerHTML = exWeight.value;

    let newExerciseComments = document.createElement('td');
    newExerciseComments.id = 'exerciseComments' + level;
    newExerciseComments.innerHTML = exComments.value;

    let newExerciseRemoveInput = document.createElement('input');
    newExerciseRemoveInput.type = 'submit';
    newExerciseRemoveInput.value = '-';
    newExerciseRemoveInput.className = 'btn-floating btn-small waves-effect waves-light black';
    newExerciseRemoveInput.addEventListener('click', removeRow);

    let newExerciseAddInput = document.createElement('input');
    newExerciseRemoveInput.type = 'submit';
    newExerciseRemoveInput.value = '-';
    newExerciseRemoveInput.className = 'btn-floating btn-small waves-effect waves-light black';
    newExerciseRemoveInput.addEventListener('click', removeRow);

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

async function removeRow(){
    let toRemove = this.parentNode;

    // let filter= {
    //     exerciseName : toRemove.childNodes[0].innerHTML,
    //     rep : toRemove.childNodes[1].innerHTML,
    //     sets : toRemove.childNodes[2].innerHTML,
    //     weight : toRemove.childNodes[3].innerHTML,
    //     comment : toRemove.childNodes[4].innerHTML
    // };

    console.log('Looking for the exercise to remove...');
    // try {
    //     let found = await fetch('/workouts/exercises/search', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept':'application/x-www-urlencoded'
    //         },
    //     });
    //     console.log(found);
    // } catch (e) {
    //     console.log(e);
    // }

    toRemove.parentNode.removeChild(toRemove);

}

//-----------  SCHEDULE INIT AND EXERCISE CREATION----------------------------------------
//CREATES new "empty" Schedule and Takes the rows to work with them to create new exercise

async function takeRows(e){

    let A = [];

    let table = document.getElementById("scheduleTable");
    let children = table.childNodes;
    //
    // let scheduleName_btn = document.getElementById("last_name");
    // let scheduleName = scheduleName_btn.options[scheduleName_btn.selectedIndex].text;

    let sched= {
        _coachId: "5de3c7d83fd27d2259009574",
        _clientId: "5de3c7d83fd27d2259009576",
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
    console.log(fields);

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
    console.log(A);
    await saveInSessionAndSchedule(A,fields);
}

//-----------  SESSION CREATION AND SCHEDULE UPDATING----------------------------------------
//Creates a new Session taking the exercises of the previous function, push them into an array of exercises and
//In schedule pushes into the array of sessions the newly created session
async function saveInSessionAndSchedule(array, schedFields){

    let day_btn = document.getElementById("day_btn");
    let day = day_btn.options[day_btn.selectedIndex].text;

    let sess = {
        _coachId: "5de3c7d83fd27d2259009574",
        _clientId: "5de3c7d83fd27d2259009576",
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
        sArray.push(fields._id);

    }catch(err){
        console.log(err);
    }

}
