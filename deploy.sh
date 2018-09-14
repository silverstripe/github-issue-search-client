#!/usr/bin/env sh

# See https://cli.vuejs.org/guide/deployment.html#github-pages

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:silverstripeltd/github-issue-search-client.git master:gh-pages

cd -
