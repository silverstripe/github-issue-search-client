const fs = require('fs');
const path = require('path');
// Can't use import directly because this isn't a module, and can't use require because node-fetch doesn't support that
// See https://stackoverflow.com/a/75281896/10936596
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const FULL_SUPPORT_STATUSES = ['Full support', 'Pre-release', 'In development', 'Planned'];

/**
 * Check if a date from the roadmap is today or in the future.
 * Roadmap dates can be YYYY-MM or YYYY-MM-DD, so compare at the same precision.
 */
function isTodayOrLater(date, today) {
  return date >= today.substring(0, date.length);
}

/**
 * Check if a minor release line is in full support, or will be in the future.
 * Releases in partial (security only) support or end of life return false.
 */
function isFullSupportOrLater(release, today) {
  // "Not shown" only hides the release on the roadmap page, so it does not give the support level.
  if (release.statusOverride !== null && release.statusOverride !== 'Not shown') {
    return FULL_SUPPORT_STATUSES.includes(release.statusOverride);
  }
  // partialSupport is the date when partial support starts.
  return isTodayOrLater(release.partialSupport, today);
}

/**
 * Get the CMS major versions which have at least one minor release line
 * in full support, or which will be in full support in the future.
 */
async function getRelevantMajors() {
  const response = await fetch('https://raw.githubusercontent.com/silverstripe/roadmap/main/data.json');
  if (!response.ok) {
    throw new Error(`Could not fetch roadmap data: ${response.status} ${response.statusText}`);
  }
  const roadmap = await response.json();
  const today = new Date().toISOString().substring(0, 10);
  const majors = new Set();
  for (const release of roadmap.data) {
    if (isFullSupportOrLater(release, today)) {
      majors.add(release.version.split('.')[0]);
    }
  }
  if (majors.size === 0) {
    throw new Error('No CMS major versions in full support were found in the roadmap data');
  }
  return majors;
}

function isRelevantRepo(repo, relevantMajors) {
  const relevantMappings = ['*', ...relevantMajors];
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
  const relevantMajors = await getRelevantMajors();
  console.log(`Including repositories for CMS major versions: ${[...relevantMajors].join(', ')}`);

  // Merge in supported modules from all major release lines which are not in partial (security only) support.
  const response = await fetch('https://raw.githubusercontent.com/silverstripe/supported-modules/main/repositories.json');
  if (!response.ok) {
    throw new Error(`Could not fetch supported modules data: ${response.status} ${response.statusText}`);
  }
  const currentModules = await response.json();
  for (const category of Object.keys(currentModules)) {
    for (const repo of currentModules[category]) {
      if (!isRelevantRepo(repo, relevantMajors)) {
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
