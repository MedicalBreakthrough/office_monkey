// ==UserScript==
// @name         DrRec Session
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  try to take over the world!
// @author       You
// @match        https://www.drrecommendations.com/admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrecommendations.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(function() {
    'use strict';
    const current_url = window.location.href;
    const login_url = "https://www.drrecommendations.com/admin/login.php";
    const assigned_url = "https://www.drrecommendations.com/admin/assignedtome.php";
    const session_url = GM_getValue("session_url");
    const no_session_urls = [login_url, assigned_url, "https://www.drrecommendations.com/admin/error.php"]

    // redirect the user to the session_url if the current_url is the login_url
    if (current_url == assigned_url && session_url) {    
        window.location.href = session_url;
    }

    // if current url not in no_session_urls, store it to session_url
    if (no_session_urls.indexOf(current_url) < 0) {
        GM_setValue("session_url", current_url);
    }

})();