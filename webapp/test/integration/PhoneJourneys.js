jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"fr/ar/cia/test/integration/NavigationJourneyPhone",
		"fr/ar/cia/test/integration/NotFoundJourneyPhone",
		"fr/ar/cia/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});

