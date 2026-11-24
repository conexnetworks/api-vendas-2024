#!/bin/sh
# Roda quando o LocalStack fica pronto: verifica o remetente padrão da API no SES
awslocal ses verify-email-identity --email-address nao-responda@example.com
