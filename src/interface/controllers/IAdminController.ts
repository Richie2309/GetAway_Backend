import { Request, Response } from "express"

interface IAdminController {
    adminLogin(req: Request, res: Response): Promise<void>
    adminLogout(req: Request, res: Response): Promise<void>
    checkAuth(req: Request, res: Response): Promise<void>
    getUsers(req: Request, res: Response): Promise<void>
    toggleBlockUser(req: Request, res: Response): Promise<void>
    getHotels(req: Request, res: Response): Promise<void>
    getHotelById(req: Request, res: Response): Promise<void>;
    getHotelDetailsById(req: Request, res: Response): Promise<void>;
    approveHotel(req: Request, res: Response): Promise<void>
    rejectHotel(req: Request, res: Response): Promise<void>
    getDailySales(req: Request, res: Response): Promise<void>;
    getWeeklySales(req: Request, res: Response): Promise<void>;
    getMonthlySales(req: Request, res: Response): Promise<void>;
    getDashboardStats(req: Request, res: Response): Promise<void>;
}

export default IAdminController