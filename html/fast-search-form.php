<!DOCTYPE html>
<html lang="en">
<head>
    <!--

    TODO: form doesn't work on first load

    TODO: form doesn't work on *some* (few) subsequent loads

    TODO: need to hook up to select again

    -->
    <meta charset="utf-8"/>
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <title>FAST SRU Search</title>

    <!-- jQuery and select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
          rel="stylesheet"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <!-- local stuff -->
    <link rel="stylesheet" href="./css/fast.css"/>
    <script src="./js/fast-autosuggest-select2.js"></script>
    <script src="./js/get-subject-details.js"></script>
    <script>
        $(document).ready(function () {
            selectFAST();
        });
    </script>
</head>

<body>
<?php
if (isset($_SERVER["REQUEST_METHOD"])) {
    echo "<h2>REQUEST METHOD = {$_SERVER["REQUEST_METHOD"]}</h2>";
}

if (isset($_POST["submit"])){
    echo "<h2>POST:SUBMIT = {$_POST["submit"]}</h2>";
}

if (isset($_POST["query"])){
    echo "<h2>POST:QUERY = {$_POST["query"]}</h2>";
}

?>

<?php
$url = "";
$subjectList = "";
$debugStr = "";

//if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])) {
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["submit"]) && isset($_POST["query"])) {
        //echo "<h2>query is set!!!</h2>";
        /**/
        foreach ($_POST as $key => $value) {
            $debugStr .= "<h2>{$key} => {$value}</h2>";
        }
        /**/
        /*
         * get the data from the FAST URL
         */
        //$site = 'https://experimental.worldcat.org/fast/search';
        $site = 'https://fast.oclc.org/fast/search';
        $start_record = 1;
        $sort_key = "usage";
        //
        // these can come from the web form
        //$search_str = "india";
        $search_str = $_POST["query"];
        $data_type = "application/xml";
        $maximum_records = 7;
        $facet = "cql.any";
        //$facet = "oclc.topic";
        //$facet = "oclc.geographic";

        //
        // urlencoding() doesn't work because it replaces "+" and "/" which we want to retain unchanged
        $args = array(
            "query" => $facet . "+all+\"" . $search_str . "\"",
            "httpAccept" => $data_type,
            "maximumRecords" => strval($maximum_records),
            "startRecord" => strval($start_record),
            "sortKey" => $sort_key
        );

        //
        // setup URL
        $url = $site . "?";
        foreach ($args as $name => $value) {
            $url .= $name . '=' . $value . '&';
        }
        // chop off last ampersand
        $url = substr($url, 0, strlen($url) - 1);

        //
        // setup Curl
        $options = array();
        $defaults = array(
            CURLOPT_URL => $url,
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_TIMEOUT => 3
        );

        $ch = curl_init();
        curl_setopt_array($ch, ($options + $defaults));
        if (!$curlResult = curl_exec($ch)) {
            trigger_error(curl_error($ch));
        }
        curl_close($ch);
        /*
         * `xmlns="http...` line in $result needs to be
         * fixed before loading into $xmlDoc=>loadXML(str)
         */

        $fixedCurlResult = str_replace('xmlns="http://www.loc.gov/zing/srw/"',
            'xmlns:srw="http://www.loc.gov/zing/srw/"', $curlResult);


        if ($curlResult) {
            $xmlDoc = new DOMDocument();
            $xmlDoc->loadXML($fixedCurlResult);
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++
            $xslDoc = new DOMDocument();
            $xslDoc->load("./xml/fast-sru.xsl");

            $htmlDoc = new XSLTProcessor();

            $htmlDoc->importStylesheet($xslDoc);
            $subjectList = $htmlDoc->transformToXML($xmlDoc);
        } else {
            $subjectList = "<h3>No results from CURL!! ({$url})</h3>";
        }
    } else {
        $subjectList = "<h3>No query string</h3>";
    }
}
?>

<h1>FAST SRU Search</h1>

<p><a href="../">Return to main page</a></p>

<div class="Zgrid-container">
    <table border="3">
        <!-- ************************************************************************ -->
        <tr>
            <td>
                <!-- top section -->
                <div class="Zgrid-item upper part1">
                    <form method="post"
                          name="formSRUSearch"
                          action="<?php echo htmlspecialchars($_SERVER[ "PHP_SELF" ]); ?>"
                    >
                        <div>
                            <label>Search for a FAST subject</label>
                            <!--
                            <select
                                    name="query"
                                    id="query"
                                    class="fast-autosuggest"
                                    data-placeholder="FAST subject search"
                                    data-allow-clear="1"
                                    data-width="75%"
                            >
                            </select>
                            -->
                            <input type="text" name="query"
                                   value="<?php if(isset($_POST["query"])){echo htmlspecialchars($_POST["query"]);} ?>">
                             <!-- -->
                        </div>
                        <br>
                        <div>
                            <input type="submit" name="submit" Value="submit">
                        </div>
                    </form>
                </div>
            </td>
        </tr>
        <!-- ************************************************************************ -->
        <tr>
            <td>
                <!-- bottom left section -->
                <div class="Zgrid-item lower-left part2">
                    <!-- List of subjects (with alternate spelling and URLs) will go here -->
                    <?php echo $subjectList; ?>
                </div>
            </td>
            <!-- ************************************************************************ -->
            <td>
                <!-- bottom left section -->
                <div class="Zgrid-item lower-right part 3">
                    <p>Detailed information on an individual subject</p>
                    <iframe id="subjectDetail"></iframe>
                </div>
            </td>
        </tr>
    </table>
</div>

<p><a href="../">Return to main page</a></p>
</body>
</html>
