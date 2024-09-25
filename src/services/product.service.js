'use strict';
const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.modal');

const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils');
const NotificationService = require('./notification.service');

// defined Factory class to create product

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product types ${type}`);

    return new productClass(payload).updateProduct({ productId });
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // query
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProductByUser({ keyword }) {
    return await searchProductByUser({ keyword });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    const select = ['product_name', 'product_price', 'product_thumb'];
    return await findAllProducts({ limit, sort, page, filter, select });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id });
  }
}

// defined base Product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      NotificationService.pushNoticeToSystem({
        type: 'SHOP',
        receiverId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop
        }
      })
      .then(rs => console.log(rs))
      .catch(console.error);
    }
  }

  async updateProduct(productId, payload) {
    return await updateProductById({
      productId,
      model: product,
      payload,
    });
  }
}

// defined sub-class for difference product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }

  async updateProduct({ productId }) {
    // 1 remove attributes null or undefined
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        model: clothing,
        payload: updateNestedObjectParse(objectParams.product_attributes),
        isNew: true,
      });
    }
    const updatedProduct = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectParams)
    );
    return updatedProduct;
  }
}

// defined sub-class for difference product types Clothing
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }

  async updateProduct({ productId }) {
    // 1 remove attributes null or undefined
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        model: electronic,
        payload: updateNestedObjectParse(objectParams.product_attributes),
        isNew: true,
      });
    }
    const updatedProduct = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectParams)
    );
    return updatedProduct;
  }
}

// defined sub-class for difference product types Clothing
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new Furniture error');
    return newProduct;
  }

  async updateProduct({ productId }) {
    // 1 remove attributes null or undefined
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        model: furniture,
        payload: updateNestedObjectParse(objectParams.product_attributes),
        isNew: true,
      });
    }
    const updatedProduct = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectParams)
    );
    return updatedProduct;
  }
}

//register product types
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
