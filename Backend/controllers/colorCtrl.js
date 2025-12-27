import Color from "../models/colorModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoDbId.js";

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    return res.status(201).json(newColor);
  } catch (error) {
    throw new Error(error.message);
  }
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedColor);
  } catch (error) {
    throw new Error(error.message);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    return res.status(200).json(deletedColor);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const color = await Color.findById(id);
    return res.status(200).json(color);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getallColor = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    return res.status(200).json(colors);
  } catch (error) {
    throw new Error(error.message);
  }
});

export {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
};
