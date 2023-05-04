import express, {Express, Request, Response} from 'express'
import { getHoldingsController } from './controllers/notion'
import * as dotenv from 'dotenv'

const app: Express = express()
const port = 3000

app.get('/', (req: Request, res: Response)=>{
    res.send('Hello world!')
})

app.get('/notion/holdings', (req: Request, res: Response)=>{
    getHoldingsController(req, res)
})

app.listen(port, ()=> {
dotenv.config()
console.log(`[Server]: I am running at http://localhost:${port}`)
})