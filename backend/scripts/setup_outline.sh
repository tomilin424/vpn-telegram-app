#!/bin/bash

# Установка Outline
bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)" > /root/outline/install.log 2>&1

# Настройка файрвола
ufw allow 51820/udp
ufw allow 3001/tcp 