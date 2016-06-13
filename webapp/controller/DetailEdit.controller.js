sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("fr.ar.cia.controller.DetailEdit", {

		onInit: function() {
			this.getRouter().getRoute("detailEdit").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.Id = oEvent.getParameter("arguments").Id;

			this.getView().bindElement({
				path: "/Visites/" + this.Id,
				model: "Visite"
			});
		},
		onSave:function(){
			this.getRouter().navTo("detail",{
				Id:this.Id
			});
		},
		onAfterRendering:function(){
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");
			
			logo.setHeight(header.$().height() + "px");
		}

	});
});