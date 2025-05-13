import express, {NextFunction, Response, Request} from 'express';
import userRoutes from './routes/users';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


export default app;