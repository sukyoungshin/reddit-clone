import React, { createContext, useContext, useReducer } from "react";
import { User } from "../types";

type StateType = {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;  
}

const StateContext = createContext<StateType>({
  authenticated: false,
  user: undefined,
  loading: true
});

const DispatchContext = createContext<any>(null);

type ActionType = {
  type: string;
  payload: any;
};
const reducer = (state: StateType, {type, payload}: ActionType) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload
      }
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null
      }
    case "STOP_LOADING":
      return {
        ...state,
        loading: false
      }
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

type AuthProviderType = {
  children: React.ReactNode
};
export const AuthProvider = ({ children }: AuthProviderType) => {
  const [state, defaultDispatch ] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        { children }
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);