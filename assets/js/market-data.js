/* #8 Marketplace — sample listings and line-art illustrations.
   Shared by the marketplace page, the homepage teaser and the AEP Outcome Studio. */
(function () {
  'use strict';

  // Line-art illustrations, 120×90. Lines in white, IoT signals in the item's --hue.
  var ART = {
    probe: '<rect class="l" x="22" y="22" width="40" height="52" rx="8"/><rect class="a" x="30" y="32" width="24" height="12" rx="3"/><path class="l" d="M62 48c14 0 14 14 28 14h6"/><rect class="l" x="96" y="54" width="5" height="24" rx="2.5"/><circle class="f p" cx="42" cy="60" r="3"/>',
    tracker: '<rect class="l" x="28" y="30" width="46" height="46" rx="15"/><path class="a" d="M51 66s-10-10-10-17a10 10 0 0 1 20 0c0 7-10 17-10 17z"/><circle class="f" cx="51" cy="49" r="3"/><path class="w" d="M80 26a14 14 0 0 1 10 12"/><path class="w w2" d="M84 16a24 24 0 0 1 16 22"/>',
    meter: '<rect class="l" x="34" y="10" width="52" height="70" rx="10"/><rect class="a" x="42" y="20" width="36" height="16" rx="3"/><circle class="l" cx="60" cy="58" r="12"/><path class="a" d="M60 58l7-6"/><path class="w" d="M90 16a12 12 0 0 1 8 10"/>',
    gateway: '<rect class="l" x="18" y="40" width="84" height="34" rx="8"/><path class="l" d="M36 40V14M84 40V18"/><circle class="f p" cx="36" cy="14" r="3"/><circle class="f p" cx="84" cy="18" r="3"/><circle class="f" cx="34" cy="57" r="3"/><circle class="a" cx="46" cy="57" r="3"/><path class="l" d="M62 57h26"/>',
    vibration: '<rect class="l" x="40" y="12" width="40" height="40" rx="8"/><circle class="a" cx="60" cy="32" r="9"/><path class="a" d="M8 74h20l5-10 7 18 6-12 5 4h61"/>',
    soil: '<path class="l" d="M0 56h120"/><path class="g" d="M10 68h100M22 80h76"/><rect class="l" x="52" y="8" width="16" height="30" rx="4"/><path class="l" d="M56 38v36M64 38v36"/><path class="a" d="M94 16s-8 9-8 15a8 8 0 0 0 16 0c0-6-8-15-8-15z"/>',
    air: '<rect class="l" x="28" y="14" width="64" height="60" rx="12"/><path class="l" d="M40 28h40M40 36h40"/><text class="t" x="60" y="62">CO₂</text><circle class="f p" cx="84" cy="22" r="3"/>',
    lora: '<path class="l" d="M60 22L42 84M60 22l18 62M47 64h26M51 46h18"/><circle class="f p" cx="60" cy="22" r="4"/><path class="w" d="M72 14a14 14 0 0 1 0 16"/><path class="w w2" d="M80 7a26 26 0 0 1 0 30"/><path class="w" d="M48 14a14 14 0 0 0 0 16"/><path class="w w2" d="M40 7a26 26 0 0 0 0 30"/>',
    app: '<rect class="l" x="40" y="6" width="40" height="78" rx="8"/><rect class="a" x="47" y="18" width="26" height="14" rx="3"/><rect class="l" x="47" y="38" width="11" height="11" rx="2"/><rect class="f" x="62" y="38" width="11" height="11" rx="2"/><rect class="l" x="47" y="54" width="26" height="8" rx="2"/><path class="l" d="M54 76h12"/>',
    chart: '<path class="l" d="M16 80h92M16 80V10"/><path class="a" d="M22 66l20-16 16 10 22-26 22 8"/><circle class="f p" cx="80" cy="34" r="4"/>',
    plug: '<rect class="l" x="8" y="28" width="36" height="34" rx="7"/><rect class="a" x="76" y="28" width="36" height="34" rx="7"/><path class="l dashed" d="M44 45h32"/><circle class="f p" cx="60" cy="45" r="3"/>',
    sim: '<path class="l" d="M36 8h34l16 16v54a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z"/><rect class="a" x="42" y="36" width="36" height="30" rx="4"/><path class="a" d="M60 36v30M42 51h36"/>',
    service: '<circle class="l" cx="60" cy="32" r="15"/><path class="l" d="M30 84c4-18 16-26 30-26s26 8 30 26"/><path class="a" d="M42 34a18 18 0 0 1 36 0M42 34v7M78 34v7M78 41q0 10-12 10"/>'
  };

  window.HASH8_ART = function (kind) {
    return '<svg class="art" viewBox="0 0 120 90" aria-hidden="true">' + (ART[kind] || ART.probe) + '</svg>';
  };

  window.HASH8_TYPES = {
    device: 'Device',
    app: 'App & template',
    integration: 'Integration',
    connectivity: 'Connectivity',
    service: 'Service'
  };

  // Sample listings. Vendors are illustrative placeholders.
  window.HASH8_MARKET = [
    { id: 'coldsense', type: 'device', name: 'ColdSense T2 Temperature Probe', vendor: 'Kelvra Instruments', seller: 'Device OEM', industry: 'Cold chain', price: 2450, priceLabel: '₹2,450', unit: 'per device', rating: 4.8, reviews: 312, certified: true, kind: 'probe', hue: 168, tags: ['NB-IoT', 'MQTT', 'IP67'], works: ['device-management', 'ticketing'],
      blurb: 'Food- and pharma-grade probe accurate to ±0.1°C, with a 5-year battery and tamper alerts. Arrives pre-provisioned for your #8 tenant.' },
    { id: 'orbit', type: 'device', name: 'Orbit Mini GPS Tracker', vendor: 'Orbitrack', seller: 'Device OEM', industry: 'Fleet & logistics', price: 3900, priceLabel: '₹3,900', unit: 'per device', rating: 4.7, reviews: 540, certified: true, kind: 'tracker', hue: 22, tags: ['LTE-M', 'GNSS', 'BLE'], works: ['asset-management', 'sim-management'],
      blurb: 'Pocket-sized tracker with live location, geofences, crash detection and a replaceable 3-year battery.' },
    { id: 'meterix', type: 'device', name: 'Meterix S1 Smart Energy Meter', vendor: 'Meterix', seller: 'Device OEM', industry: 'Utilities', price: 4800, priceLabel: '₹4,800', unit: 'per meter', rating: 4.6, reviews: 205, certified: true, kind: 'meter', hue: 228, tags: ['DLMS', 'LwM2M', 'NB-IoT'], works: ['device-management', 'iot-crm'],
      blurb: 'Single-phase smart meter with remote connect and disconnect, tamper detection and 15-minute interval reads.' },
    { id: 'eg200', type: 'device', name: 'Edgeforge EG-200 Industrial Gateway', vendor: 'Edgeforge', seller: 'Device OEM', industry: 'Manufacturing', price: 18500, priceLabel: '₹18,500', unit: 'per gateway', rating: 4.9, reviews: 128, certified: true, kind: 'gateway', hue: 200, tags: ['Modbus', 'OPC-UA', 'MQTT'], works: ['device-gateway', 'device-management'],
      blurb: 'DIN-rail edge gateway that runs #8 edge rules, buffers offline for 7 days and bridges legacy PLCs to the cloud.' },
    { id: 'vibesense', type: 'device', name: 'VibeSense V3 Vibration Sensor', vendor: 'Kelvra Instruments', seller: 'Device OEM', industry: 'Manufacturing', price: 6200, priceLabel: '₹6,200', unit: 'per sensor', rating: 4.7, reviews: 96, certified: true, kind: 'vibration', hue: 200, tags: ['Wi-Fi', 'BLE', '3-axis'], works: ['asset-management', 'ticketing'],
      blurb: 'Tri-axial vibration and temperature sensor tuned for motors, pumps and compressors. Feeds predictive maintenance models.' },
    { id: 'terraprobe', type: 'device', name: 'TerraProbe Soil Moisture Sensor', vendor: 'Lumen Fields', seller: 'Device OEM', industry: 'Agriculture', price: 2100, priceLabel: '₹2,100', unit: 'per probe', rating: 4.5, reviews: 174, certified: true, kind: 'soil', hue: 140, tags: ['LoRaWAN', 'Solar'], works: ['device-management', 'customer-apps'],
      blurb: 'Three-depth soil moisture and temperature probe with a solar top. Runs for years with no maintenance.' },
    { id: 'airiq', type: 'device', name: 'AirIQ CO₂ & Comfort Sensor', vendor: 'Habitat Devices', seller: 'Device OEM', industry: 'Smart buildings', price: 3300, priceLabel: '₹3,300', unit: 'per sensor', rating: 4.6, reviews: 233, certified: true, kind: 'air', hue: 260, tags: ['Wi-Fi', 'BACnet', 'MQTT'], works: ['asset-management', 'ticketing'],
      blurb: 'Measures CO₂, temperature, humidity and occupancy, so the building can adjust ventilation on its own.' },
    { id: 'caretag', type: 'device', name: 'CareTag BLE Asset Tag', vendor: 'Pulsecare', seller: 'Device OEM', industry: 'Healthcare', price: 1250, priceLabel: '₹1,250', unit: 'per tag', rating: 4.8, reviews: 88, certified: true, kind: 'tracker', hue: 350, tags: ['BLE 5.2', 'Disinfectable'], works: ['asset-management', 'installation-app'],
      blurb: 'Clinical-grade tag for pumps, monitors and wheelchairs. Room-level location with a 4-year battery.' },
    { id: 'loragw', type: 'device', name: 'LoRa Outdoor Gateway 8-ch', vendor: 'Lumen Fields', seller: 'Device OEM', industry: 'Agriculture', price: 24000, priceLabel: '₹24,000', unit: 'per gateway', rating: 4.7, reviews: 61, certified: true, kind: 'lora', hue: 140, tags: ['LoRaWAN', '4G backhaul', 'IP67'], works: ['device-gateway'],
      blurb: 'Covers up to 10 km of farmland or city streets, with 4G backhaul and solar-ready power.' },

    { id: 'coldpack', type: 'app', name: 'Cold Chain Compliance Pack', vendor: 'AppLoom Studio', seller: 'Developer', industry: 'Cold chain', price: 9999, priceLabel: '₹9,999', unit: 'per month', rating: 4.9, reviews: 142, certified: true, kind: 'app', hue: 168, tags: ['HACCP', 'Audit reports', 'AEP template'], works: ['customer-apps', 'ticketing'],
      blurb: 'Audit-ready temperature logs, excursion reports and corrective-action tracking, built on the #8 AEP.' },
    { id: 'driverscore', type: 'app', name: 'Fleet Driver Score', vendor: 'Roadwise Apps', seller: 'Developer', industry: 'Fleet & logistics', price: 4999, priceLabel: '₹4,999', unit: 'per month', rating: 4.6, reviews: 207, certified: true, kind: 'chart', hue: 22, tags: ['Scoring', 'Coaching', 'AEP template'], works: ['asset-management', 'customer-apps'],
      blurb: 'Scores harsh braking, speeding and idling per driver, and sends weekly coaching nudges.' },
    { id: 'metercash', type: 'app', name: 'Meter-to-Cash Billing', vendor: 'Voltline Software', seller: 'Developer', industry: 'Utilities', price: 14999, priceLabel: '₹14,999', unit: 'per month', rating: 4.7, reviews: 76, certified: true, kind: 'app', hue: 228, tags: ['Billing', 'UPI', 'AEP template'], works: ['iot-crm', 'customer-apps'],
      blurb: 'Turns meter reads into bills, payment links and reminders, with disconnection workflows for overdue accounts.' },
    { id: 'pdm', type: 'app', name: 'Predictive Maintenance AI', vendor: 'Axion Analytics', seller: 'Developer', industry: 'Manufacturing', price: 19999, priceLabel: '₹19,999', unit: 'per month', rating: 4.8, reviews: 54, certified: true, kind: 'chart', hue: 200, tags: ['Machine learning', 'Work orders'], works: ['asset-management', 'ticketing'],
      blurb: 'Learns each machine’s normal behaviour and raises a work order days before a likely failure.' },
    { id: 'bldgdash', type: 'app', name: 'Building Energy Dashboard', vendor: 'Habitat Devices', seller: 'Developer', industry: 'Smart buildings', price: 0, priceLabel: 'Free', unit: '', rating: 4.4, reviews: 318, certified: true, kind: 'chart', hue: 260, tags: ['Energy', 'ESG reports'], works: ['customer-apps'],
      blurb: 'Floor-by-floor energy use, comfort scores and monthly ESG exports for every building you run.' },
    { id: 'hospfinder', type: 'app', name: 'Hospital Asset Finder', vendor: 'Pulsecare', seller: 'Developer', industry: 'Healthcare', price: 7499, priceLabel: '₹7,499', unit: 'per month', rating: 4.7, reviews: 39, certified: true, kind: 'app', hue: 350, tags: ['Wayfinding', 'Utilisation'], works: ['asset-management', 'installation-app'],
      blurb: 'Nurses find the nearest free pump or monitor in seconds. Managers see utilisation by ward.' },

    { id: 'erp', type: 'integration', name: 'Enterprise ERP Sync', vendor: 'Datapath Partners', seller: 'Developer', industry: 'All industries', price: 6999, priceLabel: '₹6,999', unit: 'per month', rating: 4.5, reviews: 112, certified: true, kind: 'plug', hue: 228, tags: ['Work orders', 'Inventory', 'Two-way'], works: ['ticketing', 'asset-management'],
      blurb: 'Two-way sync of assets, work orders and spare parts between #8 and your ERP.' },
    { id: 'msg', type: 'integration', name: 'Messaging Gateway', vendor: 'Signalnet', seller: 'Developer', industry: 'All industries', price: 0.25, priceLabel: '₹0.25', unit: 'per message', rating: 4.6, reviews: 401, certified: true, kind: 'plug', hue: 22, tags: ['WhatsApp', 'SMS', 'Voice'], works: ['ticketing', 'customer-apps'],
      blurb: 'Templated WhatsApp, SMS and voice alerts with delivery receipts, wired straight into Ticketing.' },
    { id: 'pay', type: 'integration', name: 'Payments Connector', vendor: 'Voltline Software', seller: 'Developer', industry: 'All industries', price: 0, priceLabel: 'Free', unit: '+ processing fees', rating: 4.5, reviews: 98, certified: true, kind: 'plug', hue: 140, tags: ['UPI', 'Cards', 'Subscriptions'], works: ['iot-crm', 'customer-apps'],
      blurb: 'Collect subscriptions and one-off payments inside your customer app, reconciled in IoT CRM.' },
    { id: 'bi', type: 'integration', name: 'BI Export Connector', vendor: 'Axion Analytics', seller: 'Developer', industry: 'All industries', price: 2999, priceLabel: '₹2,999', unit: 'per month', rating: 4.3, reviews: 67, certified: false, kind: 'plug', hue: 260, tags: ['SQL', 'Scheduled exports'], works: ['device-management'],
      blurb: 'Stream clean telemetry and events to your data warehouse and BI tools on a schedule.' },

    { id: 'plan100', type: 'connectivity', name: 'Pan-India IoT Data Plan', vendor: 'Cellwave Connect', seller: 'Carrier', industry: 'All industries', price: 49, priceLabel: '₹49', unit: 'per SIM / month', rating: 4.6, reviews: 860, certified: true, kind: 'sim', hue: 168, tags: ['100 MB pooled', 'Multi-network'], works: ['sim-management'],
      blurb: 'Multi-network SIM that falls back to the strongest signal. Data is pooled across your whole fleet.' },
    { id: 'esim', type: 'connectivity', name: 'Global eSIM Roaming Pool', vendor: 'Cellwave Connect', seller: 'Carrier', industry: 'All industries', price: 129, priceLabel: '₹129', unit: 'per SIM / month', rating: 4.5, reviews: 214, certified: true, kind: 'sim', hue: 228, tags: ['190 countries', 'Remote swap'], works: ['sim-management'],
      blurb: 'One eSIM for every country you ship to. Change carrier profiles remotely from SIM Management.' },
    { id: 'nbiot', type: 'connectivity', name: 'NB-IoT Low-Power Plan', vendor: 'Signalnet', seller: 'Carrier', industry: 'Utilities', price: 19, priceLabel: '₹19', unit: 'per SIM / month', rating: 4.4, reviews: 131, certified: true, kind: 'sim', hue: 45, tags: ['NB-IoT', 'Deep indoor'], works: ['sim-management'],
      blurb: 'Built for meters and sensors that send small amounts of data from basements and cabinets.' },

    { id: 'install', type: 'service', name: 'Nationwide Installation Crew', vendor: 'Hexa Integrators', seller: 'Service partner', industry: 'All industries', price: 650, priceLabel: 'From ₹650', unit: 'per device', rating: 4.8, reviews: 289, certified: true, kind: 'service', hue: 45, tags: ['300+ cities', 'Uses Installation App'], works: ['installation-app'],
      blurb: 'Certified technicians who install, test and sign off every device using the #8 Installation App.' },
    { id: 'workshop', type: 'service', name: 'Solution Design Workshop', vendor: 'Datapath Partners', seller: 'Service partner', industry: 'All industries', price: 75000, priceLabel: '₹75,000', unit: 'one-time', rating: 4.9, reviews: 34, certified: true, kind: 'service', hue: 260, tags: ['2 days', 'Outcome mapping'], works: ['iot-crm'],
      blurb: 'Two days with IoT architects to turn your business goals into AEP outcomes, devices and a rollout plan.' },
    { id: 'noc', type: 'service', name: '24×7 Operations Monitoring', vendor: 'Hexa Integrators', seller: 'Service partner', industry: 'All industries', price: 35, priceLabel: '₹35', unit: 'per device / month', rating: 4.7, reviews: 72, certified: true, kind: 'service', hue: 200, tags: ['NOC', 'L1 support'], works: ['ticketing'],
      blurb: 'A round-the-clock operations team that works your #8 tickets alongside your own staff.' }
  ];

  // Curated bundles: everything one outcome needs, from several sellers, in one order.
  window.HASH8_KITS = [
    { id: 'kit-cold', name: 'Cold chain starter kit', outcome: 'Zero spoiled stock across 20 cold rooms', hue: 168,
      items: [['coldsense', 20], ['plan100', 20], ['coldpack', 1], ['install', 20]] },
    { id: 'kit-meter', name: 'Smart metering pilot', outcome: 'Read 100 meters remotely from day one', hue: 228,
      items: [['meterix', 100], ['nbiot', 100], ['metercash', 1], ['install', 100]] },
    { id: 'kit-fleet', name: 'Fleet essentials', outcome: 'Live tracking and driver scores for 25 vehicles', hue: 22,
      items: [['orbit', 25], ['plan100', 25], ['driverscore', 1]] },
    { id: 'kit-pdm', name: 'Predictive maintenance kit', outcome: 'Catch faults on 10 critical machines', hue: 200,
      items: [['vibesense', 10], ['eg200', 1], ['pdm', 1]] }
  ];

  window.HASH8_CARD = function (m) {
    return '<span class="mk__art" style="--hue:' + m.hue + '">' + window.HASH8_ART(m.kind) + '</span>' +
      '<span class="mk__body"><span class="mk__type">' + window.HASH8_TYPES[m.type] +
      (m.certified ? '<span class="mk__ok"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>#8 Certified</span>' : '') + '</span>' +
      '<span class="mk__name">' + m.name + '</span><span class="mk__by">by ' + m.vendor + '</span>' +
      '<span class="mk__meta"><span class="mk__rate"><i aria-hidden="true">★</i> ' + m.rating.toFixed(1) + ' <small>(' + m.reviews + ')</small></span>' +
      '<span class="mk__price">' + m.priceLabel + (m.unit ? ' <small>' + m.unit + '</small>' : '') + '</span></span></span>';
  };
})();
