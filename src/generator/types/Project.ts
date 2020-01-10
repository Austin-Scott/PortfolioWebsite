import fs from 'fs-extra'
import path from 'path'
import { MarkdownDocument } from "./MarkdownDocument"
import GitHub from 'github-api'

const gh = new GitHub({ token: JSON.parse(fs.readFileSync('GitHub_token.json', { encoding: 'utf8' })).token })

export interface Project {
    title: string
    githubRepo?: GitHubRepo
    about?: MarkdownDocument
    screenshots: Array<string>
}

interface RepoDetails {
    created_at: string
    updated_at: string
    description: string
    topics: Array<string>
    forks_count: number
    stargazers_count: number
    watchers_count: number
}

interface Repository {
    getDetails(cb: (error: object | null, result: RepoDetails, request: object) => void): Promise<object>
}

function getRepoDetails(repo: Repository): Promise<RepoDetails> {
    return new Promise((resolve, reject) => {
        repo.getDetails((error, result, request) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

class GitHubRepo {
    private repoOwner: string = ''
    private repoName: string = ''
    private repoDetails: RepoDetails | null = null
    constructor(private githubURL: string) {
        let githubMatcher = githubURL.match(/https:\/\/github\.com\/(.+)\/(.+)/)
        if (githubMatcher) {
            this.repoOwner = githubMatcher[1]
            this.repoName = githubMatcher[2]
        }
    }
    async initializeRepoDetails() {
        let repository: Repository = gh.getRepo(this.repoOwner, this.repoName)
        try {
            this.repoDetails = await getRepoDetails(repository)
        } catch (error) {
            console.log(error)
        }
    }
    getDetails(): RepoDetails {
        if (this.repoDetails) {
            return this.repoDetails
        } else {
            console.log('Warning: getDetails() was called before being ready')
            return {
                created_at: '',
                updated_at: '',
                description: '',
                topics: [],
                forks_count: 0,
                stargazers_count: 0,
                watchers_count: 0
            }
        }
    }
    getURL(): string {
        return this.githubURL
    }
    getName(): string {
        return this.repoName
    }
    getOwner(): string {
        return this.repoOwner
    }
}

interface ProjectJSON {
    title: string
    about?: string
    githubRepo?: string
    screenshots?: Array<string>
}

async function loadProject(filename: string): Promise<Project> {
    let projectJSON: ProjectJSON = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }))
    let about: MarkdownDocument | undefined = undefined
    if (projectJSON.about) {
        about = new MarkdownDocument(fs.readFileSync(path.join(path.dirname(filename), projectJSON.about), { encoding: 'utf8' }))
    }
    let githubRepo: GitHubRepo | undefined = undefined
    if (projectJSON.githubRepo) {
        githubRepo = new GitHubRepo(projectJSON.githubRepo)
        await githubRepo.initializeRepoDetails()
    }
    let screenshots: Array<string> = []
    if (projectJSON.screenshots) {
        screenshots = projectJSON.screenshots
    }

    return {
        title: projectJSON.title,
        githubRepo: githubRepo,
        about: about,
        screenshots: screenshots
    }

}

interface ProjectsJSON {
    projects: Array<string>
}

export async function loadProjects(filename: string): Promise<Array<Project>> {
    let projectsJSON: ProjectsJSON = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }))
    let promises: Array<Promise<Project>> = projectsJSON.projects.map<Promise<Project>>(async (projectFile, index, array): Promise<Project> => {
        return loadProject(path.join(path.dirname(filename), projectFile))
    })
    return Promise.all(promises)
}