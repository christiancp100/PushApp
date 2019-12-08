let page;

startWorkout = async () => {
  page = document.getElementsByTagName("html")[0];
  console.log("Start Workout");
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  let res = await fetch("/workouts" , { method: "GET", headers});
  res = await res.json();
  console.log("RESULTADO ", res);
  dust.render("workout",
    {exercises: "exercises"}, (err, out) =>
      page.innerHTML = out);
  chronoStart();

};


stopWorkout = () => {
  dust.render("dashboard_client",
    {}, (err, out) =>
      page.innerHTML = out);
};
