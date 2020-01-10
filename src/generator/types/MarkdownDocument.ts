import showdown from 'showdown'

export class MarkdownDocument {
    constructor(private rawText: string) {}
    getRaw(): string {
        return this.rawText
    }
    toHTML(): string {
        let convertor = new showdown.Converter()
        return convertor.makeHtml(this.rawText)
    }
}