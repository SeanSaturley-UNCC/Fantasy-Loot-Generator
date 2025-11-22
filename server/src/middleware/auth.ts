import { NextFunction, Request, Response } from 'express'

const SECRET_KEY = 'eaa2de90-688f-4cbf-99cd-c30f837b3be4'

export const verifyClient = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const clientKey = req.cookies.clientKey || req.headers['x-client-key']
    if (!clientKey || clientKey !== SECRET_KEY) {
        return res.status(403).json({ message: 'Forbidden: invalid key' })
    }
    next()
}