
let level = 0;
const mongoose = require('mongoose');
require('./../../models/Exercise');
const Exercise = mongoose.model('Exercise');


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

function removeRow(){
    let toRemove = this.parentNode;
    toRemove.parentNode.removeChild(toRemove);
}

function takeRows(e){
    let table = document.getElementById("scheduleTable");
    let children = table.childNodes;
    for(let i = 0; i <children.length; i++){
        if(children[i].tagName === 'TR'){
            // console.log(children[i], " is a tr for me!");
                    saveInExercise(children[i]);

        }
    }
}
let count = 0;

async function saveInExercise(row){
    this.count++;
    console.log(row.id);
    if(!row.id){
        console.log("NOT VALID");
    }else {
        let exerciseName = row.childNodes[0].innerHTML;
        let rep = row.childNodes[1].innerHTML;
        let sets = row.childNodes[2].innerHTML;
        let weight = row.childNodes[3].innerHTML;
        let comment = row.childNodes[4].innerHTML;

        console.log(exerciseName, rep, sets, weight, comment);

        try{
            let ex = {
                name: exerciseName,
                description: 'description placeholder',
                repetitions: rep,
                set: sets,
                comment: comment,
                pumpWeight: weight,
                weightUnit: 'weightUnit placeholder',
                bodyPart: 'body part placeholder'
            };
            let saved = await fetch(
                '/workouts/exercises/new',
                {method : 'POST',
                    body: JSON.stringify(ex),
                    headers: {'Content-Type':'application/json'}});
            if (saved){
                console.log(saved);
            } else {
                console.log("ERROR");
            }
        } catch (e) {
            console.log(e);
        }

    }
}

function saveInSession(){

}
