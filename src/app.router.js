import connectDB from '../db/connection.js';
import categoriesRouter from './modules/category/category.router.js';
import productsRouter from './modules/product/product.router.js';
import authRouter from './modules/auth/auth.router.js';
import cartRouter from './modules/cart/cart.router.js';
import userRouter from './modules/user/user.router.js';

import cors from 'cors';

const initApp = (app, express) => {
	connectDB();
	app.use(cors());
	app.use(express.json())
	app.get('/api/health-check', (req, res) => {
		return res.status(200).json({ msg: "success" });
	})
	app.use('/api/categories', categoriesRouter);
	app.use('/api/auth', authRouter);
	app.use('/api/products', productsRouter);
	app.use('/api/cart', cartRouter);
	app.use('/api/users', userRouter);

	app.use('/api/*', (req, res) => {
		return res.status(404).json({ msg: "Page Not Found" });
	})
}

export default initApp;
