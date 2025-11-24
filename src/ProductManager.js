import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {

  constructor(pathFile) {
    this.pathFile = pathFile
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addProduct(newProduct) {
    try {
      const products = await this.getProducts()

      const newId = this.generateNewId();
      const product = { id: newId, ...newProduct };
      products.push(product);

      await this.saveProducts(products)
      return products;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      //recuperar los productos
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      return products;
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async getProductsById(pid) {
      try {
        const products = await this.getProducts();
        const productFind = products.find((product) => product.id === pid);

      if(!productFind) throw new Error(`Producto con id ${pid} no encontrado`);

      return productFind;
      } catch (error) {
          throw new Error("Error al actualizar un producto: " + error.message);
      }
  }

  async saveProducts(products){
    try {
      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
    } catch (error) {
      throw new Error('Error al guardar los productos');
    }
  }

  async setProductById(pid, updates) {
    try {
      //recuperar los productos
      const products = await this.getProducts();

      const indexProduct = products.findIndex((product) => product.id === pid);

      if (indexProduct === -1) throw new Error(`Producto con id:${pid}  no encontrado`);

      products[indexProduct] = { ...products[indexProduct], ...updates };
      
      await this.saveProducts(products);
      return products;
    } catch (error) {
      throw new Error("Error al actualizar un producto: " + error.message);
    }
  }

  async deleteProductById(pid) {
    try {
      //recuperar los productos
      const products = await this.getProducts();

      const filteredProducts = products.filter((product) => product.id !== pid);

      //guardamos los productos en el json
      await this.saveProducts(filteredProducts)
      return filteredProducts;
    } catch (error) {
      throw new Error("Error al borrar un producto: " + error.message);
    }
  }
}

export default ProductManager;
