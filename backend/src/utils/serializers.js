function toPlainDecimal(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value.toString === "function" ? value.toString() : value;
}

export function serializeDepartment(department) {
  if (!department) {
    return department;
  }

  return {
    ...department,
    head: department.head ? serializeUser(department.head) : null,
  };
}

export function serializeUser(user) {
  if (!user) {
    return user;
  }

  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    department: user.department ? serializeDepartment(user.department) : user.department,
  };
}

export function serializeAsset(asset) {
  if (!asset) {
    return asset;
  }

  return {
    ...asset,
    acquisitionCost: toPlainDecimal(asset.acquisitionCost),
    category: asset.category,
    ownerDepartment: asset.ownerDepartment ? serializeDepartment(asset.ownerDepartment) : asset.ownerDepartment,
  };
}
