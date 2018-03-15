# Github Issue Searcher

## Overview

This app uses [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/docs/cli.md)
to simplify local development and production buidls for VueJS.

## Install

```
npm install
```

## Configure

Create an `.env` with:

```
VUE_APP_GRAPHQL_ENDPOINT=https://api.github.com
VUE_APP_GRAPHQL_TOKEN=<token>
CORE_REPOS=silverstripe/silverstripe-framework,silverstripe/silverstripe-cms,silverstripe/silverstripe-admin,silverstripe/silverstripe-installer,silverstripe/silverstripe-asset-admin,silverstripe/silverstripe-versioned,silverstripe/silverstripe-reports,silverstripe/silverstripe-siteconfig,silverstripe/silverstripe-assets,silverstripe/silverstripe-campaign-admin,silverstripe/silverstripe-errorpage,silverstripe/silverstripe-graphql,silverstripe/recipe-core,silverstripe/recipe-plugin,silverstripe/recipe-cms
SUPPORTED_REPOS=silverstripe/silverstripe-blog
```

## Run locally

```
npm run serve
```

## Build

```
npm run build
```
