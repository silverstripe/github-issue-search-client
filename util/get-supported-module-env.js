const request = require('request');

const URL = 'https://raw.githubusercontent.com/silverstripe/supported-modules/gh-pages/modules.json';
const coreRepos = [
  'silverstripe/silverstripe-asset-admin',
  'silverstripe/silverstripe-assets',
  'silverstripe/silverstripe-config',
  'silverstripe/silverstripe-framework',
  "silverstripe/admin",
  "silverstripe/asset-admin",
  "silverstripe/campaign-admin",
  "silverstripe/cms",
  "silverstripe/errorpage",
  "silverstripe/graphql",
  "silverstripe/reports",
  "silverstripe/siteconfig",
  "silverstripe/versioned-admin",
  "silverstripe/versioned"
];
request(URL, function (error, response, body) {
  const modules = JSON.parse(body);
  const repos = modules.filter(module => module.type == 'supported-module').map(module => module.github);
  const out = [
    {
      id: 'core',
      name: 'Core',
      repos: repos.filter(repo => coreRepos.indexOf(repo) > -1)
    },
    {
      id: 'supported',
      name: 'Supported',
      repos: repos.filter(repo => !coreRepos.indexOf(repo) > -1)
    }
  ];

  console.log(JSON.stringify(out));
});
