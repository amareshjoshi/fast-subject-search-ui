/**
 *
 *
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

    //
    // reset the select2
    $(".fast-select-subject").select2("close");

    var facet =  "suggestall";
    //console.log("(just before select2Ajax) facet = ", facet);
    select2Ajax("#deposit-subject-fast", facet);
    // delete metadata text
    jQuery("#metadata-array").html("");
}
/**
 * When a radio button is checked
 * - creates a new select2 list
 * - blanks the metadata
 *
 * @param - selectID
 */
function selectFAST(selectId){
    var facet =  "suggestall";
    //console.log("(inside oncheck Event) facet = ", facet);
    select2Ajax(selectId, facet);
    // delete metadata text
    //jQuery("#metadata-array").html("");
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

/**
 *
 * Takes the ID of a select control and creates and attaches a Select2 object to it.
 * Works with single or multiple selects
 *
 * @param selectId - name of select control
 * @param facet - facet to use
 */
function select2Ajax(selectId, facet) {
    //var metadata;
    var queryIndices = ",idroot,auth,tag,type,raw,breaker,indicator";
    var subjectDB = "autoSubject";

    //console.log("selectId = ", selectId);
    //console.log("facet = ", facet);

    $(selectId).select2({
        //theme: 'bootstrap4',
        theme: $(this).data('theme'),
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: Boolean($(this).data('allow-clear')),
        // multiple: is set from the HTML select field option
        // if multiple is TRUE -> closeOnSelect is FALSE
        //closeOnSelect: !$(this).attr('multiple'),
        closeOnSelect: true,
        dir: $(this).data('dir'),
        disabled: false,
        debug: true,
        delay: 250,
        minimumInputLength: 3,
        maximumSelectionLength: 5,
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

                //console.log("data.response.docs = ", data.response.docs);

                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                // create an array in the select2 format
                var arraySelect2 = {items: []};
                //arrayFast.forEach(fillSelect);

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
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                arrayFast.forEach(simpleSelect);
                // take arrayFast and just add an "id": ??? fied to each element
                function simpleSelect(value, index) {
                    var data = value;
                    //data.id = index;
                    // we are going to have to use all the data we want to save as the "id" field
                    data.id = value["idroot"] + ":" + value["auth"] + ":" + getTypeFromTag(value["tag"]);
                    //
                    // this can probably be simplified (see above function fillSelect())
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
    /**
     * description: this controls the format of the actual drop down list
     *
     * @param subject
     */
    function formatSubject(subject){
        //console.log("inside formatSubject, subject = ", subject);
        if (subject.loading){
            //console.log("subject = ", subject)
            return "subject.loading is not FALSE";
        }
        var $subject = $(
            // ???
            `<span>${subject[facet][0]}</span> &nbsp;` +
            // authorized FAST subject heading
            `<span>(<b>${subject["auth"]}</b></span> &nbsp;` +
            // facet
            `<span>(<em>${getTypeFromTag(subject["tag"])}</em>))</span>`
            //`<span>(${subject["idroot"]})</span>`
        );
        return $subject;

    }

    /**
     *
     * description: controls any side affects such as writing to other parts of the page
     *              also the return value is what the choosen value looks like after
     *              one is picked (may be "")
     * @param subject
     * @returns {string}
     */
    function formatSubjectSelection(subject) {
        if (subject.auth) {
            //console.log("subject = ", subject);
            // we can alter any part of the page outside the SELECT????
            var subjectString = `Subject: <span><b>${subject["auth"]}</b></span>, &nbsp;` +
                `Facet: <span><b>${getTypeFromTag(subject["tag"])}</b></span>, &nbsp;` +
                // trim the "fst" from ID
                `ID: <span><b>${subject["idroot"].slice(3)}</b></span><br>`

            //$("#fast-subject-array").append(subjectString);

            var $subject = $(
                // `<span><b>${subject["auth"]}</b></span> &nbsp;` +
                // `<span>(<em>${getTypeFromTag(subject["tag"])}</em>)</span>`
                `<span><b>${subject["auth"]}</b></span> &nbsp;` +
                `<span>(<em>${getTypeFromTag(subject["tag"])}</em>)</span>` // &nbsp;` +
                //`<span><b>${subject["idroot"].slice(3)}</b></span>`
            );
            return $subject;
        }
        return "Type in a subject ..."
    }

}
