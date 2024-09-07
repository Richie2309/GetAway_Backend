import express from 'express'
import IAdminRepo from '../../interface/repositories/IAdminRepo';
import AdminRepo from '../../adapters/repositories/adminRepo';
import AdminUseCase from '../../usecase/adminUseCase';
import AdminController from '../../adapters/controllers/adminController';
import JwtService from '../utils/jwtService.utils';
import Users from '../models/userSchema';
import Accommodations from '../models/accommodationSchema';
import Bookings from '../models/bookingSchema';

const adminRouter = express.Router();

const adminRepo = new AdminRepo(Users, Accommodations, Bookings)
const jwtService = new JwtService();
const adminUseCase = new AdminUseCase(adminRepo, jwtService)
const adminController = new AdminController(adminUseCase)

adminRouter.post('/login', adminController.adminLogin.bind(adminController))

adminRouter.get('/getUser', adminController.getUsers.bind(adminController));

adminRouter.patch('/toggleBlockUser/:userId', adminController.toggleBlockUser.bind(adminController));

adminRouter.get('/getHotels', adminController.getHotels.bind(adminController));

adminRouter.get('/getHotelById/:hotelId', adminController.getHotelById.bind(adminController))

adminRouter.post('/approve-hotel/:hotelId', adminController.approveHotel.bind(adminController));

adminRouter.patch('/reject-hotel/:hotelId', adminController.rejectHotel.bind(adminController))

adminRouter.get('/sales/daily', adminController.getDailySales.bind(adminController))

adminRouter.get('/sales/weekly', adminController.getWeeklySales.bind(adminController))

adminRouter.get('/sales/monthly', adminController.getMonthlySales.bind(adminController))

export default adminRouter;  