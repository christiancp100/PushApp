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
  await displayCoaches(coachesArray);
}

async function getCoachesIndex() {

displayCoaches = async (coachesArray) => {

    console.log(coachesArray);
    for (let i = 0; i < coachesArray.length; i++) {

        let response = await fetch('/coaches/ratings', {
            method : "POST",
            body : JSON.stringify({
                coach: coachesArray[i]
            })
        });
        let res = await response.text();
        console.log(res);
        document.getElementById("grid").innerHTML += res;
    }
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


displayCoaches = async (coachesArray) => {
  coachesArray.forEach(coach => {
    coach.description = coach.description.slice(0, 50) + "...";
    dust.render("dashboard_partials/coach_card_for_list", {coach: coach}, function (err, out) {
      document.getElementById("grid").innerHTML += out;
    });
  });
}

displayCoaches = async (coachesArray) => {
  console.log(coachesArray);
  for (let i = 0; i < coachesArray.length; i++) {
    let res = await fetch('/coaches/ratings', {
      method: "POST",
      body: JSON.stringify({
        id: coachesArray[i]._id
      })
    });
    let rating = await res.json();
    console.log(rating);
    coachesArray[i].description = coachesArray[i].description.slice(0, 50) + "...";
    console.log("coach", coachesArray[i]);
    let coach = coachesArray[i];
    dust.render("dashboard_partials/coach_card_for_list", {coach: coach, media: rating}, function (err, out) {
      console.log("out", out);
      console.log(err);
      document.getElementById("grid").innerHTML += out;
    });
  }
};

displayCoaches_2 = async (coachesArray) => {
  cleanCards();
  for (let i = 0; i < coachesArray.length; i++) {
    let div = document.getElementById("grid");

    let card = document.createElement("div");
    card.className = " card-image-bg col-lg-4 col-xs-12";
    div.appendChild(card);

    let img = document.createElement("img");
    img.src = coachesArray[i].photo;
    card.appendChild(img);

    let h2 = document.createElement("h2");
    h2.innerHTML = coachesArray[i].firstName + " " + coachesArray[i].lastName;
    img.insertAdjacentElement("afterend", h2);

    let p_description = document.createElement("p");
    p_description.innerHTML = coachesArray[i].description + "<br>" + prettyPrinterDate(coachesArray[i].birthday) + "<br>" + coachesArray[i].state + " " + coachesArray[i].city;

    h2.insertAdjacentElement("afterend", p_description);

    let row_div = document.createElement("div");
    if (await checkIfHiredAlready(coachesArray[i]._id) === 0) {
      row_div.className = "row";
      p_description.insertAdjacentElement("afterend", row_div);

      let a = document.createElement("a");
      a.className = 'col-xs-12 col-lg-12 mb-center btn btn--gradient mt-1';
      a.addEventListener("click", async () => {

        //FETCH NEW HIRING
        // let coachId = coachesArray[i]._id;
        // let userId = await getUserId();
        // let body = {
        //     _coachId: coachId,
        //     _clientId: userId
        // // };
        // // let hiring = await fetch("/coaches/hire/new",
        // //     {
        // //         method: "POST",
        // //         body: body,
        // //         headers: {},
        // //     });
      });
      row_div.appendChild(a);
      a.innerHTML = "HIRE ME!";
    } else {
      let a = document.createElement('h1');
      a.innerHTML = "Already Hired";
      h2.appendChild(a);
    }
  }
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

getExercises();
