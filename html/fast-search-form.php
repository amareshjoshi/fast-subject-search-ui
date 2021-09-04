<!DOCTYPE html>
<html lang="en">
<head>
    <title>FAST SRU Search</title>
    <link rel="stylesheet" href="./css/fast.css"/>
    <style></style>
</head>

<body>
<h1>FAST SRU Search</h1>

<div class="grid-container">
    <div class="grid-item upper">
        <p>First lookup</p>
        <div id="part1">
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <label>
                    Search: <input type="text" name="query"
                               id="query"
                               placeholder="Enter query string"
                value="<?php echo htmlspecialchars($_POST["query"]); ?>">
                </label>
                <br>
                <input type="submit" name="Find FAST">
            </form>
        </div>
    </div>

    <div class="grid-item lower-left">
        <p>Results from first lookup will go here</p>
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

    <div class="grid-item lower-right">
        <p>
            Detailed information on an item when you click on its link on the left
        </p>
    </div>
</div>
</body>
</html>
