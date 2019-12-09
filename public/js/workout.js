let page;
let exercises;

startWorkout = async () => {
  page = document.getElementsByTagName("html")[0];
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  let res = await fetch("/workouts/begin", {method: "GET", headers});
  res = await res.json();

  dust.render("workout", {exercise: res.exercises[0].exercise}, (err, out) =>
      page.innerHTML = out);
  chronoStart();
  exercises = res.exercises.slice(1, res.exercises.length + 1);
};


continueWorkout = () => {
  console.log(exercises);
  if(exercises.length > 1){
    dust.render("workout", {exercise: exercises[0].exercise}, (err, out) =>
      page.innerHTML = out);
    exercises = exercises.slice(1, exercises.length + 1);
  }else{
    dust.render("workout", {exercise: exercises[0].exercise, finish: true}, (err, out) =>
      page.innerHTML = out);
  }
};


stopWorkout = async () => {
  let headers = {
    'Accept': 'text/html',
    'Content-Type': 'application/json'
  };
  let res = await fetch("/workouts/finish-workout", {method: "GET", headers});
  res = await res.text();
  page.innerHTML = res;
};
