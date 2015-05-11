var packageJSON = require('../package.json');

var manifest = {
  name: "Dashboard Enhancement Suite",
  version: packageJSON.version,
  // update_url: "https://raw.githubusercontent.com/nealgranger/Dashboard-Enhancement-Suite/master/extension/updates.xml",
  manifest_version: 2,
  options_page: "options/index.html",
  page_action: {
    default_title : "on dashbaord"
  },
  background: {
    scripts: ["background.js"]
  },
  externally_connectable: {
    matches: ["*://apps.caorda.com/dashboard*"]
  },
  permissions: [
    "*://apps.caorda.com/dashboard*",
    "storage",
    "declarativeContent"
  ],
  content_scripts: [
    {
      matches: [
        "*://apps.caorda.com/dashboard/*"
      ],
      js: [
        "content.js"
      ],
      run_at: "document_end"
    }
  ],
  web_accessible_resources: [
    "resources/*"
  ]
};



module.exports = {
  manifestJSON: JSON.stringify(manifest),
  manifest: manifest
};