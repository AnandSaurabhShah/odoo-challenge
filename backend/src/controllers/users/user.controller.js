import { createUserSchema, updateUserSchema, userIdSchema } from "../../validators/user/user.validator.js";
import { createUser, deleteUser, getUserById, listUsers, updateUser } from "../../services/users/user.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export async function index(req, res, next) {
  try {
    const result = await listUsers(req.query);

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
    const { id } = userIdSchema.parse(req.params);
    const user = await getUserById(id);

    return sendSuccess(res, { data: user });
  } catch (error) {
    next(error);
  }
}

export async function store(req, res, next) {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await createUser(data);

    return sendSuccess(res, {
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = userIdSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);
    const user = await updateUser(id, data);

    return sendSuccess(res, {
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const { id } = userIdSchema.parse(req.params);
    await deleteUser(id);

    return sendSuccess(res, {
      message: "User deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}
