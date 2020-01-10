import { Post } from "./Post"
import { Project } from "./Project"
import { MarkdownDocument } from "./MarkdownDocument"
import fs from 'fs-extra'
import path from 'path'

interface Model {
    aboutMe?: MarkdownDocument
    posts: Array<Post>
    projects: Array<Project>
    views: Array<string>
    lastRenderedOn: Date
}

interface MainJSON {
    views: Array<string>
    projects: string
    posts: string
    aboutMe?: string
}

export function loadModel(filename: string): Model {
    let mainJSON: MainJSON = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }))
    let aboutMe: MarkdownDocument | undefined
    if(mainJSON.aboutMe) {
        aboutMe = new MarkdownDocument(fs.readFileSync(path.join('./content/', mainJSON.aboutMe), { encoding: 'utf8' }))
    }

    return {
        aboutMe: aboutMe,
        posts: [],
        projects: [],
        views: mainJSON.views,
        lastRenderedOn: new Date()
    }
}