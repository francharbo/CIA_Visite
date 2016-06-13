sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("fr.ar.cia.controller.RisqueDetail", {

		onInit: function() {

			this.getRouter().getRoute("risquedetail").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			var Id = oEvent.getParameter("arguments").RisqueId;
			var visite = oEvent.getParameter("arguments").visiteId;
			this.getView().bindElement({
				path: "/Visites/" + visite + "/Risque/" + Id,
				model: "Visite"
			});
			this.getView().invalidate();
		},
		onAfterRendering: function() {
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");

			logo.setHeight(header.$().height() + "px");
		}
	});

});