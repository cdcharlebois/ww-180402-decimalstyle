define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/text!DecimalStyle/widget/template/DecimalStyle.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("DecimalStyle.widget.DecimalStyle", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        widgetBase: null,
        // nodes
        beforeNode: null,
        decimalNode: null,
        afterNode: null,
        //modeler
        field: null,
        beforeClassname: null,
        afterClassname: null,
        onClickMicroflow: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        _resetSubscriptions: function() {
            this.unsubscribeAll();
            // add an attribute subscription
            this.subscribe({
                guid: this._contextObj.getGuid(),
                attr: this.field,
                callback: this._updateRendering
            });
            // add object subscription
            this.subscribe({
                guid: this._contextObj.getGuid(),
                callback: this._updateRendering
            });
        },

        _setupEvents: function() {
            // subscribe/listen to the onclick event
            this.connect(this.widgetBase, "onclick", function() {
                // this._runMicroflow(this.onClickMicroflow);
                mx.data.action({
                    params: {
                        applyto: "selection",
                        actionname: this.onClickMicroflow,
                        guids: [this._contextObj.getGuid()]
                    },
                    origin: this.mxform,
                    callback:function(){
                        console.log("microflow ran successfully")
                        // console.log(this);
                        // this._updateRendering();
                    },
                    error: function(error) {
                        alert(error.message);
                    }
                });
            });
        },

        // could be used, but not for now
        _runMicroflow: function(microflowName) {
            mx.data.action({
                params: {
                    applyto: "selection",
                    actionname: microflowName,
                    guids: [this._contextObj.getGuid()]
                },
                origin: this.mxform,
                callback: function(obj) {
                    console.log("microflow ran successfully")
                },
                error: function(error) {
                    alert(error.message);
                }
            });
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            var value = "" + this._contextObj.get(this.field) * 1; // "19.92"
            var splitValues = value.split("."); // ["19", "92"]
            this.beforeNode.innerHTML = splitValues[0]; // "19"
            this.beforeNode.className += " " + this.beforeClassname;
            this.afterNode.innerHTML = splitValues[1]; // "92"
            this.afterNode.className += " " + this.afterClassname;

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DecimalStyle/widget/DecimalStyle"]);
