import React, { useEffect, useRef } from "react";
import { useInitialState } from "../server/common/context/GlobalContext";

interface AppProps { }
declare const window: any;

export const App: React.FC<AppProps> = () => {

    const initState: any = useInitialState();
    const platform = useRef<string>(
        typeof window !== "undefined" ? "client" : "server"
    );

    return (
        <React.Fragment>
            <div>{initState.title}</div>
            <span className={platform.current}>The platform is {platform.current}</span>
            <div>
                <button onClick={() => console.log(123)}>{initState.btnTitle}</button>
            </div>
        </React.Fragment>
    );
};
