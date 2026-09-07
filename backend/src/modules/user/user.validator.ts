import type { NextFunction, Request, Response } from "express";

const validateAddressBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { addressLine, city, state, postalCode, country } = req.body ?? {};
  if (
    typeof addressLine !== "string" ||
    !addressLine.trim() ||
    typeof city !== "string" ||
    !city.trim() ||
    typeof state !== "string" ||
    !state.trim() ||
    typeof postalCode !== "string" ||
    !postalCode.trim() ||
    typeof country !== "string" ||
    !country.trim()
  ) {
    return res.status(400).json({
      message:
        "Address line, city, state, postal code, and country are required",
    });
  }
  next();
};

export const validateCreateAddress = validateAddressBody;
export const validateUpdateAddress = validateAddressBody;

export const validateAddressId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const addressId = Number(req.params.addressId);
  if (!Number.isInteger(addressId) || addressId < 1) {
    return res.status(400).json({ message: "Invalid address ID" });
  }
  next();
};

export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, deliveryAddress, phoneNumber } = req.body ?? {};
  if (
    name === undefined &&
    email === undefined &&
    deliveryAddress === undefined &&
    phoneNumber === undefined
  ) {
    return res.status(400).json({
      message: "At least one field must be provided for update",
    });
  }
  next();
};
