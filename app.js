const ApiError = require('./app/api-error');
const config = require('./app/config/index');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cors({ credentials: true, origin: ['http://localhost:9999', 'http://localhost:10000']}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const authRouter = require('./app/routes/auth.route');
const userRouter = require('./app/routes/user.route');
const staffRouter = require('./app/routes/staff.route');
const bookRouter = require('./app/routes/book.route');
const seriesRouter = require('./app/routes/series.route');
const genresRouter = require('./app/routes/genres.route');
const orderRouter = require('./app/routes/order.route')
const inventoryRouter = require('./app/routes/inventory.route');

app.use(config.app.base_api + '/auth', authRouter);
app.use(config.app.base_api + '/users', userRouter);
app.use(config.app.base_api + '/staffs', staffRouter);
app.use(config.app.base_api + '/books', bookRouter);
app.use(config.app.base_api + '/series', seriesRouter);
app.use(config.app.base_api + '/genres', genresRouter);
app.use(config.app.base_api + '/orders', orderRouter);
app.use(config.app.base_api + '/inventory', inventoryRouter);


// middleware xử lí lỗi
app.use((error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({message: error.message});
  }
  console.log(error);
  res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lí ở server' });
});

module.exports = app;
