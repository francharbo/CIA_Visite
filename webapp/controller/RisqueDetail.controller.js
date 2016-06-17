sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";
var that;
	return BaseController.extend("fr.ar.cia.controller.RisqueDetail", {

		onInit: function() {
			that = this;
			this.suivi = sap.ui.xmlfragment("fr.ar.cia.view.fragment.SuiviPopover",this);
			this.getView().addDependent(this.suivi,this);
			this.getRouter().getRoute("risquedetail").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			this.Id = oEvent.getParameter("arguments").RisqueId;
			this.visite = oEvent.getParameter("arguments").visiteId;
			this.getView().bindElement({
				path: "/Visites/" + this.visite + "/Risque/" + this.Id,
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
			
			this.getRouter().navTo("actionEdit",{
				RisqueId: this.Id,
				visiteId : this.visite,
				actionId: idAction
				
			});
		},
		suiviPopover:function(oEvent){
			var oCtxt = oEvent.getSource().getBindingContext("Visite");
			
			this.suivi.bindElement({
				path: oCtxt.getPath() ,
				model:"Visite"
			});
			this.suivi.openBy(oEvent.getSource());
		},
		changeIcon:function(oEvent){
			var ctxt = oEvent.getSource().getBindingContext("Visite");
			var model = that.getOwnerComponent().getModel("Visite").getProperty(ctxt.getPath());
			
			if(model.icon === "sap-icon://message-success"){
				model.icon = "sap-icon://message-error";
			}else{
				model.icon = "sap-icon://message-success";
			}
			that.getOwnerComponent().getModel("Visite").setProperty(ctxt.getPath(),model);
		}
		
	});

});