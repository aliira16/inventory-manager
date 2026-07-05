import e from "express";
import cors from "cors"
import dotenv from "dotenv"
import productRoutes from "./router/products.routes.js"
import categoryRoutes from "./router/categories.routes.js"
import supplierRoutes from "./router/suppliers.routes.js"
import movementRoutes from "./router/movement.routes.js"

dotenv.config();
const app = e()

const PORT = process.env.PORT || 3000
app.use(cors()); 
app.use(e.json());
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/movements', movementRoutes);

app.get('/', (req, res)=> res.json({message : 'Inventory Manager API running'}));
app.listen(PORT, ()=>console.log(`server running in port ${PORT}`))