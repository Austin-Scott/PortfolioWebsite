import fs from 'fs-extra'
import path from 'path'
import pug from 'pug'
import { loadModel } from './types/Model'

function buildSite(): void {
    console.log('Loading "content/main.json"...')
    let model = loadModel('./content/main.json')

    console.log('Rendering views...')
    model.views.forEach(view => {
        const renderFunction = pug.compileFile(path.join('./views', view))
        const renderedHTML = renderFunction({ model: model })
        fs.writeFileSync(path.join('./_site', view.replace('.pug', '.html')), renderedHTML, { encoding: 'utf8' })
    })

    console.log('Copying static files...')
    fs.copySync('./static/', './_site/')

    console.log('...Done!')
}

buildSite()