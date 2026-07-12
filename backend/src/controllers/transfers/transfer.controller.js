import { createTransferSchema, handleTransferActionSchema, transferIdSchema } from "../../validators/transfer/transfer.validator.js";
import { createTransferRequest, handleTransferAction, listTransferRequests } from "../../services/transfers/transfer.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export async function index(req, res, next) {
  try {
    const result = await listTransferRequests(req.query);

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
    const data = createTransferSchema.parse(req.body);
    const transfer = await createTransferRequest(data, req.user.id);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Transfer request created successfully",
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleAction(req, res, next) {
  try {
    const { id: requestId } = transferIdSchema.parse(req.params);
    const data = handleTransferActionSchema.parse(req.body);
    const transfer = await handleTransferAction(requestId, req.user.id, data);

    return sendSuccess(res, {
      message: `Transfer request ${data.action.toLowerCase()}d successfully`,
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
}
