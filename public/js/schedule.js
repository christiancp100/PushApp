let level = 0;
//clicking the add button will call this function that simply creates the row in the table.
function addRow(e) {

    console.log("Adding a row...");

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


    let ex;
    let ex_id;

    for (let i = 0; i < children.length; i++) {
        if (children[i].tagName === 'TR') {
            this.count++;
            if (children[i].id) {
                let exerciseName = children[i].childNodes[0].innerHTML;
                let rep = children[i].childNodes[1].innerHTML;
                let sets = children[i].childNodes[2].innerHTML;
                let weight = children[i].childNodes[3].innerHTML;
                let comment = children[i].childNodes[4].innerHTML;
                try {
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
                        {
                            method: 'POST',
                            body: JSON.stringify(ex),
                            headers: {'Content-Type': 'application/json'}
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

    let exists = await itExistAlready();
    console.log("EXISTS: ", exists);

    if(exists !== 0){

        let day_btn = document.getElementById("day_btn");
        let day = day_btn.options[day_btn.selectedIndex].text;

        let searchUrl = "/workouts/sessions/search?_clientId="+client_id + "&_coachId="+localStorage.userAccountId+"&day="+day;
        let searchInit = {
            'method': 'GET',
            'headers':{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        };

        let searchSession = await fetch(searchUrl, searchInit);

        let session = await searchSession.json();

        let sessionFields = {
            _coachId : localStorage.userAccountId,
            _clientId: client_id,
            exercises: A,
            weekday: day
        };

        let sessionModify = await fetch("/workouts/sessions/edit/"+session._id,
            {
                method: 'PUT',
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify(sessionFields),
            });

        let newSession = await sessionModify.json();
        
        // let scheduleSear = await fetch("/workouts/schedules/search?_coachId="+localStorage.userAccountId+"&_clientId="+client_id, {
        //     method: "GET",
        //     headers: {'Content-Type': 'application/json'},
        //     });
        //
        // let fields = await scheduleSear.json();
        //
        // let SessionArray = fields.sessions;
        //
        // SessionArray.push(newSession._id);
        //
        // let newBodySchedule = {
        //     _coachId : localStorage.userAccountId,
        //     _clientId: client_id,
        //     session: SessionArray,
        // };

        // let schedulePut = await fetch("/workouts/schedules/edit"+fields._id, {method:"PUT", body: newBodySchedule, headers:{"Content-Type":"application/json"},
        // });

    }else{
        let scheduleRes = await fetch("/workouts/schedules/new", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sched)}
        );
        let fields = await scheduleRes.json();
        await saveInSessionAndSchedule(A, fields);
    }
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

async function itExistAlready() {

    let day_btn = document.getElementById("day_btn");
    let day = day_btn.options[day_btn.selectedIndex].text;

    let client_btn = document.getElementById("pickUser");
    let client_id = client_btn.options[client_btn.selectedIndex].getAttribute("value");

    let searchUrl = "/workouts/sessions/search?_clientId="+client_id + "&_coachId="+localStorage.userAccountId+"&day="+day;
    let searchInit = {
        'method': 'GET',
        'headers':{
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    };

    let searchSession = await fetch(searchUrl, searchInit);
    let session = await searchSession.json();

    if(session._id) {
        return session._id;
    }else {
        return 0;
    }

}

function removeRow(){
    let toRemove = this.parentNode;
    removeSingleExerciseFromDatabase(toRemove.id);
    console.log('Looking for the exercise to remove...');
    toRemove.parentNode.removeChild(toRemove);
}
