import { Request, Response, NextFunction } from 'express';


// GET /notion/holdings
export const getHoldingsController = async (req: Request, res: Response) => {
    try {
        // get csv-imported notion page (call Notion service -> sync notion page with holdings)
        // return 404 if notion page id cannot be found
        
        const result = { status: 200}
        
        if (result.status && result.status == 404) {
            result
            res.status(404).json(result)
        } else {
            res.status(200).json(result)
        }

    } catch (error) {
        console.log("Error on controller layer")
        console.log(error)

        res.status(500).json({title: 'Internal Error'})
    }
}