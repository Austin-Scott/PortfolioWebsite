import fs from 'fs-extra'

function buildSite(): void {
    console.log('Copying static files...')
    fs.copySync('./static/', './_site/')

    console.log('...Done!')
}

buildSite()