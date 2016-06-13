/*global history */
sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter, History) {
	"use strict";
	var that;
	return BaseController.extend("fr.ar.cia.controller.Master", {

		formatter: formatter,

		onInit: function() {
			that = this;
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
				//var f0 = new Filter("TreeRef", FilterOperator.Contains, sQuery);<ObjectAttribute text="{Action/Date_debut}"/>
				var f1 = new Filter("Copilote/Prenom", FilterOperator.Contains, sQuery);
				var f2 = new Filter("Secteur/Nom", FilterOperator.Contains, sQuery);
				var f3 = new Filter("Pilote/Prenom", FilterOperator.Contains, sQuery);
				var f4 = new Filter("Pilote/Nom", FilterOperator.Contains, sQuery);
				var f5 = new Filter("Copilote/Nom", FilterOperator.Contains, sQuery);
				var f6 = new Filter("Site/Nom", FilterOperator.Contains, sQuery);

				var filters = new Filter([f1, f2, f3, f4, f5, f6]);
			}

			this.byId("list").getBinding("items").filter(filters);
		},
		AddVisite: function() {
			this.getRouter().navTo("create");
			
		},
		onAfterRendering:function(){
			var footer = this.byId("footer");
			var avrilLogo = this.byId("footerLogo");
			avrilLogo.setHeight(footer.$().height() + "px");
			var header = this.byId("header");
			var logoText = this.byId("logoText");
			logoText.setHeight(header.$().height() + "px");
		}

	});

});