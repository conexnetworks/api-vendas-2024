import handlebars from 'handlebars'
import fs from 'node:fs'

type TemplateVariablesProps = {
  [key: string]: string | number
}

export type HandlebarsEmailTemplateProps = {
  file: string
  variables: TemplateVariablesProps
}

export class HandlebarsEmailTemplate {
  async parse({
    file,
    variables,
  }: HandlebarsEmailTemplateProps): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    })

    const parseTemplate = handlebars.compile(templateFileContent)
    return parseTemplate(variables)
  }
}
