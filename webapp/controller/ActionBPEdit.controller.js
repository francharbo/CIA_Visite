sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";
var beforechange;
	return BaseController.extend("fr.ar.cia.controller.ActionBPEdit", {
		
		onInit: function() {

			this.getRouter().getRoute("actionBPEdit").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			var Id = oEvent.getParameter("arguments").BPId;
			this.Id = Id;
			var visite = oEvent.getParameter("arguments").visiteId;
			this.visite = visite;
			var actionId = oEvent.getParameter("arguments").actionId;
			this.actionId = actionId;
			this.getView().bindElement({
				path: "/Visites/" + visite + "/BP/" + Id + "/Action/" + actionId,
				model: "Visite"
			});
			this.getView().bindElement({
				path : "/",
				model:"Listes"
			});
			beforechange = jQuery.extend(true,{},this.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + visite + "/BP/" + Id + "/Action/" + actionId));
			this.getView().invalidate();
		},
		onAfterRendering: function() {
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");

			logo.setHeight(header.$().height() + "px");
		},
		onValidate:function(){
			this.getRouter().navTo("bpdetail",{
				visiteId: this.visite,
				BPId: this.Id
			});
		},
		onCancel:function(){
			this.getOwnerComponent().getModel("Visite").setProperty("/Visites/" + this.visite + 
			"/BP/" + this.Id + "/Action/" + this.actionId, beforechange);
			this.getRouter().navTo("bpdetail",{
				visiteId: this.visite,
				BPId: this.Id
			});
		},
		
		onSelectionChange: function(oEvent) {
			var select = oEvent.getSource().getValue();
			var responsable = this.byId("responsable");
			var dateFin = this.byId("dateFin");
			
			if(select === "Immédiat") {
				dateFin.setValue("");
				dateFin.setVisible(false);
				responsable.setValue("");
				responsable.setVisible(false);
			} else {
				dateFin.setVisible(true);
				responsable.setVisible(true);
			}
			
			this.byId("cbbox").setValue(select);
		}
		
	});

});