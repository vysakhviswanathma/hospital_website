const Mustache = require('mustache');
const fs = require('fs').promises;

async function renderTemplate(templateName, templateData) {
  const template = await fs.readFile(`${__dirname}/${templateName}`, 'utf-8');
  const rendered = Mustache.render(template.toString(), templateData);
  return rendered;
}

module.exports = {
  renderTemplate,
};
