async function getExercises(userId) {
    try {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        let session = await fetch("/workouts/sessions/search?_clientId=" + userId, {
            method: 'GET',
            headers: headers,
        });
        session = await session.json();

        let exercises;
        let exercise;
        for (let i = 0; i > session.exercises.length; i++) {
            exercise = await fetch("/workouts/sessions/exercises?_id=" + session.exercises[i], {
                method: 'GET',
                headers: headers,
            });
            exercise = await exercise.json();
            exercises.push(exercise);
        }
        debugger

        dust.render("dashboard_partials\/schedule_table_row",
            {session: session.exercises}, (err, out) =>
                document.getElementById('scheduleTable').innerHTML = out);
    } catch (err) {
        console.log(err);
    }
}

getExercises(localStorage.userAccountId);
