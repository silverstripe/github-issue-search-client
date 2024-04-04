const fs = require('fs');
const path = require('path');
// Can't use import directly because this isn't a module, and can't use require because node-fetch doesn't support that
// See https://stackoverflow.com/a/75281896/10936596
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

/**
 * Gets information for any "supported-module" repositories.
 */
async function getRelevantModules(jsonUrl, foundModules) {
  const response = await fetch(jsonUrl);
  const currentModules = await response.json();
  // Only list supported-module, since the CMS 4 list includes some things we don't control or care about with other types.
  const relevant = currentModules.filter(module => module.type === 'supported-module');
  for (const module of relevant) {
    foundModules[module.github] = module;
  }
}

async function rebuildReposList() {
  // Initialise this with repos that aren't in the supported-modules json
  // Or which will otherwise be filtered out due to their type
  const extraRepos = [
    // GitHub actions
    'silverstripe/gha-action-ci',
    'silverstripe/gha-auto-tag',
    'silverstripe/gha-ci',
    'silverstripe/gha-dispatch-ci',
    'silverstripe/gha-gauge-release',
    'silverstripe/gha-generate-matrix',
    'silverstripe/gha-issue',
    'silverstripe/gha-keepalive',
    'silverstripe/gha-merge-up',
    'silverstripe/gha-pull-request',
    'silverstripe/gha-run-tests',
    'silverstripe/gha-tag-release',
    'silverstripe/gha-trigger-ci',
    'silverstripe/gha-update-js',
    // tooling
    'silverstripe/cow',
    'silverstripe/rhino',
    'silverstripe/github-issue-search-client',
    'silverstripe/module-standardiser',
    'silverstripe/silverstripe-tx-translator',
    'silverstripe/markdown-php-codesniffer',
    'silverstripe/silverstripe-standards',
    'silverstripe/documentation-lint',
    // extra bits and bobs
    'silverstripe/.github',
    'silverstripe/eslint-config',
    'silverstripe/webpack-config',
    'silverstripe/silverstripe-module',
    'silverstripe/api.silverstripe.org',
    'silverstripe/doc.silverstripe.org',
    'silverstripe/silverstripe-userhelp-content',
    'silverstripe/demo.silverstripe.org',
    'silverstripe/silverstripe-frameworktest',
  ];

  const allModules = {};
  for (const repo of extraRepos) {
    allModules[repo] = { github: repo };
  }

  // Merge in suported modules from all relevant major release lines.
  // For modules which appear in more than one release line, prefer the most recent version.
  const urls = [
    'https://raw.githubusercontent.com/silverstripe/supported-modules/4/modules.json',
    'https://raw.githubusercontent.com/silverstripe/supported-modules/5/modules.json',
  ];
  for (const url of urls) {
    await getRelevantModules(url, allModules);
  }

  const out = [
    {
      id: 'core',
      name: 'Core',
      repos: Object.values(allModules).filter(module => module.isCore).map(module => module.github)
    },
    {
      id: 'supported',
      name: 'Supported',
      // All supported modules including core
      repos: Object.values(allModules).map(module => module.github)
    }
  ];

  fs.writeFile(path.join(__dirname, '../src/') + '/repos.json', JSON.stringify(out, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Successfully written to file "src/repos.json"');
  });
}

rebuildReposList();
