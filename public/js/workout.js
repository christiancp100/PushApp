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


giveFeedback = () => {
  let feedbackForm = document.getElementById("feedback-form");
  let form = document.getElementById("feedback-form-form");
  let exerciseId = document.createElement("input");
  exerciseId.type = "hidden";
  exerciseId.name = "exerciseId";
  console.log(exercises[0].exercise);
  exerciseId.value = exercises[0].exercise.id;
  console.log(exerciseId);
  form.appendChild(exerciseId);
  feedbackForm.style.display = "block";
}

closeFeedbackForm = (event) => {
  event.preventDefault();
  let feedbackForm = document.getElementById("feedback-form");
  feedbackForm.style.display = "none";
}

submitFeedback = (event) => {
  event.preventDefault();
  let currentExercise = exercises[0];
}

stopWorkout = async () => {
  let headers = {
    'Accept': 'text/html',
    'Content-Type': 'application/json'
  };
  let res = await fetch("/workouts/finish-workout", {method: "GET", headers});
  res = await res.text();
  page.innerHTML = res;
};
