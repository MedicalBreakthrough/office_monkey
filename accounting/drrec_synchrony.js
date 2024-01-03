// ==UserScript==
// @name         DrRec Synchrony
// @namespace    http://tampermonkey.net/
// @version      2024-01-02
// @description  try to take over the world!
// @author       You
// @match        https://www.drrecommendations.com/admin/updateorder.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrecommendations.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @require      file://C:\Users\Accounting\Workspace\monkey\drrec_updateorder.js
// ==/UserScript==

(async function() {
    'use strict';

    const authReg = /Authorization Code\n([0-9]+)\n/;
    const promoReg = /Tran\/Promo Code\n([0-9]+)\s/;

    // function to extract a single regex match from a text string
    function extractCode(text, regex) {
        var match = regex.exec(text);
        return match ? match[1] : null;
    }

    // get the element input with id synchrony_charged
    var scinput = document.getElementById('synchrony_charged');
    // get the bool valut of input
    var value = scinput.checked;
    console.log( "synchrony is " + value);

    // if synchrony is checked , insert a button next to the input
    if (value) {
        var button = document.createElement("input");
        button.value = "Charge Synchrony";
        button.type = "button";
        button.onclick = function() {
            var firstName = document.getElementById('fname').value;
            var lastName = document.getElementById('lname').value;
            var phone = document.getElementById('smobile').value;
            var tdate1 = document.getElementById('transaction_date1').value;
            var tdate2 = document.getElementById('check_deposit').value;
            var date = tdate1 ? tdate1 : tdate2;
            var auth = document.getElementById('transaction_id1').value;
            var amount = document.getElementById('transaction_amount1').value;
            var commissionNotes = document.getElementById('commission_notes').value;

            var promoCode = extractCode(commissionNotes, promoReg);
            var authCode = extractCode(commissionNotes, authReg);


            // collect get parameters
            var params = {
                'firstName': firstName,
                'lastName': lastName,
                'phone': phone,
                'date': date,
                'amount': amount,
                'auth': authCode,
                'promo': promoCode,
            };
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
                params[key] = value;
            });

            // url encode params
            params = Object.keys(params).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
            }).join('&');

            var url = "https://businesscenter.synchronybusiness.com/portal/authorizationsReport?" + params;
            window.open(url, '_blank');

        };
        scinput.parentNode.insertBefore(button, scinput.nextSibling);
    }

})();