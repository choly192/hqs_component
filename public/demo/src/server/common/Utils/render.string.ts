import { ComponentType, createElement } from "react";
import { renderToNodeStream, renderToStaticNodeStream, renderToString } from "react-dom/server";
import { Observable } from "rxjs";
import { buildHtml } from "../component/Html";

export let renderT0String = (
    element: ComponentType,
    instate: any,
    reply: any
) => {
    return new Promise((resolve:any, reject:any) => {
        let htmlComponent = buildHtml(instate, element);

        let stream = renderToNodeStream(createElement(htmlComponent)) as any;

        reply.write("<!DOCTYPE html>");
        stream.pipe(reply, { end: false })
        stream.on('end', () => {
            reply.end();
            resolve();
        });
        stream.on('error', () => {
            reject();
        });
    })
};
