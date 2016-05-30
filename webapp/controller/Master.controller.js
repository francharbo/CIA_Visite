/*global history */
sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("fr.ar.cia.controller.Master", {

		formatter: formatter,

		onInit: function() {

			this.setModel(this.getOwnerComponent().getModel("Visite"));
			/*var oList = this.byId("list");
			oList.bindElement("/devis");*/
		},
		onNavBack: function() {
			var sPreviousHash = history.previousHash,
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},
		onSelectionChange: function(oEvent) {
			var oItem = oEvent.getSource();
			var path = oItem.getBindingContext().getPath();
			var Id = path.substr(path.lastIndexOf("/") + 1);
			this.getRouter().navTo("detail", {
				Id: Id
			});
		},
		onSearch: function(oEvent) {
			var sQuery = oEvent.oSource.getValue(); //oEvent.getParameter("query");

			if (sQuery) {
				//var f0 = new Filter("TreeRef", FilterOperator.Contains, sQuery);
				var f1 = new Filter("ID", FilterOperator.Contains, sQuery);
				var f2 = new Filter("DonneurdOrdre", FilterOperator.Contains, sQuery);
				var f3 = new Filter("Site", FilterOperator.Contains, sQuery);

				var filters = new Filter([f1, f2, f3]);
			}

			this.byId("list").getBinding("items").filter(filters);
		}

	});

});