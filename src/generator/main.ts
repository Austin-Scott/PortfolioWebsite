import fs from 'fs-extra'
import path from 'path'
import pug from 'pug'
import { loadModel } from './types/Model'

async function buildSite() {
    console.log('Loading "content/main.json"...')
    let model = await loadModel('./content/main.json')

    console.log('Rendering views...')
    model.views.forEach(view => {
        const renderFunction = pug.compileFile(path.join('./views', view.file))
        const renderedHTML = renderFunction({ model: model, view: view.file.replace('.pug', '') })
        fs.writeFileSync(path.join('./_site', view.file.replace('.pug', '.html')), renderedHTML, { encoding: 'utf8' })
    })

    console.log('Copying static files...')
    fs.copySync('./static/', './_site/')

    console.log('...Done!')
}

buildSite()