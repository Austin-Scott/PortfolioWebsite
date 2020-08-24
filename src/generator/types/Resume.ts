import fs from 'fs-extra'
import path from 'path'
import { MarkdownDocument } from "./MarkdownDocument"
import GitHub from 'github-api'

export interface Resume {
    sections: [
        {
            name: string
            content: [
                {
                    boldTitle?: string
                    normalTitle?: string
                    lightTitle?: string
                    description?: string
                }
            ]
        }
    ]
}

export async function loadResume(filename: string): Promise<Resume> {
    let resume: Resume = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }))
    return resume
}
