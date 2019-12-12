let id = document.getElementById("coach_id").value;
socket.on("notification for " + id, (msg) => {
    console.log(msg);
    let dot = document.getElementById("notification-btn");
    dot.className = "notification";
    let div = document.getElementById("dropdown1");
    dust.render("dashboard_partials/notification", { notification: msg}, (err, out) =>{
      div.innerHTML += out;
    });
});


removeDotNotification = (event) => {
    let dot = document.getElementById("notification-btn");
    dot.className = dot.className.replace("notification", "");
};
