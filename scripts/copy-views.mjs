// Copia os templates de e-mail (.hbs) para o dist: o tsc só compila os arquivos .ts.
import { cpSync } from 'node:fs'

cpSync('src/users/infrastructure/views', 'dist/users/infrastructure/views', {
  recursive: true,
})
