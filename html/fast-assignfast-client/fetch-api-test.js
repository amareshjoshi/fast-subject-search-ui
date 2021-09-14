//
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch



var facet = "suggest50";
var queryIndices;
//queryIndices = ",idroot,auth,tag,type,raw,breaker,indicator";
queryIndices = "";
var subjectDB = "assignFAST118";
var urlX =
  "https://fast.oclc.org/searchfast/fastsuggest?" +
  "&query=india&queryIndex=" +
  facet +
  "&queryReturn=" +
  facet +
  queryIndices +
  "&rows=10";
  //"&suggest=" + subjectDB;

var a = {}

url = "http://fast.oclc.org/searchfast/fastsuggest?&query=Japanese%20&queryIndex=suggest50&queryReturn=suggest50%2Cidroot%2Cauth%2Ctag%2Ctype%2Craw%2Cbreaker%2Cindicator&suggest=autoSubject";

console.log(url);
console.log(urlX);
console.log("FOO BAR!!!");


 $.ajax({
    type: "GET",
    url: urlX,
    dataType: 'jsonp',
    jsonp: 'json.wrf',
   success: function (data) {
     console.log("FOO BAR!!!");
     console.log(data);
     /****
      var mr = [];
      var result = data.response.docs;

      for (var i = 0, len = result.length; i < len; i++) {
        var term = result[i][suggestIndex];
        var useValue = "";
        if (responseStyle == undefined) useValue = result[i]["auth"];
        else useValue = responseStyle(result[i]); //responseStyle is a function to format the result to be put into the input box
        //responseStyle functions are below:
        //  breakerStyle - includes special diacritic markings and tags
        //  connexStyle - subdivisions labeled with $b-$z, surrounded by spaces
        //  commonStyle - no modifications, some subdivisions indicated by --

        mr.push({
          label: term, //heading matched on
          value: useValue, //this gets inserted to the search box when an autocomplete is selected,
          idroot: result[i]["idroot"], //the fst number
          auth: result[i]["auth"], //authorized form of the heading, viewable -- format
          tag: result[i]["tag"], //heading tag, 1xx
          type: result[i]["type"], //auth= term is authorized form, alt= term is alternate (see also) form
          raw: result[i]["raw"], //authorized form of the heading, $a-z subdivision form
          breaker: result[i]["breaker"], //authorized form of the heading, marcbreaker coding for diacritics
          indicator: result[i]["indicator"], //heading first indicator
        });
      }
     response(mr);
     ****/
    },
  });
/**********************/
fetch(urlX, {
  method: 'GET',
  mode: 'no-cors', // no-cors, *cors, same-origin
  headers: {
  "Content-Type": 'text/json',
  },
  credentials: "omit",
}).then((response) => {
  response.json();
  console.log(response);
  //console.log(response.json);
});
/**************************/
/*  
  .then((data) => {
  a = data;
  console.log(data);
});
*/

/*
fetch(
  url,
  //"https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits",
  {
    mode: "no-cors", // no-cors, *cors, same-origin
  }
).then((xresponse) => {
  //var b = xresponse.json();
  console.log(xresponse);
  //console.log(b);

});
*/
/*
  .then((commits) => alert(commits[0].author.login));
*/




/******************
//
// response is the HTTP response
// data is the data returned
fetch("http://example.com/movies.json")
  .then(function (response) {
    response.json;
  })
  .then(function (data) {
    console.log(data);
  });


fetch(url, {
  method: "GET", // *GET, POST, PUT, DELETE, etc.
  mode: "no-cors", // no-cors, *cors, same-origin
  //headers: {
  //  "Content-Type": "application/jsonp",
  //  // 'Content-Type': 'application/x-www-form-urlencoded',
  //},
  //body: JSON.stringify(data), // body data type must match "Content-Type" header
})
  .then((data) => console.log(data));


  //   .then((response) => response.json())

  // Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData('https://example.com/answer', { answer: 42 })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });

  ***************************************/
