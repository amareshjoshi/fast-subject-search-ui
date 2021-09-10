<?xml version="1.0" encoding="UTF-8"?>
<!--
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:mx="http://www.loc.gov/MARC21/slim" version="1.0">
                -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:awol="http://bblfish.net/work/atom-owl/2006-06-06/#"
                xmlns:bio="http://purl.org/vocab/bio/0.1/"
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:dct="http://purl.org/dc/terms/"
                xmlns:dcterms="http://purl.org/dc/terms/"
                xmlns:Explain="http://explain.z3950.org/dtd/2.0/"
                xmlns:foaf="http://xmlns.com/foaf/0.1/"
                xmlns:link="http://purl.org/rss/1.0/modules/link/"
                xmlns:mads="http://www.loc.gov/mads/v2"
                xmlns:mx="http://www.loc.gov/MARC21/slim"
                xmlns:ns3="http://www.loc.gov/zing/cql/xcql/"
                xmlns:owl="http://www.w3.org/2002/07/owl#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
                xmlns:schema="http://schema.org#"
                xmlns:skos="http://www.w3.org/2004/02/skos/core#"
                xmlns:srw="http://www.loc.gov/zing/srw/"
                xmlns:um="http://www.bncf.firenze.sbn.it/unimarc/slim"
                xmlns:v="http://viaf.org/viaf/terms#"
                xmlns:void="http://rdfs.org/ns/void#"
                xmlns:zr="http://explain.z3950.org/dtd/2.0/" version="1.0">

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
        <div id="fast-data">
            <h3>Subject List</h3>
            <p>
                <table border="1">
                    <tr>
                        <td>Number of matches</td>
                        <td>
                            <xsl:value-of select="searchRetrieveResponse/numberOfRecords"/>
                        </td>
                    </tr>
                    <tr>
                        <td>Search Term</td>
                        <td>
                            <xsl:value-of select="searchRetrieveResponse/echoedSearchRetrieveRequest/xQuery/ns3:searchClause/ns3:term"/>
                        </td>
                    </tr>
                    <!--
                    <tr>
                        <td>Version</td>
                        <td>
                            <xsl:value-of select="searchRetrieveResponse/version"/>
                        </td>
                    </tr>
                    -->
                </table>
                <hr/>
                <hr/>
            </p>

            <!-- -->
            <div class="fast-subject-data">
                <!-- <table> -->

                <xsl:for-each select="searchRetrieveResponse/records/record">

                    <ul>
                        <!-- FAST ID -->
                        <!--
                        <li>
                            <p><xsl:value-of select="recordData/mx:record/mx:controlfield[@tag='001']"/></p>
                        </li>
                        -->
                        <!-- FAST url -->
                        <!--
                        <li>
                            <p>URL</p>
                            <p>
                                <xsl:element name="a">
                                    <xsl:attribute name="href">
                                        <xsl:value-of
                                                select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/>
                                    </xsl:attribute>
                                    <xsl:value-of
                                            select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/>
                                </xsl:element>
                            </p>
                        </li>
                        -->
                        <li>
                            <p>
                                <xsl:value-of
                                        select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/>
                            <!-- &nbsp; -->
                            <xsl:text>&#160;</xsl:text>
                                <!--
                                <button type="button" onclick="displayFastSubject(\"Amaresh\")">Details</button>
                                -->
                                <xsl:element name="button">
                                    <xsl:attribute name="type">button</xsl:attribute>
                                    <xsl:attribute name="onclick">
                                        <xsl:text>displayFastSubject("</xsl:text><xsl:value-of
                                            select="recordData/mx:record/mx:datafield[@tag='024']/mx:subfield[@code='a']"/><xsl:text>")</xsl:text>
                                    </xsl:attribute>
                                    Details
                                </xsl:element>
                            </p>
                        </li>
                        <!-- <tr><td>Search String</td><td><xsl:value-of select="recordData/mx:record/mx:datafield[@tag='151']/mx:subfield[@code='a']" /></td></tr> -->
                    </ul>
                    <!-- ************************************** -->
                    <div class="skos-label-list">
                        <!-- SKOS preferred label -->
                        <!-- "recordData/mx:record/mx:datafield[@tag='*51']/mx:subfield[@code='[a,z, x]']" -->
                        <h4>SKOS Preferred Label</h4>
                        <!-- range: 100-199, a + "-" + (not a) -->
                        <ul>
                            <xsl:for-each
                                    select="recordData/mx:record/mx:datafield[@tag >= 100 and @tag &lt;= 199]">
                                <li><xsl:value-of select="mx:subfield[@code='a']"/>
                                <xsl:for-each select="mx:subfield[@code!='a' and @code!='w' and @code!='0']">
                                    <xsl:text> -- </xsl:text><xsl:value-of select="."/>
                                </xsl:for-each>
                                </li>
                            </xsl:for-each>
                        </ul>
                        <!-- ******************************** -->
                        <!-- SKOS alternative label -->
                        <h4>SKOS Alternative Label</h4>
                        <!-- range: 400-599?, a + "-" + (not a) -->
                        <ul>
                            <xsl:for-each
                                    select="recordData/mx:record/mx:datafield[@tag >= 400 and @tag &lt;= 599]">
                                <li><xsl:value-of select="mx:subfield[@code='a']"/>
                                    <xsl:for-each select="mx:subfield[@code!='a' and @code!='w' and @code!='0']">
                                        <xsl:text> -- </xsl:text><xsl:value-of select="."/>
                                    </xsl:for-each>
                                </li>
                            </xsl:for-each>
                        </ul>
                    </div>
                    <!-- ************************************** -->
                    <hr/>
                </xsl:for-each>
                <!-- </table> -->
                <!-- -->
            </div>
            <h3>END of Subject List</h3>
        </div>
    </xsl:template>

</xsl:stylesheet>
