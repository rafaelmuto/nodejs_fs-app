// importing models:
const productModel = require("../models/productModel");

// here we exports all shop routes functions:

exports.getIndex = (req, res, nxt) => {
  productModel
    .fetchAll()
    .then(products => {
      res.render("shop/index", {
        pageTitle: "Shop",
        path: "/",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, nxt) => {
  productModel
    .fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        pageTitle: "Shop",
        path: "/products",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, nxt) => {
  const prodId = req.params.productId;
  productModel
    .findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, nxt) => {
  req.user
    .getCart()
    .then(products => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, nxt) => {
  const prodId = req.body.productId;
  productModel
    .findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, nxt) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartitem.destroy();
    })
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, nxt) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout"
  });
};

exports.postOrder = (req, res, nxt) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderitem = { quantity: product.cartitem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, nxt) => {
  req.user
    .getOrders({ include: ["products"] })
    .then(orders => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
