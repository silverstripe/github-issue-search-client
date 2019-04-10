# Github Issue Searcher

## Overview

This app uses the Github issue search API to provide
a convenient issue browser across all of our
[supported modules](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/).

It uses [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/docs/cli.md)
to simplify local development and production buidls for VueJS.
You can use it on https://silverstripe-github-issues.now.sh/.

![Preview](_img/preview.png)

## Install

Use Node v8 or higher.

```
npm install
```

For deployment, you will need to [install Now](https://zeit.co/download) and log in.

## Configure

Create an `.env` with:

```
VUE_APP_GRAPHQL_ENDPOINT=https://api.github.com
VUE_APP_GRAPHQL_TOKEN=<token>
```

Get a [Github Personal Access Token](https://github.com/settings/tokens) and chuck it in `<token>`.
Note that the token should NOT have any other permissions/scopes, since it will be included
in the client bundle (and is readable by everyone through network requests).
The only reason to include it here is avoiding to hit Github's rate limits without it.

In order to get an updated list of our [supported modules](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/),
you can run the following command. This will be written to the `repos.json` file in the `src` folder, which can be
updated (in VCS) periodically if required. This will also happen during a deployment and auto-update in the
Now environment.

```
npm run get-repos
```

## Run locally

```
npm run serve
```

## Build

```
npm run build
```

## Deploy

The project is published to [Now](https://zeit.co/now). To do this you will need to have the Now CLI installed, be
logged in, part of the SilverStripe team, and have the team configured in your profile. For access to the team,
contact internally.

```
# Login if necessary
now login

# Switch to SilverStripe Ltd team
now teams switch silverstripeltd

# Ship it!
now
```

It will give you an updated URL to run in your browser. This will also run automatically as a Git hook.

### API keys

To store the GraphQL API token in an environment variable for Now, you need to use the CLI to save is as a
[secret](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets#securing-environment-variables-using-secrets):

```
now secret add graphql-api-key YOURAPITOKENHERE
``` 

The secret variable name `@graphql-api-key` is referenced from `now.json` to map to an environment variable.

## Usage

### Product Team Mode

By default, repos are split between "core repos" (what's part of the silverstripe.org download),
and "all other supported modules". When this app is used by product teams at SilverStripe Ltd,
the split isn't as clear. Repo maintenance responsibilities split along the same criteria
("core vs. everything else"), but there's differences. To account of this,
the app can be run in a "team mode" through a URL parameter:

`?product-team-mode=1`

This will cause different repos to be included in the requests to Github.
