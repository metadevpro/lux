#!/bin/sh
SOURCE="../dist/lux-demo"
TARGET="lux.metadev.pro"
REGION=eu-south-2

cd .. && \
  npm run build && \
  cd scripts  && \
  ./deploy-to-s3.sh $SOURCE s3://${TARGET} &&
  aws s3api put-bucket-cors --bucket $TARGET \
      --cors-configuration file://lux-demo-cors.json \
      --region $REGION
