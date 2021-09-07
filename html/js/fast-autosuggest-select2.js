/**
 *
 *
 *
 */

var facet = "suggestall";


/**
 * Resets the form
 * - the radio buttons
 * - the select list in the form
 * - blanks the metadata
 *
 * @param formName
 */
/*
function formReset(formName) {
    // reset the radio buttons
    formName.reset();
    // make "suggestall" the default
    $("#suggestall").prop("checked", true);
    // reset the select2
    $(".js-example-ajax-single").select2("close");
    //-------------------------------------
    // delete metadata text
    //jQuery("#exampleXtra").html("");
    //-------------------------------------
    //
    var facet = $('input[name="facet"]:checked').val();
    select2Ajax(".fast-autosuggest", facet);
}
*/

/**
 * When a radio button is checked
 * - creates a new select2 list
 * - blanks the metadata
 */
function selectFAST() {
    //-------------------------------------
    // delete metadata text
    //jQuery("#exampleXtra").html("");
    //-------------------------------------

    //
    // var facet = $('input[name="facet"]:checked').val();
    select2Ajax(".fast-autosuggest", facet);
}

/**
 *
 * Takes the ID of a select control and creates and attaches a Select2 object to it.
 *
 * @param selectId - name of select control
 * @param facet - facet to use
 */
function select2Ajax(selectId, facet) {

    $(selectId).select2({
        //theme: 'bootstrap4',
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
                return {
                    query: params.term, // search term
                    fl: facet,
                    rows: 5,
                };
            },
            success: function (data, textStatus, jqXHR) {
                // DON't NEED THIS
                // we can just put extra values into the FASTdata structure
                // (besides the required "id" and "text" fields)
            },
            processResults: function (data) {
                //
                // convert the FAST data into a format usable by select2

                // all we need to do is add an {"id": index} field to each
                // of the lements in the array returned by FAST
                //
                // we can then reference any of the fields in the FAST data

                //
                // use the docs array from FAST
                var arrayFast = data.response.docs;
                arrayFast.forEach(simpleSelect);
                //
                // take arrayFast and just add an "id": index field to each element
                function simpleSelect(value, index) {
                    //var foo = value;
                    value.id = index;
                    //
                    // you can add other fields if you want
                    value["mary"] = "jane";
                    value["pi"] = 22.0 / 7.0;
                }
                //-------------------------------------------------------------------------
                return {
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
        // templateResult is usd to format the individual items in the drop down list.
        // we won't see the drop down until this is defined!
        templateResult: formatSubject,
        //
        // templateSelection defines what happens when a selection is made
        // it sets how the selected item looks (formatting, including other data and text, etc.)
        // it can also have code that can affect other parts of the web page
        // e.g. in the example below it sets the content of a tag outside the form
        // *******************************************
        // TODO: what *VALUE* does the select drop down actually get?????
        // *******************************************
        templateSelection: formatSubjectSelection,
    });
    function formatSubject(subject) {
        if (subject.loading) {
            return "subject.loading is not FALSE";
        }
        var $subject = $(`<span>${subject[facet]}</span>`);
        return $subject;
    }
    function formatSubjectSelection(subject) {
        if (subject[facet]) {
            /*
            // we can alter any part of the page we want
            jQuery("#exampleXtra").html(`Choice: <span><b>${subject[facet]}</b></span><br>`);
            */
            var $subject = $(`<span>${subject[facet]}</span>`);
            //return $subject;
            return subject[facet];
        }
        return "Type in a subject ..."

    }

}

//
// eof
//
