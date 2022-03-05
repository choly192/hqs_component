import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ComponentType } from 'react';

export interface ControllerMethod extends Function {
    __Root_React_Element__: ComponentType;
}

export function Page(component: ComponentType) {
    if (component) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            (descriptor.value as ControllerMethod).__Root_React_Element__ = component;
        }
    }
}