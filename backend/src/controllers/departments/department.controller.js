import { createDepartmentSchema, departmentIdSchema, updateDepartmentSchema } from "../../validators/department/department.validator.js";
import { createDepartment, deleteDepartment, getDepartmentById, listDepartments, updateDepartment } from "../../services/departments/department.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export async function index(req, res, next) {
  try {
    const result = await listDepartments(req.query);

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
    const { id } = departmentIdSchema.parse(req.params);
    const department = await getDepartmentById(id);

    return sendSuccess(res, { data: department });
  } catch (error) {
    next(error);
  }
}

export async function store(req, res, next) {
  try {
    const data = createDepartmentSchema.parse(req.body);
    const department = await createDepartment(data);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = departmentIdSchema.parse(req.params);
    const data = updateDepartmentSchema.parse(req.body);
    const department = await updateDepartment(id, data);

    return sendSuccess(res, {
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const { id } = departmentIdSchema.parse(req.params);
    await deleteDepartment(id);

    return sendSuccess(res, {
      message: "Department deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}
