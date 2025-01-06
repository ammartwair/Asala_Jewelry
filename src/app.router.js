import connectDB from '../db/connection.js';
import categoriesRouter from './modules/category/category.router.js';
import productsRouter from './modules/product/product.router.js';
import authRouter from './modules/auth/auth.router.js';
import cors from 'cors';

const initApp = (app, express) => {
	connectDB();
	app.use(cors());
	app.use(express.json())
	app.get('/', (req, res) => {
		return res.status(200).json({ msg: "success" });
	})
	app.use('/categories', categoriesRouter);
	app.use('/auth', authRouter);
	app.use('/products', productsRouter);

	app.use('*', (req, res) => {
		return res.status(404).json({ msg: "Page Not Found" });
	})
}

export default initApp;
