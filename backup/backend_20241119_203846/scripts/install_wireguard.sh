#!/bin/bash

# Установка WireGuard
apt-get update
apt-get install -y wireguard

# Включаем IP forwarding
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Генерируем ключи сервера
cd /etc/wireguard
wg genkey | tee server_private.key | wg pubkey > server_public.key

# Создаем конфигурацию сервера
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = $(cat server_private.key)
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Клиенты будут добавляться автоматически
EOF

# Запускаем WireGuard
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

# Выводим публичный ключ сервера
echo "Server Public Key: $(cat server_public.key)"
echo "WireGuard установлен и настроен" 