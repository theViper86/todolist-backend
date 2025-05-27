#!/bin/bash

AWS_REGION=us-east-1
SECRET_NAME=rds!db-68d547ef-797c-42c9-a7da-eb3906df7759
DB_HOST=todo-plus-rds-mysql-db.cplmeghujodk.us-east-1.rds.amazonaws.com
DB_PORT=3306

yum update -y
aws s3 cp s3://todo-plus-code/nodejs/todo-plus-nodejs.zip /var
unzip /var/todo-plus-nodejs.zip -d /var
cd /var/todo-plus-nodejs
npm install
npm run build

echo "export AWS_REGION=$AWS_REGION" >> ~/.bashrc
echo "export SECRET_NAME=$SECRET_NAME" >> ~/.bashrc
echo "export DB_HOST=$DB_HOST" >> ~/.bashrc
echo "export DB_PORT=$DB_PORT" >> ~/.bashrc
source ~/.bashrc
pm2 start dist/main.js
