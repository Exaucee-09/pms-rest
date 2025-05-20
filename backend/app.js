require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');
const vehicleRoutes = require('./routes/vehicles');
const ticketRoutes = require('./routes/tickets');

const app = express();

console.log('JWT_SECRET: ', process.env.JWT_SECRET);
//Middleware
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token','Authorization'],
    credentials: true
})); //Enable CORS for all routes
app.use(express.json()); //Parse JSON request bodies

//Swagger documentation setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Parking Management System API',
            version: '1.0.0',
            description: 'API for managing parking spots and user authentication',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], //files containing annotation as above
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/vehicles',vehicleRoutes);
app.use('/api/tickets', ticketRoutes );

//Basic route for testing
app.get('/', (req, res) => {
    res.send('Parking Management System API');
});

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});