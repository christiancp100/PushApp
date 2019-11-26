function takeFields(event) {
    event.preventDefault();
    document.querySelectorAll("input").forEach(element => {
        console.log(element.value);
    });
}