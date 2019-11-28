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

