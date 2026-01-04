const fs = require('fs');
const path = require('path');
// Can't use import directly because this isn't a module, and can't use require because node-fetch doesn't support that
// See https://stackoverflow.com/a/75281896/10936596
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function isRelevantRepo(repo) {
  const relevantMappings = ['*', '5', '6'];
  for (const mapping of relevantMappings) {
    if (Object.prototype.hasOwnProperty.call(repo.majorVersionMapping, mapping)) {
      return true;
    }
  }
  return false;
}

async function rebuildReposList() {
  const coreModules = [];
  const supportedModules = [];
  const otherRepos = [];

  // Merge in suported modules from all relevant major release lines.
  // For modules which appear in more than one release line, prefer the most recent version.
  const response = await fetch('https://raw.githubusercontent.com/silverstripe/supported-modules/main/repositories.json');
  const currentModules = await response.json();
  for (const category of Object.keys(currentModules)) {
    for (const repo of currentModules[category]) {
      if (!isRelevantRepo(repo)) {
        continue;
      }
      if (category === 'supportedModules') {
        if (repo.isCore) {
          coreModules.push(repo.github);
        } else {
          supportedModules.push(repo.github);
        }
      } else {
        otherRepos.push(repo.github);
      }
    }
  }

  const out = [
    {
      id: 'core',
      name: 'Core',
      repos: coreModules,
    },
    {
      id: 'supported',
      name: 'Supported',
      // All supported modules including core
      repos: [...coreModules, ...supportedModules],
    },
    {
      id: 'other',
      name: 'Other',
      // All supported modules including core
      repos: otherRepos,
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
