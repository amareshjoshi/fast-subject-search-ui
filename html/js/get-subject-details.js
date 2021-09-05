

function displayFastSubject(badUrl) {
    //
    // we get a URL in the form
    // http://id.worldcat.org/fast/2029022
    // we convert it into
    // http://experimental.worldcat.org/fast/2029022
    //
    // returns the replacement, doesn't change the original string
    let subjectUrl = badUrl.replace("http:\/\/id\.worldcat\.org", "http://experimental.worldcat.org");

    //
    // and for now just display it
    alert("The correct link is: " + subjectUrl);

    //
    // get the data using AJAX

    //
    // convert it using XSLT

    //
    // insert it into the document

}