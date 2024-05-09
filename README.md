# Github Issue Searcher

## Overview

This app uses the Github issue search API to provide
a convenient issue browser across all of our
[supported modules](https://docs.silverstripe.org/en/project_governance/supported_modules/)
as well as other repositories that are important for maintenance.

It uses [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/docs/cli.md)
to simplify local development and production builds for VueJS.
You can use it on https://github-issue-search-client-silverstripe.vercel.app.

![Preview](_img/preview.png)

This project is powered by [Vercel](https://vercel.com/?utm_source=silverstripe&utm_campaign=oss).

![Vercel logo](_img/vercel-logotype-dark.png)

## Install

Use Node v8 or higher.

```bash
npm install
```

For deployment, you will need to [install Vercel](https://vercel.com/download/?utm_source=silverstripe&utm_campaign=oss) and log in.

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
This gets run during a deployment and auto-update in the Vercel environment.

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

The project is published to [Vercel](https://vercel.com/?utm_source=silverstripe&utm_campaign=oss) automatically when changes are merged into the master branch.
This is done via an automatic GitHub integration.

### Manual deployment

You can also deploy projects manually. To do this you will need to have the [Vercel CLI](https://vercel.com/cli/?utm_source=silverstripe&utm_campaign=oss) installed, be
logged in, part of the ["silverstripe" Vercel team](https://vercel.com/teams/silverstripe/settings/members/?utm_source=silverstripe&utm_campaign=oss), 
and have the team configured in your profile. For access to the team, contact Ingo or Garion.

```bash
# Login if necessary
vercel login

# Switch to SilverStripe Ltd team
vercel teams switch silverstripe

# Ship it!
vercel
```

It will give you an updated URL to run in your browser. This will also run automatically as a Git hook.

### API keys

To store the GraphQL API token in an environment variable for Now, you need to use the CLI to save is as a
[secret](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/?utm_source=silverstripe&utm_campaign=oss#securing-environment-variables-using-secrets):

```bash
vercel secret add graphql-api-key YOURAPITOKENHERE
```

The secret variable name `@graphql-api-key` is referenced from `now.json` to map to an environment variable.

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
