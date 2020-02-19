# Chat App backend

## Prerequistes 
- Make sure you have docker and docker-compose install in your system

## How to run:
- sudo docker-compose build

## Create app on ejabberd
- sudo docker-compose exec ejabberd sh
- ejabberdctl oauth_add_client_password client_id client_name secret