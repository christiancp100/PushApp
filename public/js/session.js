getUserId = async () => {
    let obj = await fetch('/auth/getuserinfo');
    obj = await obj.json();
    return obj.userAccountId;
};

toCamelCase = (text) => {
    let ret = '';
    for (let i = 0; i < text.length; i++) {
        if (i === 0) {
            ret += text.charAt(0).toUpperCase();
        } else {
            ret += text.charAt(i).toLowerCase();
        }
        if (text.charAt(i) === ' ') {
            ret += text.charAt(i + 1).toUpperCase();
            i++;
        }
    }
    return ret;
};

searchCoaches = async () => {
    let nonformatted_txt = document.getElementById("last_name").value;
    let txt = toCamelCase(nonformatted_txt);
    if (txt === '' || txt === " ") {
        await getCoaches();
    }
    let found = await fetch("/coaches/search?accountType=coach&firstName=" + txt);
    let foundArray = await found.json();
    cleanCards();
    await displayCoaches(foundArray);
};

cleanCards = () => {
    let children = document.getElementById("grid").childNodes;
    console.log(children);
    for (let i = 0; i < children.length; i++) {
        children[i].remove();
    }
};


async function renderCoaches() {
    //container of the page
    let container = document.getElementsByClassName("container")[0];
    container.innerHTML = '';

    let div = document.createElement('div');
    div.className = "row";
    div.id = "divtitle";

    container.appendChild(div);
    dust.render("dashboard_partials/coaches", {}, function (err, out) {
        div.innerHTML += out;
        getCoaches();
    });
}

checkIfHiredAlready = async (id) => {
    let getting = await fetch("/coaches/hire/coach/" + id, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    });
    let clientsArray = await getting.json();
    for (let i = 0; i < clientsArray.length; i++) {
        if (clientsArray[i]._clientId.localeCompare("5de65d6c34b8d99f3f2aaf71") === 0) {

            return 1;
        }
    }
    return 0;
};

async function getCoaches() {
    let everyone = await fetch("/coaches/search?accountType=coach");
    let coachesArray = await everyone.json();
    await displayCoaches(coachesArray);
}

displayCoaches = async (coachesArray) => {
    //leave this one
    cleanCards();
    for (let i = 0; i < coachesArray.length; i++) {
        let response = await fetch('/coaches/ratings', {
            method: "POST",
            body: JSON.stringify({
                coach: coachesArray[i]
            })
        });
        let res = await response.text();
        document.getElementById("grid").innerHTML += res;
    }
};

displayCoachesIndex = async (coachesArray) => {
    // cleanCards();
    coachesArray.forEach(coach => {
        coach.description = coach.description.slice(0, 50) + "...";
        dust.render("partials/coach_card", {coach: coach}, function (err, out) {
            document.getElementById("grid").innerHTML += out;
        });
    })
};


// Used in client dashboard
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
        console.log(session)
        let exercises = [];
        if (session !== undefined) {
            let foundSession = await session.json();
            let foundExercises = foundSession.exercises;

            for (let i = 0; i < foundExercises.length; i++) {
                let exercise = await fetch('/workouts/exercises/findById/' + foundExercises[i], {
                    method: 'GET',
                    headers: headers
                });

                exercise = await exercise.json();
                console.log(exercise)
                await exercises.push(exercise);
            }
        } else {
            exercises = ['-', '-', '-', '-', '-', '-', '-'];
        }
        console.log(exercises);

        dust.render("dashboard_partials\/schedule_table_row",
            {exercises: exercises}, (err, out) =>
                document.getElementById('scheduleTable').innerHTML = out);
    } catch (err) {
        console.log(err);
    }
}

function getWeekDay() {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[new Date().getDay()];
}

getExercises();
