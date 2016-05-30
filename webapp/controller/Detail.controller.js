/*global location */
sap.ui.define([
		"fr/ar/cia/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"fr/ar/cia/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("fr.ar.cia.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				// var oViewModel = new JSONModel({
				// 	busy : false,
				// 	delay : 0
				// });
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
			onShareEmailPress : function () {
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
			onNavBack : function() {
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
			_onObjectMatched : function (oEvent) {
				var Id =  oEvent.getParameter("arguments").Id;
				var json = JSON.stringify(this.getOwnerComponent().getModel("Visite").oData.Visites[Id]);
				var data = new sap.ui.model.json.JSONModel();
				data.setData(JSON.parse(json));
					/*his.getView().bindElement({
						path:"/Visites/" + Id,
						model:"Visites"
					});*/
				this.getView().setModel(data);
			}

		});

	}
);