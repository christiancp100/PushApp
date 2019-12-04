
getUserId = async() => {
    let obj = await fetch('/auth/getuserinfo');
    obj = await obj.json();
    return obj.userAccountId;
};
// let A = [];
async function getCoaches(){

    let everyone = await fetch("/coaches/search?accountType=coach");
    let coachesArray = await everyone.json();
    console.log("all coaches: ", coachesArray);
    for(let i = 0; i<coachesArray.length; i++){

        let div = document.getElementById("grid");

        let card = document.createElement("div");
        card.className = "card col-lg-4 col-xs-12";
        div.appendChild(card);

        let img = document.createElement("img");
        img.src= coachesArray[i].photo;
        card.appendChild(img);

        let h2 = document.createElement("h2");
        h2.innerHTML = coachesArray[i].firstName +" "+ coachesArray[i].lastName;
        img.insertAdjacentElement("afterend", h2);

        let p_description = document.createElement("p");
        p_description.innerHTML = coachesArray[i].description;
        h2.insertAdjacentElement("afterend", p_description);

        let p = document.createElement("p");
        p.innerHTML = coachesArray[i].birthday + coachesArray[i].state + coachesArray[i].city;
        p_description.insertAdjacentElement("afterend", p);

    }
}










//
// async function getExercises() {
//     try {
//         let headers = {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         };
//
//         let userId = await fetch("/auth/getuserinfo");
//         userId = await userId.json();
//
//         let session = await fetch("/workouts/sessions/search?_clientId=" + userId.userAccountId + "&weekday=" + getWeekDay(), {
//             method: 'GET',
//             headers: headers,
//         });
//
//         session = await session.json();
//
//         let exercises = [];
//         for (let i = 0; i < session.exercises.length; i++) {
//             let exercise = await fetch("/workouts/exercises/search?id=" + session.exercises[i], {
//                 method: 'GET',
//                 headers: headers
//             });
//             exercise = await exercise.json();
//             exercises.push(exercise);
//         }
//
//         dust.render("dashboard_partials\/schedule_table_row",
//             {exercises: exercises}, (err, out) =>
//                 document.getElementById('scheduleTable').innerHTML = out);
//     } catch (err) {
//         console.log(err);
//     }
// }
//
// function getWeekDay() {
//     const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
//     return weekdays[new Date().getDay()];
// }
//
// getExercises();


