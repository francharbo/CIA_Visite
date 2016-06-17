sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("fr.ar.cia.controller.BPDetail", {

		onInit: function() {

			this.getRouter().getRoute("bpdetail").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			this.Id = oEvent.getParameter("arguments").BPId;
			this.visite = oEvent.getParameter("arguments").visiteId;
			this.getView().bindElement({
				path: "/Visites/" + this.visite + "/BP/" + this.Id,
				model: "Visite"
			});
			this.getView().invalidate();
		},
		onAfterRendering: function() {
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");

			logo.setHeight(header.$().height() + "px");
		},
		
		editRisque:function(oEvent){
			var oCtxt = oEvent.getSource().getBindingContext("Visite");
			//var model = this.getOwnerComponent().getModel("Visite").getProperty(oCtxt.getPath());
			
			var idAction = oCtxt.getPath().substring(oCtxt.getPath().lastIndexOf("/") + 1);
			
			this.getRouter().navTo("actionBPEdit",{
				BPId: this.Id,
				visiteId : this.visite,
				actionId: idAction
				
			});
		}
	});

});