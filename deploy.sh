#!/usr/bin/env bash
# Deploy por SSH: envia o commit atual ao servidor e sobe o compose de produção lá.
# Uso: ./deploy.sh  (SERVIDOR, PORTA e CHAVE podem ser trocados por variáveis de ambiente)
set -euo pipefail

SERVIDOR=${SERVIDOR:-deploy@localhost}
PORTA=${PORTA:-2222}
CHAVE=${CHAVE:-infra/servidor/chave/id_ed25519}
SSH_OPCOES="-i $CHAVE -p $PORTA -o StrictHostKeyChecking=accept-new"
COMPOSE="docker compose --env-file .env.production -f compose.prod.yaml"

remoto() { ssh $SSH_OPCOES "$SERVIDOR" "$@"; }

COMMIT=$(git rev-parse --short HEAD)
echo "==> deploy do commit $COMMIT em $SERVIDOR"

echo "==> 1. enviando o código"
remoto 'test -d api-vendas.git || git init --quiet --bare api-vendas.git'
GIT_SSH_COMMAND="ssh $SSH_OPCOES" git push --quiet --force "$SERVIDOR:api-vendas.git" HEAD:refs/heads/main
remoto "test -d app || git clone --quiet api-vendas.git app
  cd app && git fetch --quiet origin && git checkout --quiet --detach $COMMIT && git log --oneline -1"

echo "==> 2. variáveis de produção"
scp -q -P "$PORTA" -i "$CHAVE" -o StrictHostKeyChecking=accept-new .env.production "$SERVIDOR:app/.env.production"

echo "==> 3. imagem, migrações e serviços"
remoto "cd app && $COMPOSE build --quiet api && $COMPOSE run --rm api npm run migration:run:prod && $COMPOSE up -d --wait"

echo "==> deploy do commit $COMMIT concluído"
