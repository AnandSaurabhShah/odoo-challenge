export const ROLES = Object.freeze({
	ADMIN: "ADMIN",
	ASSET_MANAGER: "ASSET_MANAGER",
	DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
	EMPLOYEE: "EMPLOYEE",
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

export const WRITE_ROLES = [ROLES.ADMIN, ROLES.ASSET_MANAGER];
export const ADMIN_ONLY = [ROLES.ADMIN];

