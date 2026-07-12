export function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function buildPagination(query = {}) {
  const page = parsePositiveInteger(query.page, 1);
  const limit = Math.min(parsePositiveInteger(query.limit, 10), 100);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

export function buildOrderBy(query = {}, defaultField = "createdAt", allowedFields = [defaultField]) {
  const sortBy = typeof query.sortBy === "string" && query.sortBy.trim() ? query.sortBy.trim() : defaultField;
  const sortOrder = String(query.sortOrder || query.order || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  const field = allowedFields.includes(sortBy) ? sortBy : defaultField;

  return {
    [field]: sortOrder,
  };
}
