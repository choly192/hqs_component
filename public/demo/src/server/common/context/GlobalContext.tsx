import { createContext, useContext } from "react";

export let GlobalContext = createContext<{
  initialState: any;
}>(undefined);


export let useInitialState = <T,>(): T =>
  useContext(GlobalContext)?.initialState;