#!/usr/bin/env bash
ng build --project iwe7-base
cd dist/iwe7-base
npm publish
cd ../
rm -rf dist/iwe7-base
yarn add iwe7-base
