// ==UserScript==
// @name         Synchrony Authorization
// @namespace    http://tampermonkey.net/
// @version      2024-01-02
// @description  try to take over the world!
// @author       You
// @match        https://businesscenter.synchronybusiness.com/portal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synchronybusiness.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @require      file://C:\Users\Accounting\Workspace\monkey\synchrony_authorization_submit.js
// ==/UserScript==


(function() {
    'use strict';

    // possible paths
    var sPath = [];
    sPath[0] = '/portal/authorizationsReport'
    sPath[1] = '/portal/authorizationReportSubmit'
    sPath[2] = '/portal/proceedAuthReportsToTransaction'
    sPath[3] = '/portal/transactionPage1'

    // if pName is not in sPath, return false
    var pName = window.location.pathname
    if (sPath.indexOf(pName) < 0) {
        return false;
    }
    console.log(pName);

    // control handles
    var params;
    var div;
    var input;
    var button;

    if (pName == sPath[0]) {
        // collect get parameters
        params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
            params[key] = value;
        });

        // if params is empty, return false
        if (params == {}) {
            return false;
        }

        // transform the date from yyyy-mm-dd to mm/dd/yyyy
        var parts = params.date.split('-');
        var newParts = [parts[1], parts[2], parts[0]];
        params.date = newParts.join('/');

        // store these params to GM storage
        GM_setValue("cParams", JSON.stringify(params));

        // click this div by class name pull-right edit-search-cla btn-link hideCheckDiv
        div = document.getElementsByClassName("pull-right edit-search-cla btn-link hideCheckDiv")[0];
        div.click();

        // click this div by id customSearch
        div = document.getElementById("customSearch");
        div.click();

        // set the input by id lastName to equal the lastName param
        input = document.getElementById("lastName");
        input.value = params.lastName;

        // set the input by id startDate to equal the date param
        input = document.getElementById("startDate");
        input.value = params.date;

        // set the input by id endDate to equal the date param
        input = document.getElementById("endDate");
        input.value = params.date;

        // click the button with the text "Search"
        button = document.getElementsByClassName("btn btn-block btn-primary")[0];
        button.click();
    } else if (pName == sPath[1]) {
        // click the button with the text "Start Transaction"
        console.log('the user has to click "Start Transaction" manually');
    } else if (pName == sPath[2]) {
        // get the value of input id maskedAccoutNumber
        input = document.getElementById("maskedAccoutNumber");
        var maskedAccoutNumber = input.value;
        // if maskedAccoutNumber is empty, return false
        if (maskedAccoutNumber == "") {
            return false;
        }

        // click the buttong id Forced Purchase
        button = document.getElementById("Forced Purchase");
        button.click();

        // click the button with class btn btn-block btn-primary adaButton
        button = document.getElementsByClassName("btn btn-block btn-primary adaButton")[0];
        button.click();

    } else if (pName == sPath[3]) {
        params = JSON.parse(GM_getValue("cParams"));

        // if params is empty, return false
        if (params == {}) {
            return false;
        }
        
        // set input id patientClientId to param amount
        input = document.getElementById("patientClientId");
        input.value = params.id;

        // focus the input promoCode
        input = document.getElementById("promoCode");
        input.value = params.promo;

    }

})();