const fs = require('fs');
const path = require('path');
// Can't use import directly because this isn't a module, and can't use require because node-fetch doesn't support that
// See https://stackoverflow.com/a/75281896/10936596
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const URL = 'https://raw.githubusercontent.com/silverstripe/supported-modules/gh-pages/modules.json';

// Modules which are part of the default download
const coreRepos = [
  'silverstripe/recipe-cms',
  'silverstripe/recipe-core',
  'silverstripe/recipe-plugin',
  'silverstripe/silverstripe-admin',
  'silverstripe/silverstripe-asset-admin',
  'silverstripe/silverstripe-assets',
  'silverstripe/silverstripe-campaign-admin',
  'silverstripe/silverstripe-cms',
  'silverstripe/silverstripe-config',
  'silverstripe/silverstripe-errorpage',
  'silverstripe/silverstripe-framework',
  'silverstripe/silverstripe-graphql',
  'silverstripe/silverstripe-installer',
  'silverstripe/silverstripe-reports',
  'silverstripe-themes/silverstripe-simple',
  'silverstripe/silverstripe-siteconfig',
  'silverstripe/silverstripe-versioned',
  'silverstripe/silverstripe-versioned-admin'
];

// Modules which are maintained by the product team focused at 'core'.
// This is an internal workflow aspect which allows this team to use this app
// for their issue triage. It should match the zenhub.com board,
// minus repos on github.com/silverstripe-security.
const coreProductTeamRepos = [
  'silverstripe/api.silverstripe.org',
  'silverstripe/cow',
  'silverstripe/demo.silverstripe.org',
  'silverstripeltd/open-sourcerers',
  'silverstripe/recipe-cms',
  'silverstripe/recipe-core',
  'silverstripe/recipe-plugin',
  'silverstripe/silverstripe-admin',
  'silverstripe/silverstripe-asset-admin',
  'silverstripe/silverstripe-assets',
  'silverstripe/silverstripe-behat-extension',
  'silverstripe/silverstripe-campaign-admin',
  'silverstripe/silverstripe-cms',
  'silverstripe/silverstripe-config',
  'silverstripe/silverstripe-errorpage',
  'silverstripe/silverstripe-framework',
  'silverstripe/silverstripe-frameworktest',
  'silverstripe/silverstripe-graphql',
  'silverstripe/silverstripe-graphql-devtools',
  'silverstripe/silverstripe-installer',
  'silverstripe/silverstripe-postgresql',
  'silverstripe/silverstripe-reports',
  'silverstripe/silverstripe-serve',
  'silverstripe-themes/silverstripe-simple',
  'silverstripe/silverstripe-siteconfig',
  'silverstripe/silverstripe-sqlite3',
  'silverstripe/silverstripe-testsession',
  'silverstripe/silverstripe-upgrader',
  'silverstripe/silverstripe-versioned',
  'silverstripe/silverstripe-versioned-admin',
  'silverstripe/vendor-plugin',
  'silverstripe/webpack-config',
  'silverstripe/developer-docs'
];

fetch(URL).then((response) => {
  response.json().then((modules) => {
  const repos = modules.filter(module => module.type === 'supported-module').map(module => module.github);
  const out = [
    {
      id: 'core',
      name: 'Core',
      repos: repos.filter(repo => coreRepos.indexOf(repo) > -1)
    },
    {
      id: 'supported',
      name: 'Supported',
      // All supported modules including core
      repos: repos.filter(repo => !coreRepos.indexOf(repo) > -1)
    },
    {
      id: 'core-product-team',
      name: 'Core Product Team',
      repos: repos.filter(repo => coreProductTeamRepos.indexOf(repo) > -1)
    },
    {
      id: 'supported-product-team',
      name: 'Supported Modules Product Team',
      // Only supported modules which aren't "core product repos" already
      repos: repos.filter(repo => coreProductTeamRepos.indexOf(repo) === -1)
    }
  ];

  fs.writeFile(path.join(__dirname, '../src/') + '/repos.json', JSON.stringify(out, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Successfully written to file "src/repos.json"');
  });
  });
});
