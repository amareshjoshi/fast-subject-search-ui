/**
 *
 * TODO: add header information
 *
 */

/**
 * Resets the form
 * - the radio buttons
 * - the select list in the form
 * - blanks the metadata
 *
 * @param formName
 */
function formReset(formName){
    // reset the radio buttons
    formName.reset();
    // make "suggestall" the default
    $("#suggestall").prop("checked", true);

    //
    // reset the select2
    $(".js-example-ajax-single").select2("close");

    var facet =  $('input[name="facet"]:checked').val();
    //console.log("(just before select2Ajax) facet = ", facet);
    select2Ajax(".js-example-ajax-single", facet);
    // delete metadata text
    jQuery("#exampleXtra").html("");
}
/**
 * When a radio button is checked
 * - creates a new select2 list
 * - blanks the metadata
 */
function selectFAST(){
    var facet =  $('input[name="facet"]:checked').val();
    //console.log("(inside oncheck Event) facet = ", facet);
    select2Ajax(".js-example-ajax-single", facet);
    // delete metadata text
    jQuery("#exampleXtra").html("");
}

/**
 * Returns facet name (e.g. Topic, Meeting, etc.) as a string
 * based on the facet tag (numeric code)
 *
 * @param tag
 * @returns {string}
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


var metadata;
//var facet = "suggestall";
var queryIndices;
queryIndices = ",idroot,auth,tag,type,raw,breaker,indicator";
var subjectDB = "autoSubject";
//queryIndices = "";

/**
 *
 * Takes the ID of a select control and creates and attaches a Select2 object to it.
 * Works with single or multiple selects
 *
 * @param selectId - name of select control
 * @param facet - facet to use
 */
function select2Ajax(selectId, facet) {
    //console.log("selectId = ", selectId);
    //console.log("facet = ", facet);

    $(selectId).select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: Boolean($(this).data('allow-clear')),
        closeOnSelect: !$(this).attr('multiple'),
        disabled: false,
        delay: 250,
        minimumInputLength: 2,
        ajax: {
            url: "https://fast.oclc.org/searchfast/fastsuggest",
            // using 'json' gives a CORS error
            dataType: 'jsonp',
            // not sure what this does?
            jsonp: "json.wrf",
            type: "GET",
            //
            // query parameters
            data: function (params) {
                //console.log(params);
                return {
                    query: params.term, // search term
                    queryIndex: facet,
                    queryReturn: facet + queryIndices,
                    rows: 20,
                    suggest: subjectDB,
                    //page: params.page || 1,
                };
            },
            success: function(data,textStatus, jqXHR){
                // DON't NEED THIS
                // we can just put extra values into the FASTdata structure
                // (besides the required "id" and "text" fields)
                //
                // can we also create an object or array containing metadata to use later?
                // metadata = data.response.docs;
                // {idroot: other_metadata}
                // console.log("inside success call back of ajax!!!");
                // console.log(data.response.docs);

                //
                // then if metadata is global we can use it outside the ajax call

            },
            processResults: function (data) {
                //console.log(data.response.docs);
                // format FAST data into select2 format
                //
                // use the docs array from FAST
                var arrayFast = data.response.docs;
                // TODO: we may want to trim arrayFast to eliminate DUPLICATE IDs (FAST IDs)
                //  OR we could trim the arraySelect2 instead

                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //console.log("data.response.docs = ", data.response.docs);
                //
                // create an array in the select2 format
                var arraySelect2 = {items: []};
                //arrayFast.forEach(fillSelect);
                arrayFast.forEach(simpleSelect);

                //console.log(dataFast)
                function fillSelect(value, index) {
                    //console.log(value[facet][0]);
                    displayText = `Auth = ${value["auth"]}, Typed = ${value[facet][0]},  FASTID = ${value["idroot"]}, Facet =  ${value["tag"]}`;
                    //arraySelect2.items[index] = {"id": index, "text": displayText};
                    //
                    // "id" and "text" are required,
                    // but we can put in extra metadata fields for later use
                    arraySelect2.items[index] = {
                        "id": index,
                        //"text": displayText,
                        "text": value[facet][0],
                        "fastid": value["idroot"],
                        "auth": value["auth"],
                    };
                }

                // take arrayFast and just add an "id": ??? fied to each element
                function simpleSelect(value, index) {
                    var data = value;
                    data.id = index;
                    arraySelect2.items[index] = data;
                }
                //-------------------------------------------------------------------------
                return {
                    //results: arraySelect2.items,
                    results: arrayFast,
                    pagination: {
                        more: false
                    }
                };
            },
            //
            // other ajax stuff???
        },
        //
        // TODO: write these functions
        // **** we won't see the drop down until the formatSubject is defined!!!
        templateResult: formatSubject,
        templateSelection: formatSubjectSelection,
    });
    function formatSubject(subject){
        if (subject.loading){
            //console.log("subject = ", subject)
            return "subject.loading is not FALSE";
        }
        var $subject = $(
            //'<span><img src="https://www.oclc.org/content/dam/oclc/design-images/navigation-logo.png" height="30" /></span><br>' +
            `<span>${subject[facet][0]}</span> &nbsp;` +
            `<span>(<b>${subject["auth"]}</b></span> &nbsp;` +
            `<span>(<em>${getTypeFromTag(subject["tag"])}</em>))</span>`
            //`<span>(${subject["idroot"]})</span>`
        );
        return $subject;

    }
    function formatSubjectSelection(subject) {
        if (subject.auth) {
            //console.log("subject = ", subject);
            // we can alter any part of the page outside the SELECT????
            jQuery("#exampleXtra").html(
                "Related Metadata:<br>" +
                `User entry: <span><b>${subject[facet][0]}</b></span><br>` +
                `FAST official: <span><b>${subject["auth"]}</b></span><br>` +
                `Facet: <span><b>${getTypeFromTag(subject["tag"])}</b></span><br>` +
                // trim the "fst" from ID
                `FAST Identifier: <span><b>${subject["idroot"].slice(3)}</b></span><br>` + ""
                //`tag: <span><b>${subject["tag"]}</b></span><br>` +
                //`type: <span><b>${subject["type"]}</b></span><br>` +
                //`raw: <span><b>${subject["raw"]}</b></span><br>` +
                //`breaker: <span><b>${subject["breaker"]}</b></span><br>` +
                //`indicator: <span><b>${subject["indicator"]}</b></span><br>`
            );

            var $subject = $(
                //'<span><img src="https://www.oclc.org/content/dam/oclc/design-images/navigation-logo.png"  height="20" /></span>' +
                `<span><b>${subject["auth"]}</b></span> &nbsp;` +
                `<span>(<em>${getTypeFromTag(subject["tag"])}</em>)</span>`
            );
            return $subject;
        }
        return "Type in a subject ..."
    }

}


/**
 *
 * Takes the ID of a select that uses a JSON array to fill
 *
 * @param selectId
 * @param data - json array
 */
var select2JSONArray = function (selectId, data) {
    $(selectId).select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: Boolean($(this).data('allow-clear')),
        closeOnSelect: !$(this).attr('multiple'),
        disabled: false,
        data: data,
    });
}
