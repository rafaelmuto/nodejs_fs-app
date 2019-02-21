const fs = require('fs');
const path = require('path');


const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // tries to read the file and if !err puts the file content in cart:
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // searches the array (cart.products) for an existing product and gets its id number:
            const existingProductIndex = cart.products.findIndex(prod => prod.id == id);
            // with the id number get the product
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            // if there is an existing product spread its contents in variable updatedProduct:
            if (existingProduct) {
                updatedProduct = {
                    ...existingProduct
                };
                // adds one to the updatedProduct.qty:
                updatedProduct.qty = updatedProduct.qty + 1;
                // cart.products = [...cart.products]; is this line really necessary? spreading the array into itself...
                // updating the cart.product[index] with the updated version (updatedProduct):
                cart.products[existingProductIndex] = updatedProduct;
            }
            // else just add a new entry to cart.products:
            else {
                updatedProduct = {
                    id: id,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            // write the cart obj to file:
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });

    };


};