import Koa from 'koa'
import Router from 'koa-router'
import mount from 'koa-mount'
import serve from 'koa-static'

import api from './api'

const static_dir = 'static'

export default () => {
    const app = new Koa()

    const router = new Router()
    router.use('/api', api.routes())

    const static_pages = new Koa()
    static_pages.use(serve(static_dir))

    app.use(mount('/', static_pages)).use(router.routes())
    return app
}
