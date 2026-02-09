import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
// Middleware
app.use(helmet());             
app.use(cors());                 
app.use(express.json());        
app.use(morgan('dev'));        

// Routes

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        }); 
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();