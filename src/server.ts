import dotenv from 'dotenv';
import { createServer } from 'http'
dotenv.config();
import app from './frameworks/config/app'
import initializeSocketIO from './frameworks/config/socket';

const server = createServer(app)
export const io = initializeSocketIO(server)


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
}); 