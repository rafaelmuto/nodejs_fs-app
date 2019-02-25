// importing core module to construct paths and file system in node.js:
const fs = require('fs');
const path = require('path');


const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

const getCartFromFile = (callBack) => {
    // tries to read the file and callbacks the content:
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            callBack({
                products: [],
                totalPrice: 0
            })
        } else {
            callBack(JSON.parse(fileContent));
        }
    });
};

module.exports = class Cart {
    static addProduct(id, productPrice) {
        getCartFromFile(cart => {
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

    }

    static deleteProduct(id, price) {
        getCartFromFile(cart => {
            const updatedCart = {
                ...cart
            };
            const product = updatedCart.products.find(prod => prod.id == id);
            updatedCart.products = updatedCart.products.filter(prod => prod.id != id);
            updatedCart.totalPrice = updatedCart.totalPrice - price * product.qty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            })
        });
    }

    static getCart(cb) {
        getCartFromFile(cb);
    }


};