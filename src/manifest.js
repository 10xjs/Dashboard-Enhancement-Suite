exports = module.exports = {
  name: "Dashboard Enhancement Suite",
  version: require('../package.json').version,
  manifest_version: 2,
  options_page: "options.html",
  page_action: {
    default_title : "on dashbaord",
    default_popup: "popup.html"
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