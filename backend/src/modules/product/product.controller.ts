import type { Request, Response } from "express";
import * as productService from "./product.service.ts";
import type {
  Product,
  ProductImage,
  ProductSearchQuery,
} from "../../types/product.js";
import type { ProductUpdateInput } from "../../generated/prisma/models.ts";

interface createProductRequestBody {
  name: string;
  description: string;
  price: number;
  sortOrders: number[];
}

export const createProduct = async (req: Request, res: Response) => {
  // TODO add stock for inventory module, so that product availability can be managed when created
  const { name, description, price, sortOrders }: createProductRequestBody =
    req.body as createProductRequestBody;

  const files = (req.files ?? {}) as {
    [fieldname: string]: Express.Multer.File[];
  };

  const thumbnail = files.thumbnail?.[0];
  const productImages = files.images ?? [];

  if (!thumbnail) {
    return res.status(400).json({
      error: "Thumbnail image is required",
    });
  }

  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required" });
  }

  try {
    // parse sortOrders to numbers and validate
    const parsedSortOrders = sortOrders.map((order) => Number(order));

    // try parse price to number
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res
        .status(400)
        .json({ error: "Price must be a non-negative number" });
    }

    const thumbnailImage: ProductImage = {
      url: `/uploads/${thumbnail.filename}`,
      altText: thumbnail.originalname,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isThumbnail: true,
    };

    const imageList: ProductImage[] = productImages.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      altText: file.originalname,
      sortOrder: parsedSortOrders[index] ?? 0,
      isThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const productData: Product = {
      name,
      description,
      price: parsedPrice,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      productImages: [thumbnailImage, ...imageList],
    };

    const product = await productService.createProduct(productData);

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    page,
    limit,
    name,
    minPrice,
    maxPrice,
    categoryId,
    inStock,
    sortBy,
    sortOrder,
  } = req.query;

  try {
    // If an ID param is provided, return a single product
    if (id !== undefined && id !== "") {
      const productId = Number(id);
      if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "Valid product ID is required" });
      }
      const productData = await productService.getProductById(productId);
      if (!productData) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(productService.serializeProduct(productData));
    }

    // If no ID param is provided, return a list of products based on the query parameters
    if (page === undefined || limit === undefined) {
      return res
        .status(400)
        .json({ error: "Page and limit query parameters are required" });
    }

    // Parse query parameters and set default values if necessary
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const parsedMinPrice = minPrice !== undefined ? Number(minPrice) : 0;
    const parsedMaxPrice =
      maxPrice !== undefined ? Number(maxPrice) : Number.MAX_VALUE;
    const parsedCategoryId =
      categoryId !== undefined ? Number(categoryId) : undefined;
    const parsedInStock =
      inStock === undefined ? undefined : inStock === "true";
    const validSortFields = ["productId", "name", "price", "createdAt"];
    const validSortOrders = ["asc", "desc"];

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100 ||
      !Number.isFinite(parsedMinPrice) ||
      parsedMinPrice < 0 ||
      !Number.isFinite(parsedMaxPrice) ||
      parsedMaxPrice < parsedMinPrice ||
      (parsedCategoryId !== undefined &&
        (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1)) ||
      (inStock !== undefined && inStock !== "true" && inStock !== "false") ||
      (sortBy !== undefined && !validSortFields.includes(String(sortBy))) ||
      (sortOrder !== undefined && !validSortOrders.includes(String(sortOrder)))
    ) {
      return res
        .status(400)
        .json({ error: "Invalid product query parameters" });
    }

    const query: ProductSearchQuery = {
      page: parsedPage,
      limit: parsedLimit,
      name: String(name || ""),
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      sortBy: (sortBy ? String(sortBy) : "productId") as
        | "productId"
        | "name"
        | "price"
        | "createdAt",
      sortOrder: (sortOrder ? String(sortOrder) : "asc") as "asc" | "desc",
    };
    if (parsedCategoryId !== undefined) query.categoryId = parsedCategoryId;
    if (parsedInStock !== undefined) query.inStock = parsedInStock;

    const products = await productService.getProducts(query);

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  try {
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }
    const productData = await productService.getProductById(productId);
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(productService.serializeProduct(productData));
  } catch (error) {
    return res.status(500).json({ error: "Failed to get product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  const { name, description, price, isActive }: ProductUpdateInput = req.body;

  const updateData: ProductUpdateInput = {};
  // include only the fields that are provided in the request body
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (isActive !== undefined) updateData.isActive = isActive;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update" });
  }

  try {
    const updatedProduct = await productService.updateProductById(
      Number(id),
      updateData,
    );
    return res
      .status(200)
      .json({ message: "Product updated successfully", item: updatedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

export const updateProductImage = async (req: Request, res: Response) => {
  // Combine the optional uploaded file and metadata into one validated update.
  const productId = Number(req.params.productId);
  const imageId = Number(req.params.imageId);
  // Validate productId to ensure it's a positive integer
  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ error: "Valid product ID is required" });
  }
  // Validate imageId to ensure it's a positive integer
  if (!Number.isInteger(imageId) || imageId <= 0) {
    return res.status(400).json({ error: "Valid image ID is required" });
  }

  const { altText, sortOrder, isThumbnail } = req.body as {
    altText?: string;
    sortOrder?: string | number;
    isThumbnail?: string | boolean;
  };

  // Validate and prepare the update data
  const updateData: Parameters<
    typeof productService.updateProductImageById
  >[2] = {};
  // If a new image file is uploaded, include its path and original name in the update data. Otherwise, only include the metadata fields that are provided.
  if (req.file) {
    updateData.url = `/uploads/${req.file.filename}`;
    updateData.altText = req.file.originalname;
  }
  // Validate and include the optional metadata fields in the update data if they are provided.
  if (altText !== undefined) updateData.altText = altText;
  if (sortOrder !== undefined) {
    const parsedSortOrder = Number(sortOrder);
    if (!Number.isInteger(parsedSortOrder)) {
      return res.status(400).json({ error: "Sort order must be an integer" });
    }
    updateData.sortOrder = parsedSortOrder;
  }
  if (isThumbnail !== undefined) {
    updateData.isThumbnail = isThumbnail === true || isThumbnail === "true";
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update" });
  }

  try {
    const updatedImage = await productService.updateProductImageById(
      productId,
      imageId,
      updateData,
    );
    return res.status(200).json({
      message: "Product image updated successfully",
      item: updatedImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update product image" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  try {
    const deletedItem = await productService.deleteProductById(Number(id));
    return res
      .status(200)
      .json({ message: "Product deleted successfully", item: deletedItem });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

export const getProductsCount = async (req: Request, res: Response) => {
  try {
    const count = await productService.getProductsCount();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get products count" });
  }
};

export const getRecommendedProducts = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 4;
  if (!Number.isInteger(limit) || limit <= 0) {
    return res.status(400).json({ error: "Limit must be a positive integer" });
  }
  try {
    const recommendedProducts =
      await productService.getRecommendedProducts(limit);
    return res.status(200).json(recommendedProducts);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to get recommended products" });
  }
};
