jQuery.noConflict();

/*
    javascript in this file controls the html page demonstrating the autosubject functionality

*/

/**************************************************************************************/
/*              Set up and initialization */
/**************************************************************************************/
/*
initial setup - called from onLoad
  attaches the autocomplete function to the search box
*/

var currentSuggestIndexDefault = "suggestall"; //initial default value

function setUpPage() {
  // connect the autoSubject to the input areas
  jQuery("#examplebox").autocomplete({
    source: autoSubjectExample,
    minLength: 1,
    select: function (event, ui) {
      console.log("ui = ", ui);

      jQuery("#exampleXtra").html(
        "<br>" +
        "Related Metadata:<br>" +
        `FAST ID: <span><b>${ui.item.idroot}</b></span><br>` +
        `Facet (type): <span><b>${getTypeFromTag(ui.item.tag)}</b></span><br>` +
        `tag: <span><b>${ui.item.tag}</b></span><br>` +
        `auth: <span><b>${ui.item.auth}</b></span><br>` +
        `type: <span><b>${ui.item.type}</b></span><br>` +
        `raw: <span><b>${ui.item.raw}</b></span><br>` +
        `breaker: <span><b>${ui.item.breaker}</b></span><br>` +
        `indicator: <span><b>${ui.item.indicator}</b></span><br>`
    );
    }, //end select
    _renderItem: function (ul, item) {
      formatSuggest(ul, item);
    },
    // }).data("autocomplete")._renderItem = function (ul, item) {
    //   formatSuggest(ul, item);
  });
} //end setUpPage()

/*  
    example style - simple reformatting
*/
function autoSubjectExample(request, response) {
  currentSuggestIndex = currentSuggestIndexDefault;
  autoSubject(request, response, exampleStyle);
}

/*
  For this example, replace the common subfield break of -- with  /
  */

function exampleStyle(res) {
  return res["auth"].replace("--", "/");
}
