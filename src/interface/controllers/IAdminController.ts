import { Request, Response } from "express"

interface IAdminController {
    adminLogin(req: Request, res: Response): Promise<void>
    getUsers(req: Request, res: Response): Promise<void>
    toggleBlockUser(req: Request, res: Response): Promise<void>
    getHotels(req: Request, res: Response): Promise<void>
    getHotelById(req: Request, res: Response): Promise<void>;
    approveHotel(req: Request, res: Response): Promise<void>
    rejectHotel(req: Request, res: Response): Promise<void>
}

export default IAdminController