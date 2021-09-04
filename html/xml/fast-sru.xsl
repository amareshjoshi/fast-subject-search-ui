<!-- <?xml version="1.0" encoding="UTF-8"?> -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:mx="http://www.loc.gov/MARC21/slim" version="1.0">

    <!-- xmlns:srw="http://www.loc.gov/zing/srw/" xmlns="http://www.loc.gov/zing/srw/" xmlns:ns1="http://www.loc.gov/zing/srw/" xmlns:ns2="http://www.loc.gov/zing/srw/" xmlns:ns3="http://www.loc.gov/zing/cql/xcql/" xmlns:ns4="http://www.loc.gov/zing/srw/" xmlns:ns5="http://oclc.org/srw/extraData" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.loc.gov/zing/srw/ http://www.loc.gov/standards/sru/sru1-1archive/xml-files/srw-types.xsd"
-->

    <!-- parameters -->
    <!-- NOTE: parameter values must be quoted if you want strings (and not XPath entries) -->
    <!--
    <xsl:param name="display_header" select="'yes'"/>
    -->
    <!-- output format -->
    <xsl:output method="xml"
                omit-xml-declaration="yes"
                indent="yes"
    />
    <!-- <xsl:strip-space elements="*"/> -->

    <!-- meat and potatoes -->
    <xsl:template match="/">
        <html lang="en">
            <head></head>
            <body>
                <div id="fast-data">

                    <h1>FAST Subjects</h1>

                    <p>
                        <h3>Subject Search List Header</h3>

                        <table border="1">
                            <tr>
                                <td>Number of matches</td>
                                <td>
                                    <xsl:value-of select="searchRetrieveResponse/numberOfRecords"/>
                                </td>
                            </tr>
                            <tr>
                                <td>Version</td>
                                <td>
                                    <xsl:value-of select="searchRetrieveResponse/version"/>
                                </td>
                            </tr>
                        </table>
                        <hr/>
                        <hr/>
                    </p>

                    <!-- -->
                    <div>
                        <!-- <table> -->

                        <xsl:for-each select="searchRetrieveResponse/records/record">

                            <table border="1">
                                <!-- FAST ID -->
                                <tr>
                                    <td>Fast ID</td>
                                    <td>
                                        <xsl:value-of select="recordData/mx:record/mx:controlfield[@tag='001']"/>
                                    </td>
                                </tr>
                                <!-- FAST url -->
                                <tr>
                                    <td>FAST URL</td>
                                    <td>
                                        <!--
                                        PHP only hs XSLT version 1.0
                                        but replace() only available in XSLT 2.0
                                        <xsl:value-of select="replace(
                                        <xsl:value-of select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/>,
                                        'id\.worldcat\.org',
                                        'experimental.worldcat.org')" />
                                         -->
                                        <!-- create an anchor element -->
                                        <xsl:element name="a">
                                            <xsl:attribute name="href">
                                                <xsl:value-of
                                                        select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/>
                                            </xsl:attribute>
                                            <xsl:value-of
                                                    select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/>
                                        </xsl:element>
                                    </td>
                                </tr>
                                <!-- <tr><td>Search String</td><td><xsl:value-of select="recordData/mx:record/mx:datafield[@tag='151']/mx:subfield[@code='a']" /></td></tr> -->
                            </table>
                            <!-- ************************************** -->
                            <div>
                                <em>Details</em>
                                <table border="1">
                                    <!-- "recordData/mx:record/mx:datafield[@tag='*51']/mx:subfield[@code='[a,z]']" -->
                                    <xsl:for-each
                                            select="recordData/mx:record/mx:datafield[@tag='151']/mx:subfield[@code='z']">
                                        <tr>
                                            <td>XML code: tag 151, code z =</td>
                                            <td>
                                                <xsl:value-of select="."/>
                                            </td>
                                        </tr>
                                    </xsl:for-each>
                                    <!-- @tag='451' -->
                                    <xsl:for-each
                                            select="recordData/mx:record/mx:datafield[@tag='451']/mx:subfield[@code='z']">
                                        <tr>
                                            <td>XML code: tag 451, code z =</td>
                                            <td>
                                                <xsl:value-of select="."/>
                                            </td>
                                        </tr>
                                    </xsl:for-each>
                                </table>
                            </div>
                            <!-- ************************************** -->
                            <hr/>
                        </xsl:for-each>
                        <!-- </table> -->
                        <!-- -->
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
