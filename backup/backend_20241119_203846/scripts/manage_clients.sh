#!/bin/bash

function add_client() {
    local client_id=$1
    local client_public_key=$2
    
    # Добавляем конфигурацию клиента в wg0.conf
    cat >> /etc/wireguard/wg0.conf << EOF

[Peer]
PublicKey = ${client_public_key}
AllowedIPs = 10.0.0.${client_id}/32
EOF

    # Перезагружаем WireGuard
    wg syncconf wg0 <(wg-quick strip wg0)
}

function remove_client() {
    local client_public_key=$1
    
    # Удаляем конфигурацию клиента из wg0.conf
    sed -i "/PublicKey = ${client_public_key}/,+1d" /etc/wireguard/wg0.conf
    
    # Перезагружаем WireGuard
    wg syncconf wg0 <(wg-quick strip wg0)
}

case "$1" in
    "add")
        add_client "$2" "$3"
        ;;
    "remove")
        remove_client "$2"
        ;;
    *)
        echo "Usage: $0 {add|remove} [client_id] [client_public_key]"
        exit 1
        ;;
esac 