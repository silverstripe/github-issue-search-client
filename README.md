# Github Issue Searcher

## Overview

This app uses [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/docs/cli.md)
to simplify local development and production buidls for VueJS.

![Preview](_img/preview.png)

## Install

```
npm install
```

## Configure

Create an `.env` with:

```
VUE_APP_GRAPHQL_ENDPOINT=https://api.github.com
VUE_APP_GRAPHQL_TOKEN=<token>
```

Get a [Github Personal Access Token](https://github.com/settings/tokens) and chuck it in `<token>`.

## Run locally

```
npm run serve
```

## Build

```
npm run build
```
