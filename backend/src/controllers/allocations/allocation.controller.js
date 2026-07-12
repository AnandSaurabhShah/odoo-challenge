import { allocateAssetSchema, returnAssetSchema } from "../../validators/allocation/allocation.validator.js";
import { allocateAsset, listAllocations, returnAsset } from "../../services/allocations/allocation.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { z } from "zod";

const paramIdSchema = z.object({
  id: z.string().uuid(),
});

export async function index(req, res, next) {
  try {
    const result = await listAllocations(req.query);

    return sendSuccess(res, {
      data: result.items,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function store(req, res, next) {
  try {
    const data = allocateAssetSchema.parse(req.body);
    const allocatorId = req.user.id;
    const allocation = await allocateAsset(data, allocatorId);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Asset allocated successfully",
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleReturn(req, res, next) {
  try {
    const { id: assetId } = paramIdSchema.parse(req.params);
    const data = returnAssetSchema.parse(req.body);
    const allocation = await returnAsset(assetId, data);

    return sendSuccess(res, {
      message: "Asset returned successfully",
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
}
