import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ComponentType } from "react";
import { Observable, Observer } from "rxjs";
import { catchError, flatMap, switchMap, tap, map } from "rxjs/operators";
import { buildHtml } from "../component/Html";

import { ControllerMethod } from "../decorators/page.Decorator";
import { renderT0String } from "../Utils/render.string";


@Injectable()
export class RenderHtmlInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        let element = (context.getHandler() as ControllerMethod)
            .__Root_React_Element__;
        if (!element) {
            return next.handle();
        }

        const reply = context.switchToHttp().getResponse();

        return next
            .handle()
            .pipe(
                map(value => renderT0String(element, value, reply)),
                catchError((error) => {
                    throw error;
                })
            )
    }
}