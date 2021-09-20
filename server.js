import util from 'util'
import os from 'os'
import cp from 'child_process'
import http from 'http'

import app from './app'

class Server extends http.Server {
    constructor(...params) {
        super(...params)

        this.onServers = []
    }

    listen(port, ...args) {
        const server = super.listen(port, ...args)
        this.onServers.push(server)
        return server
    }

    async terminate() {
        for (const server of this.onServers) {
            server.close()
        }
        console.log('servers terminated')
    }
}

/**
 * 서버 listening 할 호스트에 영향 없음.
 * 서버에는 hostname을 안넘겨주기 때문에
 * localhost, 172.17.0.x 양쪽으로 리스닝 함.
 */
const showListeningLocation = async () => {
    let hostname
    const exec = util.promisify(cp.exec)
    if (os.platform() == 'linux') {
        const { stdout, stderr } = await exec('hostname -i')
        if (stderr) {
            hostname = 'localhost'
        } else {
            hostname = stdout.trim()
        }
    } else {
        hostname = 'localhost'
    }
    console.log(`==> 🌎  Listening on http://${hostname}:${port}`)
}

const port = process.env.PORT || 4000

const server = new Server(app().callback())
export default server

if (require.main === module) {
    
    server.listen(port, showListeningLocation)
}
