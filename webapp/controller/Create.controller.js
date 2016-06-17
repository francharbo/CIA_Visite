sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel, History) {
	"use strict";
	var that;
	return BaseController.extend("fr.ar.cia.controller.Create", {

		onInit: function() {
			//required

			that = this;
			
			
			this.getRouter().getRoute("create").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(){
			var model = this.getOwnerComponent().getModel("Visite").getProperty("/Visites");
			var num = model.length + 1;
			this.Id = "000" + num.toString();
			this.getView().byId("id").setText(this.Id);
			this.getView().setModel(this.getOwnerComponent().getModel("Listes"));
		},
		onValidate: function() {
			var form = this.getView().byId("form").getContent();
			var allValid = true;
			for (var i in form) {
				if (form[i].getValue && typeof form[i].getValue() === "string") {
					var control = form[i];
					that.mandatoryInput(control.getId());
					if (control.getValue() === "" ) {
						allValid = false;
						that.mandatoryInput(control.getId());
					}
				}
			}
			if (allValid) {
				var model = this.getOwnerComponent().getModel("Visite").getProperty("/Visites");
				var date = this.getView().byId("date").getValue();
				var pilote = this.getView().byId("Pilote").getValue();
				var copilote = this.getView().byId("Copilote").getValue();
				var site = this.getView().byId("Site").getValue();
				var secteur = this.getView().byId("Secteur").getValue();
				var theme = this.getView().byId("Theme").getValue();
				var participant = this.getView().byId("Participant").getValue();
				var rating = this.getView().byId("rating").getValue();
				
				model.push({
					"ID": "Avr" + site.substring(0,3) + "-" + this.Id,
					"Date": date,
					"Statut": "Open",
					"Rating": rating,
					"Participant": participant,
					"Theme": {
						"ID": "T001",
						"Description": theme
					},
					"Site": {
						"ID": "P001",
						"Nom": site
					},
					"Secteur": {
						"ID": "I001",
						"Nom": secteur
					},
					"Pilote": {
						"ID": "P001",
						"Nom": pilote.substring(pilote.indexOf(" ") + 1),
						"Prenom": pilote.substring(0,pilote.indexOf(" ") - 1)
					},
					"Copilote": {
						"ID": "P007",
						"Nom": copilote.substring(copilote.indexOf(" ") + 1),
						"Prenom": copilote.substring(0,copilote.indexOf(" ") - 1)
					},
					"Risque": [],
					"BP": []
				});
				this.getOwnerComponent().getModel("Visite").setProperty("/Visites",model);
				var id = model.length - 1;
				this.getRouter().navTo("detail",{
					Id: id
				});
				for (var j in form) {
				if (form[j].getValue && typeof form[j].getValue() === "string") {
					control = form[j];
					control.setValue("");
				}
				else if(form[j].getValue){
					control = form[j];
					control.setValue(0);
				}
			}	
			}
		},
		onCancel: function() {
			that.onNavBack();
		},
		onExit:function(){
			this.getView().destroy();
		},
		mandatoryInput: function(inputId) {
			var input = sap.ui.getCore().byId(inputId).getValue();
			if (input === "") {
				var msg = "Input cannot be empty, please enter an Input";
				sap.ui.getCore().byId(inputId).setValueState(sap.ui.core.ValueState.Error);
				jQuery.sap.require("sap.m.MessageToast");
				sap.m.MessageToast.show(msg, {
					of: this.getView().byId("inputID")
				});
			} else {
				sap.ui.getCore().byId(inputId).setValueState(sap.ui.core.ValueState.None);
			}
		},
		onNavBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();
			//			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Navigate back to FLP home
				// oCrossAppNavigator.toExternal({
				// 	target: {
				// 		shellHash: "#Shell-home"
				// 	}
				// });
			}
		},
		onAfterRendering:function(){
						
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");
			
			logo.setHeight(header.$().height() + "px");
		}
	});

});