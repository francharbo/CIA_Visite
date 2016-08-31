sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	var dialogFragment = null;

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
			this.getView().bindElement({
				path: "/",
				model: "Listes"
			});
			this.getView().invalidate();
		},
		onAfterRendering: function() {
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");

			logo.setHeight(header.$().height() + "px");
		},

		editRisque: function(oEvent) {
			var oCtxt = oEvent.getSource().getBindingContext("Visite");
			//var model = this.getOwnerComponent().getModel("Visite").getProperty(oCtxt.getPath());

			var idAction = oCtxt.getPath().substring(oCtxt.getPath().lastIndexOf("/") + 1);

			this.getRouter().navTo("actionBPEdit", {
				BPId: this.Id,
				visiteId: this.visite,
				actionId: idAction

			});
		},

		onAddAction: function() {
			this.dialogFragment = sap.ui.xmlfragment("fr.ar.cia.view.fragment.BPAction", this);
			this.dialogFragment.setModel(this.getView().getModel("Listes"));
			// this.getView().addDependent(dialogFragment);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.dialogFragment);
			this.dialogFragment.open();
		},

		onValider: function() {
			var id = sap.ui.getCore().byId("actionId").getValue();
			var desc = sap.ui.getCore().byId("desc").getValue();
			var resp = sap.ui.getCore().byId("resp").getValue();
			var dateDeb = sap.ui.getCore().byId("dateDeb").getValue();
			var dateFin = sap.ui.getCore().byId("dateFin").getValue();
			var freq = sap.ui.getCore().byId("freq").getValue();
			var statut = sap.ui.getCore().byId("statut").getValue();

			if (id === "" || desc === "" || resp === "" || dateDeb === "" || dateFin === "" || freq === "" || statut === "") {
				sap.m.MessageToast.show("Merci de renseigner tous les champs");
			} else {
				// TODO check date
				this.addAction(id, desc, resp, dateDeb, dateFin, freq, statut);
			}
		},

		onAnnuler: function() {
			this.dialogFragment.close();
		},

		onAfterClose: function() {
			this.dialogFragment.destroy();
		},

		addAction: function(id, desc, resp, dateDeb, dateFin, freq, statut) {
			var model = this.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + this.visite + "/BP/" + this.Id);
			model.Action.push({
				"ID": id,
				"Description": desc,
				"DateDebut": dateDeb,
				"DateFin": dateFin,
				"Frequence": freq,
				"Statut": statut,
				"Responsables": resp
			});
			this.getOwnerComponent().getModel("Visite").setProperty("/Visites/" + this.visite + "/BP/" + this.Id, model);
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
			var dateDebLabel = sap.ui.getCore().byId("dateDebLabel");
			var dateDeb = sap.ui.getCore().byId("dateDeb");
			var dateRangeLabel = sap.ui.getCore().byId("dateRangeLabel");
			var dateRange = sap.ui.getCore().byId("dateRange");
			
			if(select === "Immédiat") {
				dateDebLabel.setVisible(true);
				dateDeb.setVisible(true);
				dateRangeLabel.setVisible(false);
				dateRange.setVisible(false);
			} else {
				dateDebLabel.setVisible(false);
				dateDeb.setVisible(false);
				dateRangeLabel.setVisible(true);
				dateRange.setVisible(true);
			}
			
			this.byId("cbbox").setValue(select);
		}
	});

});