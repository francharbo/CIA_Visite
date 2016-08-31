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
			var dateDeb;
			var dateFin;
			var date;
			if (model.DateDebut !== "") {
				date = model.DateDebut.split("/");
				dateDeb = new Date(date[2], date[1], date[0]);
			}
			if (model.DateFin !== "") {
				date = model.DateFin.split("/");
				dateFin = new Date(date[2], date[1], date[0]);
			}
			
			model.Suivi = this.buildSuivi(dateDeb, dateFin, model.Frequence);
			model.nombreOccurences = model.Suivi.length;
			this.getOwnerComponent().getModel("Visite").setProperty("/Visites/" + this.visite + "/Risque/" + this.Id + "/Action/" + this.actionId, model);
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
		},
		
		buildSuivi: function(startDate, endDate, freq) {
			var suivi = [{Date: startDate.toLocaleDateString(), "icon": "sap-icon://message-error"}];
			var date = startDate;
			switch(freq) {
				case "Immédiat":
					break;
				case "Journalier":
					while(date < endDate) {
						date = new Date(date.getTime() + 24*60*60*1000);
						if (date.getDay() !== 0 && date.getDay() !== 6) {
							suivi.push({Date: date.toLocaleDateString(), "icon": "sap-icon://message-error"});
						}
					}
					break;
				case "Hebdomadaire":
					while(date < endDate) {
						date = new Date(date.getTime() + 7*24*60*60*1000);
						suivi.push({Date: date.toLocaleDateString(), "icon": "sap-icon://message-error"});
					}
					break;
				case "Mensuel":
					while(date < endDate) {
						date.setMonth(date.getMonth() + 1);
						if (date.getDay() === 0) {
							date.setDate(date.getDate() + 1);
						} 
						else if(date.getDay() === 6) {
							date.setDate(date.getDate() - 1);
						}
						suivi.push({Date: date.toLocaleDateString(), "icon": "sap-icon://message-error"});
					}
					break;
			}
			
			return suivi;
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