import express from "express";
import ProductManagerFs from "./ProductsManager.fs.js";
import CartManagerFs from "./CartManager.fs.js";

const app = express() 

const productManager = new ProductManagerFs()
const cartManager = new CartManagerFs()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(8080, ()=> {
    console.log("El servidor esta escuchando el puerto 8080")
})

app.get("/api/products", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null
    const products = productManager.getProducts(limit);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(products))
})

app.get("/api/products/:pid", (req, res) => {
    const products = productManager.getProductsById(req.params.pid);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(products))
})

app.post("/api/products", (req, res) => {
    const product = req.body;
    try {
        productManager.addProduct(product);
        return res.status(200).send({status: "success", message: "product created"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.delete("/api/products/:pid", (req, res) => {
    try {
        productManager.removeProductsById(req.params.pid);
        return res.status(200).send({status: "success", message: "product deleted"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.put("/api/products/:pid", (req, res) => {
    try {
        productManager.updateProductsById(req.params.pid, req.body);
        return res.status(200).send({status: "success", message: "product updated"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.post("/api/carts", (req, res) => {
    try {
        cartManager.addCart();
        return res.status(200).send({status: "success", message: "cart created"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.get("/api/carts/:cid", (req, res) => {
    const carts = cartManager.getCartsById(req.params.cid);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(carts))
})

app.post("/api/carts/:cid/products/:pid", (req, res) => {
    try {
        cartManager.updateCartsById(req.params.cid, req.params.pid);
        return res.status(200).send({status: "success", message: "product added to cart"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})
