<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Simple FAST Select2 Example</title>

    <!-- jquery and select2 -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <!-- latest version -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"/>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <!-- -->
    <!-- version 4.0.0
    <link href="./js/dist-4.0.0/css/select2.min.css" rel="stylesheet"/>
    <script src="./js/dist-4.0.0/js/select2.min.js"></script>
    -->
    
    <!-- local stuff -->
    <script src="js/fast-subject-select.js"></script>

    <script>
        $(document).ready(function () {
            selectFAST(".fast-subject-ajax");
        });
    </script>
</head>
<body>
<h1>FAST Subject Select with Editing</h1>

<div class="container">
    <?php
    // Removing the redundant HTML characters if any exist.
    function test_input($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    ?>
    <form name="FastSelect" method="POST"
          action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        <div class="form-group">
            <label>FAST Subject Select with Editing</label><br>
            <?php
            //
            // max number of allowed FAST subjects
            $maximumSubjects = 5;
            $fastDataArray = [];
            echo "<ul>";
            // Checking for a POST request
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                //
                // these are the fields from the last search
                foreach ($_POST as $key => $value) {
                    // check if $value is an array and if $key is FAST subject-list
                    if (is_array($value) && $key == "subject-list") {
                        foreach ($value as $index => $data) {
                            array_push($fastDataArray, $data);
                        }
                    }
                }
                //
                // these are the fields from previous search
                // we want to keep track of how many there are
                // so we can limit how many *new* subjects can be added
                foreach ($_POST as $key => $value) {
                    if($value == "on" ) {
                        // that means this is a *checked* check box
                        // the fast data fields are in the *$key* field (the "name" attribute of the checkbox)
                        array_push($fastDataArray, $key);
                    }
                }
                //
                // now $fastDataArray contains *all* the FAST data from previous searches
                //
                //before preceding we want to remove duplicates
                // we also want to limit total subjects to 5
                $minFastDataArray = [];
                foreach ($fastDataArray as $data) {
                    // for some reason spaces get changed to underscores
                    // so we need to change them back
                    $data = str_replace("_", " ", $data);
                    if(!in_array($data, $minFastDataArray)) {
                        array_push($minFastDataArray, $data);
                        $maximumSubjects--;
                    }
                }
                foreach ($minFastDataArray as $data) {
                    $fastData = explode (":", $data);
                    $subjectFacet = "<span><b>${fastData[1]}</b></span> &nbsp; <span>(<em>${fastData[2]}</em>)</span>";
                    // add a delete checkbox
                    $checkBox = "<div>Keep this Subject: &nbsp; " .
                        "<input type=\"checkbox\" name=\"${data}\" checked>" .
                        "&nbsp; &nbsp;" .
                        "<label for=\"${data}\">${subjectFacet}</label></div>";

                    echo "<li>${checkBox}</li>";
                }
                //
                // if the user has already choosen 5 subjects then disable the dropdown
                if($maximumSubjects > 0) {
                    $disableSelect = "false";
                } else {
                    $disableSelect = "true";
                }
            }
            echo "</ul>";
            ?>
            <!-- <br> -->
            <select multiple
                    name="subject-list[]"
                    class="fast-subject-ajax"
                    data-placeholder="Pick a FAST subject heading"
                    data-allow-clear="false"
                    data-width="90%"
                    data-theme="default"
                    data-dir="ltr"
                    data-minimum-input-length="2"
                    data-maximum-selection-length="<?php echo $maximumSubjects;?>"
                    data-close-on-select="true"
                    data-disabled="<?php echo $disableSelect;?>"
                    data-debug="false"
                    data-delay="250"
            >
            </select>
        </div>
        <br>
        <input type="submit" value="Submit">
    </form>

    <!--
    <hr>
    <h3>Debug</h3>
    <ul>
        <?php
        /****************************
        foreach ($_POST as $key => $value) {
            // check if $value is an array
            if(!is_array($value)) {
                $valueType = gettype($value);
                echo "<li>key = {$key}, value = {$value}, value type = {$valueType}</li>";
            } else {
                echo "<li> key = {$key}";
                echo "<ul>";
                foreach ($value as $index => $data) {
                    echo "<li>index = {$index}, data = {$data}</li>";
                }
                echo "</ul>";
                echo "</li>";
            }
        }
        ****************************/
        ?>
    </ul>
    -->

    <br>
    <br>
    <div><a href="index.html">Return to the Index Page</a></div>
</div>

</body>
</html>
