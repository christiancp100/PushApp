/* Fetch */

/*
* Auxiliar functions
*/

function checkMethod(method, body) {
    switch (method.toUpperCase()) {
        case "GET":
        case "DELETE":
        case "OPTIONS":
        case "HEAD":
            return typeof body == "undefined";
        case "POST":
        case "PATCH":
        case "PUT":
            return typeof body == "string";
        default:
            return false;
    }
}

function checkJSON(headers, method, body) {
    if (
        (headers["Content-Type"] &&
            headers["Content-Type"] !== "application/json") ||
        (headers["Accept"] && headers["Accept"] !== "application/json")
    ) {
        return false;
    }

    if (typeof body != "undefined" && typeof body != "object" && !Array.isArray(body)) {
        return false;
    }
    return true;
}

/**
 * @function doFetchRequest
 * @param {String} method The method of the Fetch request. One of: "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
 * @param {String} url The url of the API to call, optionally with parameters.
 * @param {Object} headers The Associative Array containing the Request Headers. It must be undefined if there are no headers.
 * @param {String} body The body String to be sent to the server. It must be undefined if there is no body.
 * @returns {Promise} which receives the HTTP response.
 */
function doFetchRequest(method, url, headers, body) {
    if (checkMethod(method, body)) {
        return fetch(url, {
            method: method,
            headers: headers,
            body: body
        });
    } else {
        throw "Error";
    }
}

/** @function doJSONRequest
 * @param {String} method The method of the Fetch request. One of: "GET", "POST", "PUT", "DELETE".
 * @param {String} url The url of the API to call, optionally with parameters.
 * @param {Object} headers The Associative Array containing the Request Headers. It must be undefined if there are no headers.
 * @param {Object} body The object to be sent as JSON body to the server. It must be undefined if there is no body.
 * @returns {Promise} which receives directly the object parsed from the response JSON.
 */
function doJSONRequest(method, url, headers, body) {
    return doFetchRequest(
        method,
        url,
        headers,
        JSON.stringify(body)
    ).then(result => result.json());
}


function getNext(event) {
    event.preventDefault();
    let reg1 = document.getElementById("reg-1");
    let reg2 = document.getElementById("reg-2");

    reg1.style.display = "None";
    reg2.style.display = "Block";

    newInput = document.createElement("input");
    newInput.type = "hidden";
    newInput.name = "typeofuser";
    newInput.value = event.target.name;
    reg2.appendChild(newInput);
}

function registerUser(event) {
    console.log("funziona!!!");
    event.preventDefault();
    let reg = document.getElementById("reg-2");
    console.log(reg.childNodes);

    let body = {
      email : reg.childNodes[0].value,
      password : reg.childNodes[1].value,
      typeofuser : reg.childNodes[3].value,
    };

    if (reg.childNodes[3].value == "coach") {
      console.log(body);
        fetch("/register-coach", {
            method: 'post',
            headers: {},
            body : JSON.stringify(body)
        })
            .then(res => {
                dust.render(
                    "register_forms/register_3_coach",
                    {},
                    (err, out) => {
                        document.getElementsByTagName("body")[0].innerHTML = out;
                    });
            });
    }
    else if (reg.childNodes[2].name == "client") {
        doJSONRequest(
            "POST",
            "/register-coach",
            { Accept: "application/json" },
            body
        ).then(res => {
            dust.render(
                "register_forms/register_3_client",
                {},
                (err, out) => document.getElementsByTagName("body")[0].innerHTML = out);
        });
    }
}
