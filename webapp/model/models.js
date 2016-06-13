sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device"
	], function (JSONModel, Device) {
		"use strict";

		return {
			createDeviceModel : function () {
				var oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			createVisiteModel: function() {
				var path = jQuery.sap.getModulePath("fr.ar.cia");
				return new JSONModel([path, "model/Visite.json"].join("/"));
			},
			createListeModel: function() {
				var path = jQuery.sap.getModulePath("fr.ar.cia");
				return new JSONModel([path, "model/Listes.json"].join("/"));
			}
		};

	}
);