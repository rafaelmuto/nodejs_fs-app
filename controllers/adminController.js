// importing Product model:
const productModel = require("../models/productModel");

// here we exports all admin routes functions:

// you can use module.exports or just exports...
exports.getAddProduct = (req, res, nxt) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    // pug doesnt care about having or not the edit: false here:
    edit: false
  });
};

exports.postAddProduct = (req, res, nxt) => {
  console.log("==> adminController: postAddProduct");
  console.log("-> adding:", req.body);
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;
  const product = new productModel({
    title: title,
    price: price,
    description: description,
    imageUrl: imageURL
  });

  product
    .save()
    .then(result => {
      // console.log(result);
      console.log("-> new product added");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, nxt) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  productModel
    .findById(prodId)
    .then(product => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/edit-product",
        edit: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, nxt) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageURL = req.body.imageURL;
  const updatedDescription = req.body.description;
  const updatedUserId = req.user._id;

  const product = new productModel(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImageURL,
    prodId,
    updatedUserId
  );
  product
    .save()
    .then(result => {
      console.log(">>>Product Updated: ", prodId);
    })
    .catch(err => console.log(err));
  res.redirect("/admin/products");
};

exports.getAdminProducts = (req, res, nxt) => {
  productModel
    .fetchAll()
    .then(products => {
      res.render("admin/products-list", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, nxt) => {
  const prodId = req.body.productId;
  productModel
    .deleteById(prodId)
    .then(() => {
      console.log(">>>Product Destroyed: ", prodId);
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
