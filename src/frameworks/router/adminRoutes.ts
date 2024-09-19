import express from 'express'
import AdminRepo from '../../adapters/repositories/adminRepo';
import AdminUseCase from '../../usecase/adminUseCase';
import AdminController from '../../adapters/controllers/adminController';
import JwtService from '../utils/jwtService.utils';
import Users from '../models/userSchema';
import Accommodations from '../models/accommodationSchema';
import Bookings from '../models/bookingSchema';
import { authAdminJwt } from '../middleware/adminAuthMiddleware';

const adminRouter = express.Router();

const adminRepo = new AdminRepo(Users, Accommodations, Bookings)
const jwtService = new JwtService();
const adminUseCase = new AdminUseCase(adminRepo, jwtService)
const adminController = new AdminController(adminUseCase)

adminRouter.post('/login', adminController.adminLogin.bind(adminController))

adminRouter.post('/logout', adminController.adminLogout.bind(adminController))

adminRouter.get('/checkAuth',adminController.checkAuth.bind(adminController))

adminRouter.get('/getUser', authAdminJwt, adminController.getUsers.bind(adminController));

adminRouter.patch('/toggleBlockUser/:userId', authAdminJwt, adminController.toggleBlockUser.bind(adminController));

adminRouter.get('/getHotels', authAdminJwt, adminController.getHotels.bind(adminController));

adminRouter.get('/getHotelById/:hotelId', authAdminJwt, adminController.getHotelById.bind(adminController))

adminRouter.post('/approve-hotel/:hotelId', authAdminJwt, adminController.approveHotel.bind(adminController));

adminRouter.patch('/reject-hotel/:hotelId', authAdminJwt, adminController.rejectHotel.bind(adminController))

adminRouter.get('/sales/daily', authAdminJwt, adminController.getDailySales.bind(adminController))

adminRouter.get('/sales/weekly', authAdminJwt, adminController.getWeeklySales.bind(adminController))

adminRouter.get('/sales/monthly', authAdminJwt, adminController.getMonthlySales.bind(adminController))

adminRouter.get('/dashboard-stats', authAdminJwt, adminController.getDashboardStats.bind(adminController));

export default adminRouter;  