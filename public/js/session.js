async function getExercises() {
    try {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        let userId = await fetch("/auth/getuserinfo");
        userId = await userId.json();

        let session = await fetch("/workouts/sessions/search?_clientId=" + userId.userAccountId + "&weekday=" + getWeekDay(), {
            method: 'GET',
            headers: headers,
        });

        session = await session.json();

        let exercises = [];
        for (let i = 0; i < session.exercises.length; i++) {
            let exercise = await fetch("/workouts/exercises/search?id=" + session.exercises[i], {
                method: 'GET',
                headers: headers
            });
            exercise = await exercise.json();
            exercises.push(exercise);
        }

        dust.render("dashboard_partials\/schedule_table_row",
            {exercises: exercises}, (err, out) =>
                document.getElementById('scheduleTable').innerHTML = out);
    } catch (err) {
        console.log(err);
    }
}

function getWeekDay() {
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return weekdays[new Date().getDay()];
}

getExercises();
