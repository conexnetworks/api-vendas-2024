#!/bin/sh
# A chave pública do curso chega montada em /run/chave.pub; o sshd exige dono e permissões certos.
set -e
install -o deploy -g deploy -m 600 /run/chave.pub /home/deploy/.ssh/authorized_keys
dockerd > /var/log/dockerd.log 2>&1 &
exec /usr/sbin/sshd -D -e
