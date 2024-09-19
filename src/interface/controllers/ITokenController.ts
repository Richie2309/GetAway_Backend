import { NextFunction, Request, Response } from "express"

interface ITokenController {

  handleRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void>
}

export default ITokenController 