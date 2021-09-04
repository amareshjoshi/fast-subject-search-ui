<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FAST SRU Search</title>
    <style></style>

    <!-- jQuery and select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
          rel="stylesheet"/> 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    
    <!-- local stuff -->
    <link rel="stylesheet" href="./css/fast.css"/>
    <script src="js/fast-autoselect-select2.js"></script>
    <script>
        $( document ).ready(function() {
            selectFAST();
        });
    </script>
</head>

<body>
<h1>FAST SRU Search</h1>

<div class="grid-container">
    <!-- ************************************************************************ -->
    <!-- top section -->
    <div class="grid-item upper">
        <div id="part1">
            <form name="formSRUSearch" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <div>
                    <label>Search for a FAST subject</label>
                    <br>
                    <select
                            class="fast-autosuggest"
                            data-placeholder="FAST subject search"
                            data-allow-clear="1"
                            data-width="75%"    
                    >
                    <!-- data-width="90%" -->
                    </select>
                </div>
                <br>
                <div>
                    <input type="submit" name="Find FAST">
                <div>
            </form>
        </div>
    </div>

    <!-- ************************************************************************ -->
    <!-- bottom left section -->
    <div class="grid-item lower-left">
        <p>List of subjects (with alternate spelling and URLs) will go here</p>
        <div id="part2">
            <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                if($_POST["query"] == "go") {
                    echo("<p>XSLT Rules</p>");
                    $xmlDoc = new DOMDocument();
                    $xmlDoc->load("xml/fast-sru.xml");

                    $xslDoc = new DOMDocument();
                    $xslDoc->load("xml/fast-data-test.xsl");

                    $htmlDoc = new XSLTProcessor();

                    $htmlDoc->importStylesheet($xslDoc);
                    echo $htmlDoc->transformToXML($xmlDoc);
                }
            }
            ?>
        </div>
    </div>

    <!-- ************************************************************************ -->
    <!-- bottom left section -->
    <div class="grid-item lower-right">
        <p>Detailed information on an individual subject</p>
        <div id="part3">
            <div>
            <span id="subjectDetail"></span>
            </div>
        </div>
    </div>
</div>
</body>
</html>
