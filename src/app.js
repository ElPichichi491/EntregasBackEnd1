import express from "express";
import CartManager from "./CartManager.js";
import ProductManager from "./ProductManager.js";


const app = express();
app.use( express.json() );  //Habilitamos poder recibir data en formato JSON
const PORT = 8080;

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager('./src/carts.json');

app.get('/', (req,res) =>{
    res.json("Entrega N°1 Santiago Hernan Gonzalez");
});

// GET /Debe listar todos los productos de la base de datos.
app.get('/api/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json({message: "Lista de productos: ", products});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//GET /:pid: Debe traer solo el producto con el id proporcionado.
app.get('/api/products/:pid', async(req,res) => {
    try {
        const pid = req.params.pid;
        const productFind = await productManager.getProductsById(pid);

        res.status(200).json( {message: "Producto encontrado exitosamente:", productFind} );

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST/:Debe agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json( {message: "Producto agregado exitosamente:", products} );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//PUT /:pid: Debe actualizar un producto por los campos enviados desde el body.
app.put("/api/products/:pid", async (req,res) => {
    try {
        const updateProduct = req.body;
        const pid = req.params.pid;
        const products = await productManager.setProductById(pid, updateProduct);
        res.status(200).json({ message: `Producto actualizado con id: ${pid}`, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /:pid: Debe eliminar el producto con el pid indicado.
app.delete("/api/products/:pid", async (req,res) => {
    try {
        const pid = req.params.pid;
        const prodcuts = await productManager.deleteProductById(pid);
        res.status(200).json({message: `Lista actualizada sin el producto con id: ${pid}`, prodcuts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//POST /: Debe crear un nuevo carrito 
app.post("/api/carts", async (req,res) => {
    try {
        const cart = await cartManager.addCart();  //Me esta retornando todos los carritos y aparte crea uno nuevo.

        res.status(201).json({ message: "Carrito creado correctamente:", cart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//GET /:cid: Debe listar los productos que pertenecen al carrito con el cid proporcionado.
app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cartFind = await cartManager.getCartsById(cid);

        res.status(200).json({ message: "Carrito encontrado exitosamente: ", cartFind});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST /:cid/product/:pid: Debe agregar el producto al arreglo products del carrito seleccionado
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cid = parseInt(req.params.cid);
    
        const newProducToCart = await cartManager.addProdcutsToCart(cid,pid);
        res.status(201).json({ message: 'Productos añadidos al carrito exitosamente', products: newProducToCart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.listen(PORT, () =>{
    console.log(`El servidor se ha levantado en el puerto http://localhost:${PORT}`)
});