import { assignTechnicianSchema, createMaintenanceSchema, maintenanceIdSchema, resolveMaintenanceSchema } from "../../validators/maintenance/maintenance.validator.js";
import { assignTechnician, createMaintenanceRequest, listMaintenanceRequests, resolveMaintenanceRequest } from "../../services/maintenance/maintenance.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export async function index(req, res, next) {
  try {
    const result = await listMaintenanceRequests(req.query);

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
    const data = createMaintenanceSchema.parse(req.body);
    const request = await createMaintenanceRequest(data, req.user.id);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Maintenance request created successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function assign(req, res, next) {
  try {
    const { id: requestId } = maintenanceIdSchema.parse(req.params);
    const data = assignTechnicianSchema.parse(req.body);
    const request = await assignTechnician(requestId, req.user.id, data);

    return sendSuccess(res, {
      message: "Technician assigned successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function resolve(req, res, next) {
  try {
    const { id: requestId } = maintenanceIdSchema.parse(req.params);
    const data = resolveMaintenanceSchema.parse(req.body);
    const request = await resolveMaintenanceRequest(requestId, req.user.id, req.user.role, data);

    return sendSuccess(res, {
      message: "Maintenance request resolved successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}
