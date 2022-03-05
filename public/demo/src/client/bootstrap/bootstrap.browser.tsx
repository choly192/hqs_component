import React, { ComponentType } from "react";
import { hydrate } from "react-dom";
import { GlobalContext } from "../../server/common/context/GlobalContext";

let initialState = typeof window !== 'undefined' && (window as any)?.__initialState__;

export const clientBootstrap = (component: ComponentType)=>{
    let Component = component;
    let App = ()=>{
        return (
            <GlobalContext.Provider value={initialState}>
                <Component/>
            </GlobalContext.Provider>
        )
    }
    hydrate(<App />, document.getElementById('root'));
}