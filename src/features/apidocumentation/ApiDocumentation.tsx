import AsyncApi, { type ConfigInterface } from '@asyncapi/react-component'
import type Uri from 'urijs'

import { fromURL, type ParseOutput, Parser } from '@asyncapi/parser'
import { useEffect, useState } from 'react'

type ApiDocumentationProps = { url: string }

const customFileResolver = (url: Uri) => {
    return fetch(url.path()).then((value) => {
        return value.text()
    })
}

const parser = new Parser({
    __unstable: {
        resolver: {
            resolvers: [
                {
                    schema: 'file',
                    read: customFileResolver,
                },
            ],
        },
    },
})

const asyncApiConfig: ConfigInterface = {
    schemaID: 'asyncapi',
    show: {
        sidebar: false,
        info: true,
        servers: true,
        operations: true,
        messages: true,
        messageExamples: true,
        schemas: true,
        errors: true,
    },
    expand: {
        messageExamples: true,
    },
    sidebar: {
        showServers: 'byDefault',
        showOperations: 'byDefault',
        useChannelAddressAsIdentifier: true,
    },
    parserOptions: {},
}

export const ApiDocumentation = ({ url }: ApiDocumentationProps) => {
    const [result, setResult] = useState<ParseOutput | undefined>(undefined)

    useEffect(() => {
        fromURL(parser, url)
            .parse()
            .then((result: ParseOutput | undefined) => {
                setResult(result)
            })
    }, [url])

    if (!result?.document) {
        return 'Ошибка получения документации'
    }

    return <AsyncApi schema={result.document} config={asyncApiConfig} />
}
