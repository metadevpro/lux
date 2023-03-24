#!/bin/sh
SOURCE=$1
TARGET=$2
REGION=eu-south-2

echo `date --iso=s` Deploying folder $SOURCE to $TARGET synchronizing contents.

aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.yaml' --content-type 'text/yaml' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.ess' --content-type 'text/plain' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.json' --content-type 'application/json' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.js' --content-type 'application/javascript' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.ico' --content-type 'image/x-icon"' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.svg' --content-type 'image/svg+xml' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.png' --content-type 'image/png' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.jpg' --content-type 'image/jpg' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.html' --content-type 'text/html' $SOURCE $TARGET
aws s3 sync --delete --acl public-read --exclude '*' --source-region $REGION --region $REGION --include '*.css' --content-type 'text/css' $SOURCE $TARGET

echo `date --iso=s` Deploy finished.
