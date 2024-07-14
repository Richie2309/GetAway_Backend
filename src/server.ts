import dotenv from 'dotenv';
dotenv.config();
import app from './frameworks/config/app'

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
}); 