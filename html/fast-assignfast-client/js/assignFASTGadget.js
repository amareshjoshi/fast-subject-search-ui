var $j = jQuery.noConflict(); //I like it clear which package I'm using, don't know why I use the $ at all.
//  note $j.dump(obj) is handy for debug, jquery.dump.js needed

/*
    javascript in this file controls the connection of the autosubject functionality
    to both the html display page and the opensocial gadgets.
     

*/

/**************************************************************************************/
/*              Set up and initialization                                             */
/**************************************************************************************/
/*  

         setUp
			  
      setUp is called from the onLoad for each gadget, or from the
      setUpPage function that performs this and other tasks for the display page.
      
      To build a new type of gadget or to connect the autoSubject to a different
      input area, this function can be replicated or modified.
      
      The displayType = "All" connects the autosubject to all views of the html page.
*/
var currentSuggestIndex = "suggestall"; //initial default value

function setUp(displayType) {
  /*   setup for each search box view */
  if (displayType == "Common" || displayType == "All") {
    //unformatted default - subcoding either ignored or set to --
    var selected = false; //set true if an autocomplete value is selected. If so, highlight that text when autocomplete closes
    $j("#commonTitle").html("Common Formatted FAST Subjects");
    $j("#commonFacetList").html(
      "<label>Limit Results by:</label>" +
        buildSelectLimitList("commonfacetlist", facetList, facetList)
    );
    $j("#commonbox").autocomplete({
      source: autoSubjectCommon,
      minLength: 1,
      select: function (event, ui) {
        $j("#commonXtra").html(
          "FAST ID " + ui.item.idroot + " Type " + getTypeFromTag(ui.item.tag)
        );
        selected = true;
      }, //end select
      open: function (event, ui) {
        selected = false; // reopened menu, reset selected
      }, //end close
      close: function (event, ui) {
        if (selected) this.select();
      }, //end close
      _renderItem: function (ul, item) {
        formatSuggest(ul, item);
      },
    });
    //    .data("autocomplete")._renderItem = function (ul, item) {
    //    formatSuggest(ul, item);
    //  };
    //end autocomplete commonbox
  }
  if (displayType == "Breaker" || displayType == "All") {
    //marcBreaker format
    $j("#breakerTitle").html("marcBreaker formatted FAST subjects");
    $j("#breakerFacetList").html(
      "<label>Limit Results by:</label>" +
        buildSelectLimitList("breakerfacetlist", facetList)
    );
    $j("#breakerbox").autocomplete({
      source: autoSubjectBreaker,
      minLength: 1,
      select: function (event, ui) {
        selected = true;
      },
      open: function (event, ui) {
        selected = false; // reopened menu, reset selected
      }, //end close
      close: function (event, ui) {
        if (selected) this.select();
      }, //end close
      _renderItem: function (ul, item) {
        formatSuggest(ul, item);
      },
    });
    //    .data("autocomplete")._renderItem = function (ul, item) {
    //    formatSuggest(ul, item);
    //  }; //end autocomplete breakerbox
  }
  if (displayType == "Connexion" || displayType == "All") {
    //connexion format
    $j("#connexTitle").html("connexion formatted FAST subjects");
    $j("#connexFacetList").html(
      "<label>Limit Results by:</label>" +
        buildSelectLimitList("connexfacetlist", facetList)
    );
    $j("#connexbox").autocomplete({
      source: autoSubjectConnex,
      minLength: 1,
      select: function (event, ui) {
        $j("#connexXtra").html(
          ui.item.tag + 500 + "  " + ui.item.indicator + "7 "
        );
        selected = true;
      },
      open: function (event, ui) {
        selected = false; // reopened menu, reset selected
      }, //end close
      close: function (event, ui) {
        if (selected) this.select();
      }, //end close
      _renderItem: function (ul, item) {
        formatSuggest(ul, item);
      },
    });
    //    .data("autocomplete")._renderItem = function (ul, item) {
    //    formatSuggest(ul, item);
    //  }; //end autocomplete connexbox
  }
} //end setup()

/*
                 formatSuggest
   
   this is attached to the autocomplete call, and modified the content of the selections
   displayed.  In this case, an alternate heading has the "USE" authorized heading added,
	along with display formatting

*/

function formatSuggest(ul, item) {
  var retValue = '<span style="font-weight: bold;">' + item.auth + "</span>";
  if (item.type == "alt")
    retValue =
      item.label + '<span style="font-style: italic;"> USE </span>' + retValue;
  return $j("<li></li>")
    .data("item.autocomplete", item)
    .append("<a><span style='font-size: 80%'>" + retValue + "</span></a>")
    .appendTo(ul);
  //		.data( "item.autocomplete", item ).append( "<a>" + retValue + "</a>" ).appendTo( ul );
}

/* 
  the autoSubjectXXXX are specific to the search box viewed on the page, or a particular gadget.
  The associated facet select list is checked, and the output style is given
  
  */

/*  
    common style - no reformatting
*/
function autoSubjectCommon(request, response) {
  currentSuggestIndex = $j("#commonfacetlist option:selected").val();
  autoSubject(request, response, commonStyle);
}
/*
    marcbreaker style output
*/
function autoSubjectBreaker(request, response) {
  currentSuggestIndex = $j("#breakerfacetlist option:selected").val();
  autoSubject(request, response, breakerStyle);
}
/*
    connexion style output
*/
function autoSubjectConnex(request, response) {
  currentSuggestIndex = $j("#connexfacetlist option:selected").val();
  autoSubject(request, response, connexStyle);
}

/*
  determines facet type from the tag returned from the autocomplete
*/

function getTypeFromTag(tag) {
  switch (tag) {
    case 100:
      return "Personal Name";
      break;
    case 110:
      return "Corporate Name";
      break;
    case 111:
      return "Meeting";
      break;
    case 130:
      return "Uniform Title";
      break;
    case 147:
      return "Event";
      break;
    case 148:
      return "Period";
      break;
    case 150:
      return "Topic";
      break;
    case 151:
      return "Geographic";
      break;
    case 155:
      return "Form/Genre";
      break;
    default:
      return "unknown";
  }
}
/*
     text and values for the facet Limit dropdown.
     The value are index values for the autoSubject database
 
*/

var facetList = {
  All: "suggestall",
  Topical: "suggest50",
  Geographic: "suggest51",
  "Corporate Name": "suggest10",
  "Event Name": "suggest47",
  Meeting: "suggest11",
  "Personal Name": "suggest00",
  "Uniform Title": "suggest30",
  Form: "suggest55",
  //    "Period": "suggest48"
};

/*
  builds a drop down select list
*/

function buildSelectLimitList(name, list, sclass) {
  //name = used for the html name and id
  //list = object of keys and values for the drop down list
  //sclass = class for formatting, optional
  addclass = "";
  if (sclass != undefined) addclass = 'class="' + sclass + '"';
  var ret = '<select name="' + name + '" id="' + name + '"' + addclass + " >";
  var select = "";
  $j.each(list, function (key, value) {
    ret += '<option  value="' + value + '" >' + key + "</option>";
    select = "";
  });

  return ret + "</select>";
}
/*
    clear the input text area by id 
*/
function clearInput(id) {
  $j("#" + id).val("");
  $j("#" + id).focus();
}
/*
     clear an html area by id, fills with default text
*/
function clearText(id, defaultText) {
  if (defaultText == undefined) defaultText = "";
  $j("#" + id).html(defaultText);
}
