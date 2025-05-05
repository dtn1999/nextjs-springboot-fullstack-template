# README

Dieses Modul enthält alle Open API Spezifikationen zur Generierung der eigenen Server API und Clients für externeServices. Dafür wird ein Maven Plugin eingesetzt, dass Generatoren für Server- und Clientimplementierungen und aus den Spezifikationen im YAML Format direkt Java Klassen generiert. Die Klassen werden in den `generated-sources` generiert und stehen dann dem Projekt zur Verfügung.

# WARNUNG

Die Konfiguration der Server- und Clientgenerierung ist in mühevoller Trial-and-Error Arbeit ertestet worden, da die Dokumentation zu den Generatoren teilweise dürftig ist (siehe [Github Projekt](url "https://github.com/OpenAPITools/openapi-generator") und [Maven Plugin](url "https://github.com/OpenAPITools/openapi-generator/tree/master/modules/openapi-generator-maven-plugin")). Daher sollten Veränderungen an der Konfiguration nur stattfinden, wenn ein Bewusstsein für die daraus resultierenden Veränderungen besteht!

# Maven Plugin Konfiguration

Die Konfiguration des Plugins wird hier für den Server und für einen Client exemplarisch erklärt. Eine Konfiguration sieht generell folgendermaßen aus (es werden nur die wichtigsten Parameter erklärt):

**Api Gateway Server:**

	<configuration>
	    <inputSpec>${project.basedir}/src/main/resources/api-gateway/plan.R-api-gateway-spec.yaml</inputSpec>
	    <generatorName>jaxrs-jersey</generatorName>
	    <apiPackage>de.convit.planr.openapi.api</apiPackage>
	    <invokerPackage>de.convit.planr.openapi.api</invokerPackage>
	    <modelPackage>de.convit.planr.openapi.model</modelPackage>
	    <generateApiTests>false</generateApiTests>
	    <generateApiDocumentation>false</generateApiDocumentation>
	    <generateModels>true</generateModels>
	    <generateModelDocumentation>false</generateModelDocumentation>
	    <generateModelTests>false</generateModelTests>
	    <generateSupportingFiles>false</generateSupportingFiles>
	    <addCompileSourceRoot>false</addCompileSourceRoot>
	    <generateAliasAsModel>true</generateAliasAsModel>
	    <environmentVariables>
	        <supportingFiles>NotFoundException.java,ApiException.java,ApiResponseMessage.java</supportingFiles>
	    </environmentVariables>
	    <configOptions>
	        <java8>true</java8>
	        <sourceFolder>/</sourceFolder>
	        <serializableModel>true</serializableModel>
	        <implFolder>/</implFolder>
	        <interfaceOnly>true</interfaceOnly>
	        <returnResponse>true</returnResponse>
	    </configOptions>
	</configuration> 


*   **inputSpec** - Hier steht der Pfad zur YAML-Datei aus der der Code generiert werden soll. Der Generator versteht in den Spezifikationen auch Referenzen und kann diese selbstständig folgen, ohne dass hier weitere Dateien angegeben werden müssen.
*   **generatorName** - Der Name der Generator-Implementierung ([hier](url "https://openapi-generator.tech/docs/generators")  findet sich eine Liste für Client und Server Generatornamen)
*   ***Package** - Diese Parameter bestimmen die Paketnamen, wo die einzelnen Klassentypen abgelegt werden (api\* und invoker\* sind die Pakete für Businesslogikklassen, \*Model ist für die Modellklassen)
*   **generate*** - Diese Schalter bestimmen, welche Arten von Klassen generiert werden sollen. Leider schalten diese Parameter auch diverse wichtige Klassen aus bzw. schalten diverse Konfliktklassen ein. Daher ist
*   **generateAliasAsModel** - Immer auf `true` stellen.
*   **environmentVariables** - Enthält zusätzliche Parameter.
*   **supportingFiles** - Hiermit können gezielt weitere Dateien generiert werden, die durch die obigen Schalter deaktiviert wurden. Diese Einstellung ist wichtig für einige Klassen, die nicht generiert wurden, durch die Deaktivierung anderer Konfliktklassen. Also immer, wenn eine generierte Klasse fehlt, gerne mal hier den Namen hinzufügen und schauen, ob sie dann entsteht.
*   **configOptions** - Generator-spezifische Parameter.

** Plan API Client:**

	<configuration>
	    <inputSpec>${project.basedir}/src/main/resources/plan-api/plan.R-plan-api-spec.yaml</inputSpec>
	    <skipValidateSpec>true</skipValidateSpec>
	    <generatorName>java</generatorName>
	    <apiPackage>de.convit.planr.openapi.client</apiPackage>
	    <modelPackage>de.convit.planr.openapi.model</modelPackage>
	    <invokerPackage>de.convit.planr.openapi.client</invokerPackage>
	    <generateApiTests>false</generateApiTests>
	    <generateApiDocumentation>false</generateApiDocumentation>
	    <generateModels>true</generateModels>
	    <generateModelDocumentation>false</generateModelDocumentation>
	    <generateModelTests>false</generateModelTests>
	    <generateSupportingFiles>true</generateSupportingFiles>
	    <addCompileSourceRoot>false</addCompileSourceRoot>
	    <environmentVariables>
	        <supportingFiles>ApiClient.java,Authentication.java,OAuth.java,ApiKeyAuth.java,HttpBasicAuth.java,HttpBearerAuth.java,RFC3339DateFormat.java,Pair.java,ApiException.java,ClientProperties.java,JSON.java,ApiResponse.java,Configuration.java,StringUtil.java</supportingFiles>
	    </environmentVariables>
	    <configOptions>
	        <sourceFolder>/</sourceFolder>
	        <java8>true</java8>
	        <dateLibrary>java8</dateLibrary>
	    </configOptions>
	    <library>jersey2</library>
	</configuration>

Die Konfiguration ist ähnlich zu einer Server-Generierung, allerdings gibt es ein paar wichtige Unterschiede, die beachtet werden müssen:

*   **skipValidateSpec** - Die Validierung der Open API Spezifikation muss ggf. deaktiviert werden, wenn die Spezifikation des Clients zu Fehlern in der Validierung führt. Dies kann bei älteren Spezifikationen der Fall sein. Im Zweifel werden Fehler im Code danach sichtbar, die dann eine generelle Inkompatibilität der Spezifikation und des Generators darstellen.
*   **supportingFiles** - Hier sind andere Dateien außer der Reihe zu generieren, als bei einer Server-Generierung.
*   **configOptions** - Generator-spezifische Parameter, die sich aber vom Server Generator unterscheiden, wie bspw. die zu verwendende Client Bibliothek (hier `jersey2`, da wir im Microservice Framework auch Jersey V2 verwenden).


# Wichtige Anmerkung

Die Generatoren kommen mit Open Api Spezifikationen mit Referenzen auf andere, lokale Spezifikationen klar, d.h. es werden die lokal benachbarten Dateien geladen und deren Schematypen importiert, wenn korrekt (relativ) referenziert. Wir sind im Fall der Server Open API Spezifikation aber davon abgewichen, da es für Clients schwierig bis unmöglich sein kann, verteilte Spezifikationen für eine Client-Generierung zu verwenden. Daher ist die Server Spezifikation (`src/main/resources/api-gateway/plan.R-api-gateway-spec.yaml`) eine Kollage aus allen referenzierten Open API Spezifikationen, d.h. es wurden alle verwendeten Typen, die durch das API Gateway durchgereicht werden, in die Server Spezifikation reinkopiert. Damit ist die Server Spezifikation inhaltlich vollständig und enthält alle Typen. Das bedeutet allerdings auch, dass bei jedem Update einer externen Spezifikation, die neuen Typen daraus händisch übertragen werden müssen! Wenn dies nicht geschieht, wird das zu Fehlern im Code führen, da so am Ende inkompatible Klassen generiert werden. Aufgrund dieser Tatsache finden sich in der Maven POM unter den Plugin Konfigurationen teilweise "unlogische" Konfigurationen, wie dass häufig Pakete für Modellklassen mehrfach verwendet werden oder dass der Server mehrfach generiert wird, um Klassen absichtlich zu überschreiben.

Anmerkung zur Notifications-Spec: die ist nur dafür da, um die Notification-Model Klassen zu erzeugen.