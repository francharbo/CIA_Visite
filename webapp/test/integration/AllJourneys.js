jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 PRODUCTSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"fr/ar/cia/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"fr/ar/cia/test/integration/pages/App",
	"fr/ar/cia/test/integration/pages/Browser",
	"fr/ar/cia/test/integration/pages/Master",
	"fr/ar/cia/test/integration/pages/Detail",
	"fr/ar/cia/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "fr.ar.cia.view."
	});

	sap.ui.require([
		"fr/ar/cia/test/integration/MasterJourney",
		"fr/ar/cia/test/integration/NavigationJourney",
		"fr/ar/cia/test/integration/NotFoundJourney",
		"fr/ar/cia/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});
