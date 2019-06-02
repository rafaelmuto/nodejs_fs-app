// importing Product model:
const productModel = require("../models/productModel");

// importing express-validator:
const { validationResult } = require("express-validator/check");

// here we exports all admin routes functions:

// you can use module.exports or just exports...
exports.getAddProduct = (req, res, nxt) => {
  console.log("==> adminController: getAddProduct");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    // pug doesnt care about having or not the edit: false here:
    edit: false,
    hasError: false
  });
};

exports.postAddProduct = (req, res, nxt) => {
  console.log("==> adminController: postAddProduct");
  const title = req.body.title;
  const imageUrl = req.body.image;
  const price = req.body.price;
  const description = req.body.description;

  // router validation response:
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("-> validation error:", errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/add-product",
      edit: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg
    });
  }

  const product = new productModel({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    // mongoose will automatically get the _id from the userModel Obj:
    userId: req.user
  });

  product
    .save()
    .then(result => {
      // console.log(result);
      console.log("-> new product added:", product._id);
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.getEditProduct = (req, res, nxt) => {
  console.log("==> adminController: getEditProduct");
  const editMode = req.query.edit;
  if (!editMode) {
    console.log("-> acesses denied: editMode == FALSE");
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  productModel
    .findById(prodId)
    .then(product => {
      if (!product) {
        console.log("-> no such product found");
        res.redirect("/");
      }
      console.log("-> editting product: ", product._id);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/edit-product",
        edit: editMode,
        hasError: false,
        product: product,
        errorMessage: null
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.postEditProduct = (req, res, nxt) => {
  console.log("==> adminController: postEditProduct");
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  // router validation response:
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("-> validation error", errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/edit-product",
      edit: true,
      hasError: true,
      product: {
        _id: prodId,
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription
      },
      errorMessage: errors.array()[0].msg
    });
  }

  productModel
    .findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        console.log("-> wrong userId...");
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;

      console.log("-> edited product: ", product._id);
      return product.save().then(result => {
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.getAdminProducts = (req, res, nxt) => {
  console.log("==> adminController: getAdminProducts");
  productModel
    .find({ userId: req.user._id })
    // .populate("userId")
    .then(products => {
      // console.log("-> products list:", products);
      res.render("admin/products-list", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};

exports.postDeleteProduct = (req, res, nxt) => {
  console.log("==> adminController: postDeleteProduct");
  const prodId = req.body.productId;
  productModel
    .deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log("-> product deleted:", prodId);
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return nxt(error);
    });
};
