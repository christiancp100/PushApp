getUserId = async () => {
  let obj = await fetch('/auth/getuserinfo');
  obj = await obj.json();
  return obj.userAccountId;
};

// let A = [];
function prettyPrinterDate(src) {
  let partial = '';
  for (let i = 0; i < src.length; i++) {
    let x = src.charAt(i);
    if (x === 'T') {
      return partial;
    } else if (x === '-') {
      x = '/';
      partial += x;
    } else {
      partial += x;
    }
  }
}

searchCoaches = async () => {
  let txt = document.getElementById("last_name").value;
  if (txt === '' || txt === " ") {
    getCoaches();
  }
  let found = await fetch("/coaches/search?accountType=coach&firstName=" + txt);
  let foundArray = await found.json();
  cleanCards();
  await displayCoaches(foundArray);
};

cleanCards = () => {
  let children = document.getElementById("grid").childNodes;
  for (let i = 0; i < children.length; i++) {
    children[i].remove();
  }
};

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
  console.log("Executing this, ", coachesArray);
  await displayCoaches(coachesArray);
}


displayCoachesIndex = async (coachesArray) => {
  coachesArray.forEach(coach => {
    coach.description = coach.description.slice(0, 50) + "...";
    dust.render("partials/coach_card", {coach: coach}, function (err, out) {
      console.log("coach", coach);
      console.log(out);
      document.getElementById("grid").innerHTML += out;
    });
  })
};


displayCoaches_old = async (coachesArray) => {
  coachesArray.forEach(coach => {
    coach.description = coach.description.slice(0, 50) + "...";
    dust.render("dashboard_partials/coach_card_for_list", {coach: coach}, function (err, out) {
      document.getElementById("grid").innerHTML += out;
    });
  });
};

displayCoaches = async (coachesArray) => {
  console.log(coachesArray.length);
  coachesArray.forEach(coach => {
    coach.description = coach.description.slice(0, 30) + "...";
    dust.render("dashboard_partials/coach_card_for_list", {coach: coach}, function (err, out) {
      console.log("out", out);
      console.log(err);
      document.getElementById("grid").innerHTML += out;
    });
  });
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

    let exercises = [];
    if (session !== undefined) {
      session = await session.json();

      for (let i = 0; i < session.exercises.length; i++) {
        let exercise = await fetch("/workouts/exercises/search?id=" + session.exercises[i], {
          method: 'GET',
          headers: headers
        });
        exercise = await exercise.json();
        exercises.push(exercise);
      }
    } else {
      exercises = ['-', '-', '-', '-', '-', '-'];
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
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return weekdays[new Date().getDay()];
}


//getExercises();
