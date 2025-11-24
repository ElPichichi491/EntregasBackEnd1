import fs from "node:fs/promises";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager('./src/products.json');

class CartManager {
    constructor(pathFile){
        this.pathFile = pathFile;
    }
    async generateId(){
        const carts = await this.getCarts();
        
        if(carts.length <= 0){
            return 1;
        }else{
            return carts[carts.length - 1].id + 1;
        }
    }

    async getCarts(){
        try {
            const data = await fs.readFile(this.pathFile, 'utf-8');
            const carts = JSON.parse(data);

            return carts;
        } catch (error) {
            throw new Error("Error la leer los carritos. " + error.message);
        }
    }

    async getCartsById(cid){
        try {
            const carts = await this.getCarts();
            const indexCart = carts.findIndex((cart) => cart.id === cid);
            if(indexCart === -1) throw new Error(`Carrito con id: ${cid} no encontrado`);

            return carts[indexCart];
        } catch (error) {
            throw new Error("Error en la busqueda. " + error.message);
        }
    }

    async saveCarts(carts){
        try {
            await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), 'utf-8');
        } catch (error) {
            throw new Error("Error al guardar los carritos. " + error.message);
        }
        
    }

    async addCart(){
        try {
            const carts = await this.getCarts(); // mis carritos
            const products = [];
            const lastId = await this.generateId();

            const cart = {id: lastId, products};

            carts.push(cart);
            await this.saveCarts(carts);

            return cart;
        } catch (error) {
            throw new Error("Error al añadir el nuevo producto: " + error.message);
        }
    }

    async addProdcutsToCart(cid, pid){
        try {
            const products = await productManager.getProducts();
            const carts = await this.getCarts();

            const productFind = products.findIndex((product) => product.id === pid);
            const cartFind = carts.findIndex((cart) => cart.id === cid);

            if(productFind === -1) throw new Error(`Producto con id: ${pid} no encontrado`);
            if(cartFind === -1) throw new Error(`Carrito con id: ${cid} no encontrado`);
            
             const productInCart = carts[cartFind].products.find(p => p.id === pid);

            if(productInCart){
                productInCart.quantity++;
            } else {
                carts[cartFind].products.push({id: pid, quantity: 1});
            }

            await this.saveCarts(carts);

            return carts;
        } catch (error) {
             throw new Error("Error al añadir productos al carrito: " + error.message);
        }
    }
}
export default CartManager;
