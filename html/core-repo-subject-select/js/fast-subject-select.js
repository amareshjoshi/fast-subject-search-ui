/**
 *
 * Functions used by Select2 to retrive and format AJAX data
 *
 */

/**
 * description: Calls the main Select2 function
 *              could be used for other side effects if needed
 *              (e.g. modifying other parts of the page)
 *
 * @param - selectID
 */
function selectFAST(selectId){
    var facet =  "suggestall";
    select2Ajax(selectId, facet);
    // do other changes if required
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
    var queryIndices = ",idroot,auth,tag,type,raw,breaker,indicator";
    var subjectDB = "autoSubject";

    $(selectId).select2({
        // multiple: is set from the HTML select field option
        theme: $(this).data('theme'),
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: Boolean($(this).data('allow-clear')),
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
            // we need to use "padded" json (jsonp)
            // using regular json gives a CORS error
            dataType: 'jsonp',
            // not sure what this does?
            jsonp: "json.wrf",
            type: "GET",
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
            /**
             * description: not sure what this does. don't think we need this
             *
             * @param data
             * @param textStatus
             * @param jqXHR
             */
            success: function(data,textStatus, jqXHR){
            },
            /**
             * description: format FAST data into Select2 format
             *
             * @param data data returned by FAST API call
             * @returns {results: array usable by Select2}}
             */
            processResults: function (data) {
                // the docs array from FAST the actual data we need
                var arraySelect2 = data.response.docs;

                /**
                 * function used to modify the raw data from FAST into a Select2 format.
                 * all we need to do is to add a field called ["id"] to the array
                 *
                 * @param value
                 * @param index
                 */
                function convertFastToSelect2(value, index) {
                    var data = value;
                    // Select2 requires a field called ["id"]
                    // ["id"] needs to have all the data we want to save for later use
                    data.id = value["idroot"] + ":" + value["auth"] + ":" + getTypeFromTag(value["tag"]);
                }
                arraySelect2.forEach(convertFastToSelect2);

                return {
                    results: arraySelect2
                };
            },
        },
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
            // alternative text to FAST authorized subject heading
            `<span>${subject[facet][0]}</span> &nbsp;` +
            // authorized FAST subject heading
            `<span>(<b>${subject["auth"]}</b></span> &nbsp;` +
            // facet
            `<span>(<em>${getTypeFromTag(subject["tag"])}</em>))</span>`
            // we'll leave the FAST ID out for now
            //`<span>(${subject["idroot"]})</span>`
        );
        return $subject;

    }

    /**
     *
     * description: Controls what the select field looks like after
     *              the user has made a choice (may be "" (blank)
     *              if you want the select filed to be empty)
     *              It also can be used to do any side affects such as writing to other parts of the page
     * @param subject
     * @returns {string}
     */
    function formatSubjectSelection(subject) {
        if (subject.auth) {
            // what the choosen item will look like in the select field
            var $subject = $(
                // `<span><b>${subject["auth"]}</b></span> &nbsp;` +
                // `<span>(<em>${getTypeFromTag(subject["tag"])}</em>)</span>`
                `<span><b>${subject["auth"]}</b></span> &nbsp;` +
                `<span>(<em>${getTypeFromTag(subject["tag"])}</em>)</span>` // &nbsp;` +
                //`<span><b>${subject["idroot"].slice(3)}</b></span>`
            );
            // we can also alter any part of the page we want
            // var subjectString = `Subject: <span><b>${subject["auth"]}</b></span>, &nbsp;` +
            //     `Facet: <span><b>${getTypeFromTag(subject["tag"])}</b></span>, &nbsp;` +
            //     // trim the "fst" from ID
            //     `ID: <span><b>${subject["idroot"].slice(3)}</b></span><br>`
            // $("#fast-subject-array").append(subjectString);

            return $subject;
        }
        return "Select a FAST subject ..."
    }
}
