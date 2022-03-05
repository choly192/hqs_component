import { ComponentType } from "react"
import { GlobalContext } from "../context/GlobalContext"

declare let window: any;

export const buildHtml = (initState: any, element: ComponentType): ComponentType => {
    let Html: React.FC = () => {
        return (
            <GlobalContext.Provider value={initState}>
                <Head />
                <Body element={element} value={initState}/>
            </GlobalContext.Provider >
        )
    }
    return Html
}

const Head: React.FC = () => {
    return (
        <head>
            <title>b2c-site-demo</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
    )
}

const Body: React.FC<{
    element: ComponentType,
    value: any
}> = ({ element, value }) => {
    const Content = element;
    return (
        <body>
            <div id="root"><Content /></div>
            <script src="http://localhost:3001/bundle.js" defer></script>
            <script
                defer
                dangerouslySetInnerHTML={{
                    __html: `window.__initialState__ = ${JSON.stringify(value)}`
                }}
            />
        </body>
    )
}