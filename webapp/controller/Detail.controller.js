/*global location */
sap.ui.define([
	"fr/ar/cia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"fr/ar/cia/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";
	var that;
	return BaseController.extend("fr.ar.cia.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			// var oViewModel = new JSONModel({
			// 	busy : false,
			// 	delay : 0
			// });
			that = this;
			this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

			//	this.setModel(oViewModel, "detailView");
			//this.setModel(this.getOwnerComponent().getModel("Visite"));
			//	this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = this.getModel("detailView");

			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			this.Id = oEvent.getParameter("arguments").Id;
			var json = JSON.stringify(this.getOwnerComponent().getModel("Visite").oData.Visites[this.Id]);
			var data = new sap.ui.model.json.JSONModel();
			data.setData(JSON.parse(json));
			/*his.getView().bindElement({
				path:"/Visites/" + Id,
				model:"Visites"
			});*/
			this.getView().setModel(data);
			this.getView().invalidate();
		},
		onEdit: function() {
			this.getRouter().navTo("detailEdit", {
				Id: this.Id
			});
		},
		onAfterRendering: function() {
			if (typeof this.Id !== "undefined") {
				var tab = this.getView().byId("iconTabBarFilter3");
				var model = this.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + this.Id);
				tab.setCount(model.BP.length);
				tab = this.getView().byId("iconTabBarFilter2");
				tab.setCount(model.Risque.length);
			}
			var header = this.getView().byId("header");
			var logo = this.getView().byId("logoVSD");

			logo.setHeight(header.$().height() + "px");

		},
		onPrint: function() {
			var i;
			var header = '<center><h3> Rapport VSD </h3></center><hr><br>';
			var data = this.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + this.Id);

			var participant = '<h2>Participants</h2><hr><br>' +
				"<table width='50%'><tr><td> Pilote </td><td>" + data.Pilote.Prenom + ' ' + data.Pilote.Nom + '</td></tr>' +
				'<tr><td> Copilote </td><td>' + data.Copilote.Prenom + ' ' + data.Copilote.Nom + '</td></tr>' +
				'<tr><td> Particpant </td><td>' + data.Participant + '</td></tr></table><br>';

			var details = '<h2>Details de la visite </h2><hr>' +
				"<table width='50%'><tr><td> Date </td><td>" + data.Date + '</td></tr>' +
				'<tr><td> Site </td><td>' + data.Site.Nom + '</td></tr>' +
				'<tr><td> Secteur </td><td>' + data.Secteur.Nom + '</td></tr>' +
				'<tr><td> Theme </td><td>' + data.Theme.Description + '</td></tr>' +
				'<tr><td> Evaluation </td><td>' + data.Rating + '</td></tr></table><br>';

			var Bp = '<h2>Best Practices</h2><hr><br>' +
				"<table style='border-collapse: collapse;border: 1px solid black;' width='95%'><tr>" +
				"<th style='border: 1px solid black;'>Id</th><th style='border: 1px solid black;'>Description</th><th style='border: 1px solid black;'>A partager</th></tr>";
			for (var i in data.BP) {
				Bp += "<tr><td style='border: 1px solid black;'>" + data.BP[i].ID + "</td><td style='border: 1px solid black;'>" + data.BP[i].Description +
					"</td><td style='border: 1px solid black;'>" + data.BP[i].A_partager + "</td></tr>";
			}
			Bp += "</table><br>";

			var Risque = "<h2>Risques</h2><hr><br>" +
				"<table style='border-collapse: collapse;border: 1px solid black;' width='95%'>" +
				"<tr><th style='border: 1px solid black;'>Id</th><th style='border: 1px solid black;'>Pratique a Risque</th> " +
				"<th style='border: 1px solid black;'>Situation a risque</th></tr>";
			for (var i in data.Risque) {
				Risque += "<tr><td style='border: 1px solid black;'>" + data.Risque[i].ID + "</td><td style='border: 1px solid black;'>" + data.Risque[
						i].Pratique_a_risque +
					"</td><td style='border: 1px solid black;'>" + data.Risque[i].Situation_a_risque + "</td></tr>";
			}
			Risque += "</table>";

			var wind = window.open("", "PrintWindow");

			wind.document.write(header + participant + details + Bp + Risque);
			wind.print();
			wind.close();
		},

		BPDetails: function(oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
			var id = oCtx.getPath().substring(oCtx.getPath().lastIndexOf("/") + 1);
			this.getRouter().navTo("bpdetail", {
				BPId: id,
				visiteId: this.Id
			});
		},
		RisqueDetails: function(oEvent) {
			var oItem, oCtx, id;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
			id = oCtx.getPath().substring(oCtx.getPath().lastIndexOf("/") + 1);
			this.getRouter().navTo("risquedetail", {
				RisqueId: id,
				visiteId: this.Id

			});
		},

		addBP: function(oEvent) {
			var modelBP = that.getOwnerComponent().getModel("Visite").getProperty("/Visites/" + this.Id);

		},

		addRisque: function() {

		}

	});

});