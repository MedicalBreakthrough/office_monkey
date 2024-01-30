// ==UserScript==
// @name         DrRec Bug Fixer
// @namespace    http://tampermonkey.net/
// @version      2024-01-04
// @description  try to take over the world!
// @author       You
// @match        https://www.drrecommendations.com/admin/employee-manage-customer-service.php*
// @match        https://www.drrecommendations.com/admin/updateorder.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrecommendations.com
// @grant        none
// ==/UserScript==



(function () {
    'use strict';
    console.log('bugfixer alive');

    

    // function to fix bugs
    function fixBugs() {
        // redirect to the same url but add success=1 to the query string
        window.location.search = window.location.search + '&success=1';
    }
    
    // create a new button
    var btn = document.createElement('button');
    btn.innerHTML = 'Fix Bugs';
    btn.type = 'button';
    btn.addEventListener('click', fixBugs);
    btn.style.border = '1px solid blue';
    btn.style.padding = '10px';
    btn.style['border-radius'] = '10px';
    btn.style.background = 'rgba(45,45,45,.5)';
    btn.style['line-height'] = '10px';
    btn.style['font-weight'] = 'bold';
    btn.style.color = '#fff';

    // get the page from url 
    var page = window.location.pathname.split('/').pop().split('.')[0];

    // switch page
    switch (page) {
        case 'employee-manage-customer-service':
            var mainForm = document.querySelector('div.main_form');
            mainForm.appendChild(btn);
            break;
        case 'updateorder':
            var mainDiv = document.querySelector('div#main');
            mainDiv.appendChild(btn);
            break;
        default:
            break;
    }

})();