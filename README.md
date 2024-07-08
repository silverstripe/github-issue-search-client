# Github Issue Searcher

## Overview

This app uses the Github issue search API to provide
a convenient issue browser across all of our
[supported modules](https://docs.silverstripe.org/en/project_governance/supported_modules/)
as well as other repositories that are important for maintenance.

It uses [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/docs/cli.md)
to simplify local development and production builds for VueJS.
You can use it on <https://elvis.silverstripe.org>.

![Preview](_img/preview.png)

## Install

Use Node (see .nvmrc for correct version to use).

```bash
npm install
```

## Configure

Create an `.env` with:

```env
VUE_APP_GRAPHQL_ENDPOINT=https://api.github.com/graphql
VUE_APP_GRAPHQL_TOKEN=<token>
```

Get a [Github Personal Access Token](https://github.com/settings/tokens) and chuck it in `<token>`.
Note that the token should NOT have any other permissions/scopes, since it will be included
in the client bundle (and is readable by everyone through network requests).
The only reason to include it here is avoiding to hit Github's rate limits without it.

In order to get an updated list of the repositories we care about,
you can run the following command. This will be written to the `repos.json` file in the `src` folder, which can be
updated (in VCS) periodically if required.

This gets run during a deployment.

```bash
npm run get-repos
```

## Run locally

```bash
npm run serve
```

## Build

```bash
npm run build
```

## Deploy

### Continuous deployment

The project is published to [GitHub Pages](https://docs.github.com/en/pages) automatically when changes are merged into the master branch.
This is done via a GitHub Actions workflow.

### Manual deployment

You can also deploy projects manually. To do this go to the [Actions tab in GitHub](https://github.com/silverstripe/github-issue-search-client/actions/workflows/deploy-gh-pages.yml), and click "Run workflow".

### API keys

There is a historic token stored in the repository as a secret. If you ever need to cycle the token, just update the value of the secret in this repository and redeploy.

## Usage

### Custom Repositories

You can pass in a custom list of repositories via URL params:

`?customRepos=silverstripe/silverstripe-framework,silverstripe/silverstripe-cms`

This can be helpful to filter only to repos you're interested on in a specific project context,
e.g. extracting them from your composer.lock file.

Protip: You can generate these custom repos from your `composer.lock` file automatically
through [Silverstripe Module Issue Browser Util](https://github.com/silverstripe/silverstripe-github-issue-search-composer-util).

Assuming you've got your Composer binaries [set up globally](https://stackoverflow.com/questions/25373188/how-to-place-the-composer-vendor-bin-directory-in-your-path),
the following will read from your lock file and open the issue browser:

```bash
composer global require silverstripe/github-issue-search-composer-util
cat /my/project/composer.lock | github-issue-search | xargs open
```

### Analytics

The default instance has [Google Analytics](https://analytics.google.com/analytics/web/#/report-home/a84547w88513614p192904949)
set up under a Silverstripe owned account. Please contact maintainers if you'd like to have a look!
