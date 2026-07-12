import {
  LayoutDashboard,
  Building2,
  Layers,
  ArrowLeftRight,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BarChart3,
  FileClock,
} from "lucide-react";

/**
 * Maps backend UserRole enum values → spec-correct display labels.
 * Source: AssetFlow PDF — "User Roles" section.
 */
export const ROLE_LABELS = {
  ADMIN: "Admin",
  ASSET_MANAGER: "Asset Manager",
  DEPARTMENT_HEAD: "Department Head",
  EMPLOYEE: "Employee",
};

/**
 * Maps display roles → Tailwind color classes for the role badge.
 */
export const ROLE_COLORS = {
  ADMIN: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  ASSET_MANAGER: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  DEPARTMENT_HEAD: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  EMPLOYEE: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

/**
 * Full navigation item registry (all possible screens).
 * `allowedRoles: null` means all roles can access it.
 */
const ALL_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: null, // all roles
  },
  {
    id: "organization",
    label: "Organization Setup",
    icon: Building2,
    allowedRoles: ["ADMIN"],
  },
  {
    id: "directory",
    label: "Asset Directory",
    icon: Layers,
    allowedRoles: null, // all roles — view is filtered by role internally
  },
  {
    id: "allocation",
    label: "Allocation & Transfers",
    icon: ArrowLeftRight,
    allowedRoles: null, // all roles — actions filtered by role internally
  },
  {
    id: "booking",
    label: "Resource Booking",
    icon: CalendarDays,
    allowedRoles: null, // all roles
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    allowedRoles: null, // all roles — raise/approve filtered internally
  },
  {
    id: "audit",
    label: "Asset Audit",
    icon: ClipboardCheck,
    allowedRoles: ["ADMIN", "ASSET_MANAGER"],
  },
  {
    id: "analytics",
    label: "Reports & Analytics",
    icon: BarChart3,
    allowedRoles: ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"],
  },
  {
    id: "logs",
    label: "Logs & Notifications",
    icon: FileClock,
    allowedRoles: null, // all roles
  },
];

/**
 * Returns the filtered nav items for a given role, with the badge count injected
 * into the logs item.
 *
 * @param {string} role - Backend UserRole enum value (e.g. "ADMIN", "EMPLOYEE")
 * @param {number} unreadCount - Number of unread notifications for the badge
 */
export function getNavItems(role, unreadCount = 0) {
  return ALL_NAV_ITEMS.filter(
    (item) => item.allowedRoles === null || item.allowedRoles.includes(role),
  ).map((item) => ({
    ...item,
    badge: item.id === "logs" && unreadCount > 0 ? unreadCount : undefined,
  }));
}

/**
 * Returns true if the given role is allowed to view the given screen.
 *
 * @param {string} role - Backend UserRole enum value
 * @param {string} screenId - The screen/nav item ID
 */
export function hasAccess(role, screenId) {
  const item = ALL_NAV_ITEMS.find((n) => n.id === screenId);
  if (!item) return false;
  if (item.allowedRoles === null) return true;
  return item.allowedRoles.includes(role);
}

/**
 * Returns the first screen ID accessible by the given role.
 * Used as a fallback when the current screen is not allowed.
 */
export function getDefaultScreen(role) {
  return getNavItems(role)[0]?.id ?? "dashboard";
}
