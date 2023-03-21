import { AnyAction, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (actions: AnyAction) => {
    console.log(actions)
    return next(actions)
}
