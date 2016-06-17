sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";
var beforechange;
	return BaseController.extend("fr.ar.cia.controller.ActionEdit", {
		
		onInit: function() {

			this.getRouter().getRoute("actionEdit").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			var Id = oEvent.getParameter("arguments").RisqueId;
			this.Id = Id;
			var visite = oEvent.getParameter("arguments").visiteId;
			this.visite = visite;
			var actionId = oEvent.getParameter("arguments").actionId;
			this.actionId = actionId;
			this.getView().bindElement({
				path: "/Visites/" + visite + "/Risque/" + Id + "/Action/" + actionId,
				model: "Visite"
			});
			this.getView().bindElement({
				path : "/",
				model:"Listes"
			});
			beforechange = jQuery.extend(true,{},this.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + visite + "/Risque/" + Id + "/Action/" + actionId));
			this.getView().invalidate();
		},
		onAfterRendering: function() {
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");

			logo.setHeight(header.$().height() + "px");
		},
		onValidate:function(){
			var model = this.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + this.visite + "/Risque/" + this.Id + "/Action/" + this.actionId);
			if(beforechange.nombreOccurences !== model.nombreOccurences){
				var suivi = [];
				for(var i = 0; i < model.nombreOccurences; i++){
					suivi[i] = "sap-icon://message-error";
				}
				model.Suivi = suivi;
			}
			this.getOwnerComponent().getModel("Visite").setProperty("/Visites/" + this.visite + "/Risque/" + this.Id + "/Action/" + this.actionId + "/Suivi",model);
			this.getRouter().navTo("risquedetail",{
				visiteId: this.visite,
				RisqueId: this.Id
			});
		},
		onCancel:function(){
			this.getOwnerComponent().getModel("Visite").setProperty("/Visites/" + this.visite + 
			"/Risque/" + this.Id + "/Action/" + this.actionId, beforechange);
			this.getRouter().navTo("risquedetail",{
				visiteId: this.visite,
				RisqueId: this.Id
			});
		}
		
	});

});