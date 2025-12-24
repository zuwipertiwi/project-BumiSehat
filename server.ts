/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata'
import './start/mongodb'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'

sourceMapSupport.install({ handleUncaughtExceptions: false })

// Handle environment for Vercel
if (process.env.NODE_ENV === 'production') {
  process.env.HOST = process.env.HOST || '0.0.0.0'
  process.env.PORT = process.env.PORT || '3000'
}

const ignitor = new Ignitor(__dirname)

if (require.main === module) {
  ignitor.httpServer().start()
}
