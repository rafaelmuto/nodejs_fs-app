// importing node packages:
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// importing models:
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');

const ITENS_PER_PAGE = 3;

// here we exports all shop routes functions:

exports.getIndex = (req, res, nxt) => {
  console.log('==> shopController: getIndex');
  let page = 1;
  if (+req.query.page) {
    page = +req.query.page;
  }

  let totalItems;

  productModel
    .find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return productModel
        .find()
        .skip((page - 1) * ITENS_PER_PAGE)
        .limit(ITENS_PER_PAGE);
    })
    .then(products => {
      // console.log("-> products list:", products);
      return res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        products: products,
        currentPage: page,
        hasNextPage: ITENS_PER_PAGE * page < totalItems,
        hasPrevousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITENS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.getProducts = (req, res, nxt) => {
  console.log('==> shopController: getProducts');
  let page = 1;
  if (+req.query.page) {
    page = +req.query.page;
  }

  let totalItems;

  productModel
    .find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return productModel
        .find()
        .skip((page - 1) * ITENS_PER_PAGE)
        .limit(ITENS_PER_PAGE);
    })
    .then(products => {
      // console.log("-> products list:", products);
      return res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/products',
        products: products,
        currentPage: page,
        hasNextPage: ITENS_PER_PAGE * page < totalItems,
        hasPrevousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITENS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.getProduct = (req, res, nxt) => {
  console.log('==> shopController: getProduct');
  const prodId = req.params.productId;
  productModel
    .findById(prodId)
    .then(product => {
      console.log('-> product:', product._id);
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.getCart = (req, res, nxt) => {
  console.log('==> shopController: getCart');
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      // console.log("-> cart product list");
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.postCart = (req, res, nxt) => {
  console.log('==> shopController: postCart');
  const prodId = req.body.productId;
  productModel
    .findById(prodId)
    .then(product => {
      console.log('-> product added to cart:', product._id);
      req.user.addToCart(product);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.postCartDeleteProduct = (req, res, nxt) => {
  console.log('==> shopController: postCartDeleteProduct');
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      console.log('-> removing product from cart:', prodId);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.postOrder = (req, res, nxt) => {
  console.log('==> shopController: postOrder');
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { qnt: i.qnt, productData: { ...i.productId._doc } };
      });
      const order = new orderModel({
        user: {
          name: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.getOrders = (req, res, nxt) => {
  console.log('==> shopController: getOrders');
  orderModel
    .find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

// exports.getCheckout = (req, res, nxt) => {
//   res.render('shop/checkout', {
//     pageTitle: 'Checkout',
//     path: '/checkout'
//   });
// };

exports.getInvoice = (req, res, nxt) => {
  console.log('==> shopController: getInvoice');
  const orderId = req.params.orderId;

  orderModel
    .findById(orderId)
    .then(order => {
      if (!order) {
        console.log('-> order not found.');
        return nxt(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        console.log('-> wrong user...');
        return nxt(new Error('Unauthorized'));
      }
      console.log('-> orderId: ', order._id);
      const invoiceName = orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      // creating a new pdf document
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc
        .font('Courier')
        .fontSize(24)
        .text('Invoice #' + order._id);
      pdfDoc.fontSize(10).text('---------------------------------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.qnt * prod.productData.price;
        pdfDoc.fontSize(18).text(prod.productData.title);
        pdfDoc
          .fontSize(14)
          .text(
            'Price: $' +
              prod.productData.price +
              '(x' +
              prod.qnt +
              ') = ' +
              '$' +
              prod.productData.price * prod.qnt
          );
        pdfDoc.fontSize(9).text(prod.productData.description);
        pdfDoc
          .fontSize(10)
          .text('---------------------------------------------');
      });
      pdfDoc.fontSize(16).text('Total: $' + totalPrice);
      pdfDoc.end();
    })
    .catch(err => nxt(err));
};
