import { MarkdownDocument } from './MarkdownDocument'

export interface Post {
    title: string
    datePosted: Date
    content: MarkdownDocument
}