/* Single source of truth for the #8 ecosystem.
   Swap `url` for the real application address when each app ships.
   `worksWith` lists the products each one hands work to inside the ecosystem. */
window.HASH8_PRODUCTS = [
  {
    slug: 'device-management',
    no: '01',
    name: 'Device Management',
    short: 'Every device, one command away.',
    lede: 'Onboard, configure, update and heal millions of devices from a single console — with firmware rollouts that stop themselves when something looks wrong.',
    features: ['Zero-touch provisioning', 'Staged OTA firmware with auto-rollback', 'Remote commands & config twins', 'Health scoring per device'],
    worksWith: ['device-gateway', 'ticketing', 'installation-app'],
    color: 'signal',
    ui: 'devices',
    url: 'app.html?app=device-management'
  },
  {
    slug: 'sim-management',
    no: '02',
    name: 'SIM Management',
    short: 'Connectivity you can actually control.',
    lede: 'Activate, suspend and swap SIMs across carriers. See data usage per device before the bill does, and stop runaway costs automatically.',
    features: ['Multi-carrier & eSIM lifecycle', 'Usage caps and cost alerts', 'Bulk activate / suspend', 'Device–SIM binding & theft lock'],
    worksWith: ['device-management', 'iot-crm', 'ticketing'],
    color: 'ion',
    ui: 'sims',
    url: 'app.html?app=sim-management'
  },
  {
    slug: 'device-gateway',
    no: '03',
    name: 'Device Gateway',
    short: 'Speaks every protocol your things do.',
    lede: 'MQTT, CoAP, LwM2M, HTTP, Modbus, TCP/UDP and custom binary — decoded, normalised and secured at the edge before a single byte reaches your apps.',
    features: ['20+ protocols & codecs', 'Edge rules and buffering', 'Mutual TLS & per-device keys', 'Horizontal scale to millions of sessions'],
    worksWith: ['device-management', 'sim-management', 'asset-management'],
    color: 'signal',
    ui: 'gateway',
    url: 'app.html?app=device-gateway'
  },
  {
    slug: 'asset-management',
    no: '04',
    name: 'Asset Management',
    short: 'Know where it is, how it is, and what it’s worth.',
    lede: 'Track assets across sites, vehicles and warehouses. Link them to devices, contracts and customers so every asset has a full operational history.',
    features: ['Live location & geofences', 'Asset hierarchy & digital twins', 'Maintenance schedules', 'Utilisation and depreciation'],
    worksWith: ['device-management', 'iot-crm', 'ticketing'],
    color: 'ion',
    ui: 'assets',
    url: 'app.html?app=asset-management'
  },
  {
    slug: 'iot-crm',
    no: '05',
    name: 'IoT CRM',
    short: 'A CRM that knows what the device knows.',
    lede: 'Customers, contracts, subscriptions and installed devices in one record. Sales and support see the real state of every connected product they sold.',
    features: ['Customer 360 with live device state', 'Subscriptions & plans', 'Contract and SLA tracking', 'Usage-based billing hooks'],
    worksWith: ['customer-apps', 'ticketing', 'sim-management'],
    color: 'ember',
    ui: 'crm',
    url: 'app.html?app=iot-crm'
  },
  {
    slug: 'ticketing',
    no: '06',
    name: 'Notifications & Ticketing',
    short: 'Alerts that become action, not noise.',
    lede: 'Telemetry events open tickets, assign the right technician, escalate on SLA and tell the customer — over SMS, email, WhatsApp, push or voice.',
    features: ['Event → ticket automation', 'SLA timers & escalation', 'Omnichannel notifications', 'On-call routing & dedupe'],
    worksWith: ['installation-app', 'iot-crm', 'customer-apps'],
    color: 'ember',
    ui: 'tickets',
    url: 'app.html?app=ticketing'
  },
  {
    slug: 'installation-app',
    no: '07',
    name: 'Device Installation App',
    short: 'Install right the first time.',
    lede: 'A mobile app for field teams: scan, bind, test and certify each device on site — with photos, GPS and a live connectivity check before they leave.',
    features: ['QR / barcode scan & bind', 'Guided install checklists', 'On-site live connectivity test', 'Offline mode with sync'],
    worksWith: ['device-management', 'sim-management', 'asset-management'],
    color: 'signal',
    ui: 'install',
    url: 'app.html?app=installation-app'
  },
  {
    slug: 'customer-apps',
    no: '08',
    name: 'Customer Applications',
    short: 'Your brand. Your app. Our engine.',
    lede: 'White-label web and mobile apps your customers use to see, control and pay for their devices — generated from the same model, published under your name.',
    features: ['White-label web & mobile', 'Self-service control & reports', 'In-app support and payments', 'Role-based multi-tenant access'],
    worksWith: ['iot-crm', 'ticketing', 'device-management'],
    color: 'ion',
    ui: 'customer',
    url: 'app.html?app=customer-apps'
  }
];

window.HASH8_AEP = {
  slug: 'aep',
  no: '∞',
  name: 'AEP — Application Enablement Platform',
  short: 'Choose an outcome. Get a complete IoT application.',
  lede: 'The AEP is outcome-driven. Pick a business outcome or describe your own, and #8 assembles the complete application from the whole ecosystem — devices, connectivity, rules, teams, tickets and a branded customer app. Customise it, launch it, go live. No code.',
  features: ['Outcome library for every industry', 'Describe your own outcome in plain words', 'Complete app assembled from all eight products', 'Customise, launch and go live in one place'],
  color: 'signal',
  url: 'app.html?app=aep'
};
