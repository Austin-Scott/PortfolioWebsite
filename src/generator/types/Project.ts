import { MarkdownDocument } from "./MarkdownDocument"

export interface Project {
    title: string
    about: MarkdownDocument
    startedOnDate: Date
    lastWorkedOnDate?: Date
    screenshots: Array<string>
}