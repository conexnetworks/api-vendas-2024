import handlebars from 'handlebars'

type TemplateVariablesProps = {
  [key: string]: string
}

type HandlebarsEmailTemplateProps = {
  template: string
  variables: TemplateVariablesProps
}

export class HandlebarsEmailTemplate {
  private template: HandlebarsTemplateDelegate

  async parse({
    template,
    variables,
  }: HandlebarsEmailTemplateProps): Promise<string> {
    const parseTemplate = handlebars.compile(template)
    return parseTemplate(variables)
  }
}
