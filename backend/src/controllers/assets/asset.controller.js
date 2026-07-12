import { assetIdSchema, createAssetSchema, updateAssetSchema } from "../../validators/asset/asset.validator.js";
import { createAsset, deleteAsset, getAssetById, listAssets, updateAsset } from "../../services/assets/asset.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export async function index(req, res, next) {
  try {
    const result = await listAssets(req.query);

    return sendSuccess(res, {
      data: result.items,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function show(req, res, next) {
  try {
    const { id } = assetIdSchema.parse(req.params);
    const asset = await getAssetById(id);

    return sendSuccess(res, { data: asset });
  } catch (error) {
    next(error);
  }
}

export async function store(req, res, next) {
  try {
    const data = createAssetSchema.parse(req.body);
    const asset = await createAsset(data);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Asset created successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = assetIdSchema.parse(req.params);
    const data = updateAssetSchema.parse(req.body);
    const asset = await updateAsset(id, data);

    return sendSuccess(res, {
      message: "Asset updated successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const { id } = assetIdSchema.parse(req.params);
    await deleteAsset(id);

    return sendSuccess(res, {
      message: "Asset deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}
