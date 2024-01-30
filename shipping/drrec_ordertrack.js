// ==UserScript==
// @name         DrRec Order Tracking
// @namespace    http://tampermonkey.net/
// @version      2024-01-03
// @description  try to take over the world!
// @author       You
// @match        https://www.drrecommendations.com/admin/order-tracking.php?id=*
// @match        https://www.drrecommendations.com/admin/manage-order-new-ver2.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrecommendations.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	console.log('ot alive');

	// carrier urls

	const carrierUrls = {
		'': function (e) { 
			window.alert('No search available for ' + e.target.carrier);
		},
		// 'abf_freight': (e) => window.open('https://arcb.com/tools/tracking.html?' + e.target.cid),
		// 'alg': () => false,
		// 'alliance_freight_and_logistics_inc': 'http://204.93.158.163/WebtrakwtAAFL/ShipInquiry/ShipLookup.aspx?cmp=aafl',
		// 'aloha_freight': (e) => window.open('https://www.alohafreight.com/cgi-bin/fccgi.exe?PRONUM=&w3exec=AFF.ss&w3serverpool=default&WHICH=PRO%23&PRONUM=&w3exec=AFF.ss&w3serverpool=default&WHICH=PRO%23' + e.target.cid),
		// 'c.h._robinson': () => false,
		// 'ontrac': () => false,
		// 'central_freight_lines': () => false,
		// 'central_transport': () => false,
		// 'clearlane_freight_systems': () => false,
		// 'crst_specialized_transportation_inc': () => false,
		// 'csa_transportation': () => false,
		'daylight_transport': (e) => {
			window.open('https://mydaylight.dylt.com/external/shipment?probill=' + e.target.cid)
		},
		// 'dgx': () => false,
		// 'dhe': () => false,
		// 'dhl': () => false,
		// 'dhl_express': () => false,
		// 'dhx': () => false,
		// 'dot-line': () => false,
		'estes': (e) => {
			window.open('https://myestes-api.estes-express.com/shipmenttracking/history?pro=' + e.target.cid)
		},
		// 'exfreight': () => false,
		// 'fedex': () => false,
		// 'fedex_ground': () => false,
		// 'forward_air_corp': () => false,
		// 'frontline_freight': () => false,
		// 'hollywood_delivery_service,_inc.': () => false,
		// 'honolulu_freight': () => false,
		// 'https://www.crst.com/companies/specialized-transportation/': () => false,
		// 'manna': () => false,
		// 'in-house_delivery_&_installation': () => false,
		// 'dgx': () => false,
		// 'crst_specialized_transportation_inc': () => false,
		// 'new_england_motor_freight': () => false,
		// 'oak_harbor_freight_kines': () => false,
		// 'orange_hub': () => false,
		// 'pcx': () => false,
		// 'r_&_l_carriers': () => false,
		// 'reddaway': () => false,
		'road_runner': (e) => window.open('https://tools.rrts.com/LTLTrack/?searchValues=' + e.target.cid),
		'saia': (e) => window.open('https://www.saia.com/track/details;pro=' + e.target.cid),
		// 'fedex': () => false,
		// 'tforce_freight,_upgf': () => false,
		'customs': (e) => window.open('https://api.customco.com/scripts/cgiip.exe/protrace.htm?seskey=&language=&nav=top&wpro=' + e.target.cid),
		// 'total_transportation': () => false,
		// 'ups': () => false,
		// 'usps': () => false,
		// 'vision_express/wrag-time_transportation': () => false,
		// 'xpo_logistics_freight,_inc.': () => false,
		// 'yrc_freight': () => false,
	};
	const carrierKeys = Object.keys(carrierUrls);

	// functions
	// replace underscores and dashes with spaces
	// remove all non-alphanumeric characters
	// capitalize each word
	function cleanName(name) {
		return name.replace(/[_-]/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
	}

	// function to create a button
	function createButton(cid, carrier) {
		var btn = document.createElement('button');
		if (carrierKeys.includes(carrier)) {
			var func = carrierUrls[carrier];
			btn.innerHTML = cleanName(carrier);
		} else {
			var func = carrierUrls[''];
			btn.innerHTML = 'Missing';
		}
		btn.type = 'button';
		btn.cid = cid;
		btn.carrier = carrier;
		btn.addEventListener('click', func);
		btn.style.border = '1px solid blue';
		btn.style.padding = '10px';
		btn.style['border-radius'] = '10px';
		btn.style.background = 'rgba(45,45,45,.5)';
		btn.style['line-height'] = '10px';
		btn.style['font-weight'] = 'bold';
		btn.style.color = '#fff';

		return btn;
	}


	/**
	 * function for order tracking page
	 */
	function orderTracking() {

		const fieldNames = [
			'track_number',
			'old_tracking_2',
			'old_tracking_3',
			'return_tracking_number',
		]		

		// loop through fieldNames and create buttons
		var trackField;
		var carrierField;
		var btn;
		for (var i = 0; i < fieldNames.length; i++) {
			trackField = document.getElementById(fieldNames[i]);
			if (trackField.value == '') {
				continue;
			}
			carrierField = document.getElementById('track_ship_type' + (i > 1 ? i : ''));
			btn = createButton(trackField.value, carrierField.value);
			trackField.parentNode.appendChild(btn);
		}
	}

	/**
	 * function for manage order page
	 */
	function manageOrder() {
		// Select all tr elements within the .table class
		let rows = document.querySelectorAll('.table tr');

		// Iterate over each tr
		rows.forEach((row, index) => {
			// Select the 5th td in each tr
			let shippingTd = row.querySelectorAll('td')[5]; // Index is 0-based

			if (shippingTd == undefined) {
				return;
			}

			let shippingText = shippingTd.innerText;

			// Split the text by the <br> tag
			let shippingArray = shippingText.split('\n');

			let tracking = '';
			let carrier = '';

			// loop through shippingArray and split each line on a colon
			for (var i = 0; i < shippingArray.length; i++) {
				let rowData = shippingArray[i].split(':');
				if (rowData[0].trim() == 'Tracking #') {
					tracking = rowData[1].trim();
				} else if (rowData[0].trim() == 'Ship Type') {
					carrier = rowData[1].trim();
				}
			}

			// test if tracking number is empty
			if (tracking == '') {
				return;
			}
			
			// Create the button
			let btn = createButton(tracking, carrier);
			// Append the button to the td
			shippingTd.appendChild(btn);

			
		});

	}

	// check if order tracking page
	if (window.location.href.indexOf('order-tracking.php') > -1) {
		orderTracking();
	} else if (window.location.href.indexOf('manage-order-new-ver2.php') > -1) {
		manageOrder();
	}

})();