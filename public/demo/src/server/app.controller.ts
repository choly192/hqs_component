import { Controller, Get, Req, Res, UseInterceptors, } from "@nestjs/common";
import { Request, Response } from 'express';

import { App } from "../client/app"
import { Page } from "./common/decorators/page.Decorator";
import { RenderHtmlInterceptor } from "./common/interceptors/render.interceptor";

@Controller()
@UseInterceptors(RenderHtmlInterceptor)
export class AppController {
    @Get('/')
    @Page(App)
    getHello(@Req() req: Request) {
        return {
            initialState: {
                title: "hello world",
                btnTitle: "click"
            }
        }
    }
}