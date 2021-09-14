

function displayFastSubject(badUrl) {
    //
    // we get a URL in the form
    // http://id.worldcat.org/fast/2029022
    // we convert it into
    // https://experimental.worldcat.org/fast/2029022
    //
    // NOTE: use "HTTPS" to avoid blocked mixed content errors
    // see: https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content

    // returns the replacement, doesn't change the original string
    let subjectUrl = badUrl.replace("http:\/\/id\.worldcat\.org", "http://experimental.worldcat.org");

    //
    // and for now just display it
    //alert("The correct link is: " + subjectUrl);

    //
    // can we make this go to an iframe??
    //window.location.href = subjectUrl;
    var iframe = document.getElementById('subjectDetail');
    iframe.src = subjectUrl;

    //
    // get the data using AJAX

    //
    // convert it using XSLT

    //
    // insert it into the document

}