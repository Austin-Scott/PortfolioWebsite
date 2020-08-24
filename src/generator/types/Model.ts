import { Project, loadProjects } from "./Project"
import { Resume, loadResume } from "./Resume"
import { MarkdownDocument } from "./MarkdownDocument"
import fs from 'fs-extra'
import path from 'path'

interface Model {
    aboutMe?: MarkdownDocument
    projects: Array<Project>
    resume: Resume
    views: Array<View>
    lastRenderedOn: Date
}

interface View {
    file: string
    title: string
}

interface MainJSON {
    views: Array<[string, string]>
    projects?: string
    posts?: string
    aboutMe?: string
    resume: string
}

export async function loadModel(filename: string): Promise<Model> {
    let mainJSON: MainJSON = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }))
    let aboutMe: MarkdownDocument | undefined
    if(mainJSON.aboutMe) {
        aboutMe = new MarkdownDocument(fs.readFileSync(path.join('./content/', mainJSON.aboutMe), { encoding: 'utf8' }))
    }
    let projects: Array<Project> = []
    if(mainJSON.projects) {
        projects = await loadProjects(path.join(path.dirname(filename), mainJSON.projects))
    }
    let resume = await loadResume(path.join(path.dirname(filename), mainJSON.resume))

    return {
        aboutMe: aboutMe,
        projects: projects,
        resume: resume,
        views: mainJSON.views.map(view => {
            return {
                file: view[0],
                title: view[1]
            }
        }),
        lastRenderedOn: new Date()
    }
}