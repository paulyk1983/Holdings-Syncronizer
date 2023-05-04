import { Request, Response, NextFunction } from 'express'
import { updateHoldingsDatabase } from '../services/notion-service'


// GET /notion/holdings
export const getHoldingsController = async (req: Request, res: Response) => {
    try {
        console.log('Request initiated...')
        // get csv-imported notion page (call Notion service -> sync notion page with holdings)
        // return 404 if notion page id cannot be found

        await updateHoldingsDatabase()
            
        console.log('request complete!')
        res.sendStatus(200)
    } catch (error) {
        console.log('Error on controller layer')
        console.log(error)

        res.status(500).json({title: 'Internal Error', message: 'Unhandled exception occured'})
    }
}