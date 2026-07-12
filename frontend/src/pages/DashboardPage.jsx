import React, { useEffect } from "react";
import { useCurrentUser, useLogoutMutation } from "../hooks/useAuth.js";
import {
  UserRole,
  AssetStatus,
  TransferStatus,
  BookingStatus,
  MaintenanceStatus,
  MaintenancePriority,
  AuditStatus,
  AuditItemStatus,
  NotificationType,
  EntityType,
} from "../types.js";

import { useAssetStore } from "../store/useAssetStore.js";
import { hasAccess, getDefaultScreen, ROLE_LABELS } from "../lib/rbac.js";
import AccessDenied from "../components/AccessDenied.jsx";

import {
  useDepartments,
  useUsers,
  useCategories,
  useAssets,
  useAllocations,
  useTransfers,
  useBookings,
  useMaintenance,
  useAudits,
  useAuditItems,
  useNotifications,
  useLogs,
  useAddDepartmentMutation,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useAddAssetMutation,
  useRequestTransferMutation,
  useApproveTransferMutation,
  useRejectTransferMutation,
  useAddBookingMutation,
  useCancelBookingMutation,
  useAddMaintenanceTaskMutation,
  useUpdateMaintenanceStatusMutation,
  useAddCommentMutation,
  useVerifyChecklistItemMutation,
  useResolveDiscrepancyMutation,
  useMarkNotificationReadMutation,
  useClearNotificationsMutation,
} from "../hooks/useAssetQueries.js";

import Sidebar from "../components/Sidebar.jsx";
import DashboardView from "../components/DashboardView.jsx";
import OrganizationView from "../components/OrganizationView.jsx";
import AssetDirectoryView from "../components/AssetDirectoryView.jsx";
import AllocationTransfersView from "../components/AllocationTransfersView.jsx";
import ResourceBookingView from "../components/ResourceBookingView.jsx";
import MaintenanceKanbanView from "../components/MaintenanceKanbanView.jsx";
import AssetAuditView from "../components/AssetAuditView.jsx";
import AnalyticsView from "../components/AnalyticsView.jsx";
import LogsNotificationsView from "../components/LogsNotificationsView.jsx";

export default function DashboardPage() {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const { data: rawUser } = useCurrentUser();
  const logoutMutation = useLogoutMutation();

  // The backend role enum — single source of truth for RBAC
  const rawRole = rawUser?.role ?? "EMPLOYEE";

  // UI-friendly user shape passed to all view components
  const currentUser = rawUser
    ? {
        id: rawUser.id,
        name: rawUser.fullName,
        email: rawUser.email,
        department: rawUser.department?.name ?? "N/A",
        // Spec-correct role labels from rbac.js
        role: ROLE_LABELS[rawUser.role] ?? "Employee",
        // Raw role kept for sidebar & access guards
        rawRole: rawUser.role,
        avatar:
          rawUser.profileImage ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      }
    : null;

  const handleLogout = () => logoutMutation.mutate();

  // ── Client UI State (navigation) ────────────────────────────────────────
  const activeScreen = useAssetStore((state) => state.activeScreen);
  const setActiveScreen = useAssetStore((state) => state.setActiveScreen);

  // Guard: if the current screen is not accessible by this role, reset to
  // the first screen the role CAN access (runs whenever role or screen changes).
  useEffect(() => {
    if (!rawRole) return;
    if (!hasAccess(rawRole, activeScreen)) {
      setActiveScreen(getDefaultScreen(rawRole));
    }
  }, [rawRole, activeScreen, setActiveScreen]);

  // ── Server State ─────────────────────────────────────────────────────────
  const { data: departments = [], isLoading: isLoadingDept } = useDepartments();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: assets = [], isLoading: isLoadingAssets } = useAssets();
  const { data: allocations = [] } = useAllocations();
  const { data: transfers = [] } = useTransfers();
  const { data: bookings = [] } = useBookings();
  const { data: maintenance = [] } = useMaintenance();
  const { data: audits = [] } = useAudits();
  const { data: auditItems = [] } = useAuditItems();
  const { data: notifications = [] } = useNotifications();
  const { data: logs = [] } = useLogs();

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addDeptMutation = useAddDepartmentMutation();
  const addEmpMutation = useAddEmployeeMutation();
  const deleteEmpMutation = useDeleteEmployeeMutation();
  const addAssetMutation = useAddAssetMutation();
  const requestTransferMutation = useRequestTransferMutation();
  const approveTransferMutation = useApproveTransferMutation();
  const rejectTransferMutation = useRejectTransferMutation();
  const addBookingMutation = useAddBookingMutation();
  const cancelBookingMutation = useCancelBookingMutation();
  const addMaintenanceTaskMutation = useAddMaintenanceTaskMutation();
  const updateMaintenanceStatusMutation = useUpdateMaintenanceStatusMutation();
  const addCommentMutation = useAddCommentMutation();
  const verifyChecklistItemMutation = useVerifyChecklistItemMutation();
  const resolveDiscrepancyMutation = useResolveDiscrepancyMutation();
  const markNotificationReadMutation = useMarkNotificationReadMutation();
  const clearNotificationsMutation = useClearNotificationsMutation();

  const handleAddDepartment = (d) => addDeptMutation.mutate(d);
  const handleAddEmployee = (e) => addEmpMutation.mutate(e);
  const handleDeleteEmployee = (id) => deleteEmpMutation.mutate(id);
  const handleAddAsset = (a) => addAssetMutation.mutate(a);
  const handleRequestTransfer = (t) => requestTransferMutation.mutate(t);
  const handleApproveTransfer = (id) => approveTransferMutation.mutate(id);
  const handleRejectTransfer = (id) => rejectTransferMutation.mutate(id);
  const handleAddBooking = (b) => addBookingMutation.mutate(b);
  const handleCancelBooking = (id) => cancelBookingMutation.mutate(id);
  const handleAddMaintenanceTask = (t) => addMaintenanceTaskMutation.mutate(t);
  const handleUpdateMaintenanceStatus = (taskId, status, technician) =>
    updateMaintenanceStatusMutation.mutate({ taskId, status, technician });
  const handleAddComment = (taskId, comment) =>
    addCommentMutation.mutate({ taskId, comment });
  const handleVerifyChecklistItem = (auditId, itemId, checkedBy) =>
    verifyChecklistItemMutation.mutate({ auditId, itemId, checkedBy });
  const handleResolveDiscrepancy = (auditId, discId) =>
    resolveDiscrepancyMutation.mutate({ auditId, discId });
  const handleMarkNotificationRead = (id) =>
    markNotificationReadMutation.mutate(id);
  const handleClearNotifications = () => clearNotificationsMutation.mutate();
  const handleQuickAction = (screenId) => setActiveScreen(screenId);

  const isQueryLoading =
    isLoadingDept || isLoadingUsers || isLoadingCategories || isLoadingAssets;

  // ── Data Projection / Mapping ─────────────────────────────────────────────

  const employeesMapped = users.map((u) => {
    const dept = departments.find((d) => d.id === u.departmentId);
    return {
      id: u.id,
      name: u.fullName,
      email: u.email,
      department: dept ? dept.name : "N/A",
      role: ROLE_LABELS[u.role] ?? "Employee",
      rawRole: u.role,
      avatar: u.profileImage,
      phone: u.phone,
      employeeId: u.employeeId,
      status: u.status,
    };
  });

  const departmentsMapped = departments.map((d) => {
    const headUser = users.find((u) => u.id === d.headId);
    const deptUsers = users.filter(
      (u) => u.departmentId === d.id && u.status === "ACTIVE",
    );
    const deptAssets = assets.filter((a) => a.ownerDepartmentId === d.id);
    const totalVal = deptAssets.reduce(
      (sum, a) => sum + Number(a.acquisitionCost || 0),
      0,
    );
    return {
      id: d.id,
      name: d.name,
      code: d.code,
      description: d.description,
      manager: headUser ? headUser.fullName : "N/A",
      headcount: deptUsers.length,
      totalAssetsValue: totalVal,
      status: d.status,
    };
  });

  const assetsMapped = assets.map((a) => {
    const cat = categories.find((c) => c.id === a.categoryId);
    const dept = departments.find((d) => d.id === a.ownerDepartmentId);
    const activeAlloc = allocations.find(
      (al) => al.assetId === a.id && al.returnedAt === null,
    );
    const assignedUser = activeAlloc
      ? users.find((u) => u.id === activeAlloc.userId)
      : null;

    let uiStatus = "Active";
    if (a.status === AssetStatus.ALLOCATED) uiStatus = "Allocated";
    else if (a.status === AssetStatus.UNDER_MAINTENANCE) uiStatus = "In Maintenance";
    else if (a.status === AssetStatus.RETIRED) uiStatus = "Retired";
    else if (a.status === AssetStatus.LOST) uiStatus = "Retired";

    return {
      id: a.id,
      name: a.name,
      category: cat ? cat.name : "Computing",
      serialNumber: a.serialNumber,
      model: a.assetTag,
      purchaseDate: a.acquisitionDate
        ? a.acquisitionDate.substring(0, 10)
        : "2025-01-01",
      purchaseValue: Number(a.acquisitionCost || 0),
      status: uiStatus,
      department: dept ? dept.name : "Engineering & DevOps",
      location: a.locationCode || "HQ - Office",
      assignedTo: assignedUser ? assignedUser.fullName : undefined,
      image:
        a.imageUrl ||
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
      isBookable: a.isBookable,
      assetTag: a.assetTag,
    };
  });

  const transfersMapped = transfers.map((t) => {
    const asset = assets.find((a) => a.id === t.assetId);
    const fromUser = users.find((u) => u.id === t.fromUserId);
    const toUser = users.find((u) => u.id === t.toUserId);
    const requestedUser = users.find((u) => u.id === t.requestedById);
    return {
      id: t.id,
      assetId: t.assetId,
      assetName: asset ? asset.name : "Unknown Device",
      fromDept: fromUser
        ? departments.find((d) => d.id === fromUser.departmentId)?.name ?? "N/A"
        : "N/A",
      toDept: toUser
        ? departments.find((d) => d.id === toUser.departmentId)?.name ?? "N/A"
        : "N/A",
      requestedBy: requestedUser ? requestedUser.fullName : "System",
      requestedDate: t.requestDate
        ? t.requestDate.substring(0, 10)
        : "2026-07-12",
      status:
        t.status === TransferStatus.PENDING
          ? "Pending"
          : t.status === TransferStatus.APPROVED
            ? "Approved"
            : "Rejected",
      notes: t.reason,
    };
  });

  const bookingsMapped = bookings.map((b) => {
    const asset = assets.find((a) => a.id === b.assetId);
    const catName = asset
      ? categories.find((c) => c.id === asset.categoryId)?.name
      : "Meeting Room";
    const user = users.find((u) => u.id === b.bookedById);
    return {
      id: b.id,
      resourceName: asset ? asset.name : "Meeting Space",
      category: catName || "Resource",
      bookedBy: user ? user.fullName : "System",
      date: b.startTime ? b.startTime.substring(0, 10) : "2026-07-12",
      startTime: b.startTime ? b.startTime.substring(11, 16) : "09:00",
      endTime: b.endTime ? b.endTime.substring(11, 16) : "10:30",
      purpose: b.purpose,
      status: b.status === BookingStatus.CANCELLED ? "Cancelled" : "Confirmed",
    };
  });

  const maintenanceMapped = maintenance.map((m) => {
    const asset = assets.find((a) => a.id === m.assetId);
    const reportedUser = users.find((u) => u.id === m.reportedById);
    const assignedUser = users.find((u) => u.id === m.assignedToId);
    let uiStatus = "Pending";
    if (m.status === MaintenanceStatus.APPROVED) uiStatus = "Approved";
    else if (m.status === MaintenanceStatus.ASSIGNED) uiStatus = "Technician Assigned";
    else if (m.status === MaintenanceStatus.IN_PROGRESS) uiStatus = "In Progress";
    else if (m.status === MaintenanceStatus.RESOLVED) uiStatus = "Completed";
    else if (m.status === MaintenanceStatus.REJECTED) uiStatus = "Rejected";
    return {
      id: m.id,
      assetId: m.assetId,
      assetName: asset ? asset.name : "Unknown Asset",
      title: m.title,
      description: m.description,
      priority:
        m.priority === MaintenancePriority.HIGH
          ? "High"
          : m.priority === MaintenancePriority.CRITICAL
            ? "Critical"
            : m.priority === MaintenancePriority.MEDIUM
              ? "Medium"
              : "Low",
      requestedBy: reportedUser ? reportedUser.fullName : "System",
      technician: assignedUser ? assignedUser.fullName : undefined,
      status: uiStatus,
      comments: m.comments || [],
    };
  });

  const auditsMapped = audits.map((aud) => {
    const items = auditItems.filter((item) => item.auditCycleId === aud.id);
    const checklist = items.map((item) => {
      const asset = assets.find((a) => a.id === item.assetId);
      const verifier = item.verifiedById
        ? users.find((u) => u.id === item.verifiedById)
        : null;
      return {
        id: item.id,
        assetName: asset ? asset.name : "Unknown Device",
        serialNumber: asset ? asset.serialNumber : "N/A",
        checked: item.status === AuditItemStatus.VERIFIED,
        checkedBy: verifier ? verifier.fullName : undefined,
      };
    });
    const discrepancies = items
      .filter(
        (item) =>
          item.status === AuditItemStatus.MISSING ||
          item.status === AuditItemStatus.DAMAGED,
      )
      .map((item) => {
        const asset = assets.find((a) => a.id === item.assetId);
        return {
          id: `dc_${item.id}`,
          assetId: item.assetId,
          assetName: asset ? asset.name : "Unknown Device",
          issue:
            item.status === AuditItemStatus.DAMAGED
              ? item.remarks || "Hardware reported damaged during audit."
              : "Missing from mapped location — zero radio response.",
          severity: item.status === AuditItemStatus.MISSING ? "High" : "Medium",
          status:
            item.status === AuditItemStatus.VERIFIED ? "Resolved" : "Pending",
        };
      });
    return {
      id: aud.id,
      title: aud.title,
      startDate: aud.startDate,
      endDate: aud.endDate,
      status: aud.status === AuditStatus.ACTIVE ? "Active" : "Completed",
      checklist,
      discrepancies,
    };
  });

  const logsMapped = logs.map((l) => {
    const user = users.find((u) => u.id === l.userId);
    let categoryName = "System";
    if (l.entityType === EntityType.ASSET) categoryName = "Asset";
    else if (l.entityType === EntityType.TRANSFER) categoryName = "Transfer";
    else if (l.entityType === EntityType.MAINTENANCE) categoryName = "Maintenance";
    else if (l.entityType === EntityType.BOOKING) categoryName = "Booking";
    return {
      id: l.id,
      timestamp: l.createdAt
        ? l.createdAt.replace("T", " ").substring(0, 19)
        : "2026-07-12 09:12:44",
      action: l.action,
      user: user ? user.fullName : "System",
      details: l.description,
      category: categoryName,
    };
  });

  const notificationsMapped = notifications.map((n) => ({
    id: n.id,
    timestamp: n.createdAt
      ? n.createdAt.replace("T", " ").substring(0, 16)
      : "2026-07-12 09:15",
    title: n.title,
    message: n.message,
    read: n.isRead,
    type:
      n.type === NotificationType.TRANSFER_REJECTED ||
      n.title.toLowerCase().includes("reject") ||
      n.title.toLowerCase().includes("fail") ||
      n.title.toLowerCase().includes("cancel") ||
      n.title.toLowerCase().includes("warning")
        ? "warning"
        : "info",
  }));

  // ── RBAC Screen Router ────────────────────────────────────────────────────
  // Each case checks hasAccess() before rendering — unauthorized = AccessDenied.
  const renderActiveScreen = () => {
    const denied = (label) => (
      <AccessDenied
        screenLabel={label}
        onGoHome={() => setActiveScreen("dashboard")}
      />
    );

    switch (activeScreen) {
      case "dashboard":
        // All roles — no guard needed
        return (
          <DashboardView
            currentUser={currentUser}
            assets={assetsMapped}
            transfers={transfersMapped}
            audits={auditsMapped}
            maintenance={maintenanceMapped}
            onQuickAction={handleQuickAction}
            onApproveTransfer={handleApproveTransfer}
            onRejectTransfer={handleRejectTransfer}
          />
        );

      case "organization":
        // Admin only
        if (!hasAccess(rawRole, "organization"))
          return denied("Organization Setup");
        return (
          <OrganizationView
            currentUser={currentUser}
            departments={departmentsMapped}
            employees={employeesMapped}
            onAddDepartment={handleAddDepartment}
            onAddEmployee={handleAddEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        );

      case "directory":
        // All roles (view is internally filtered by role if needed)
        return (
          <AssetDirectoryView
            currentUser={currentUser}
            assets={assetsMapped}
            departments={departmentsMapped}
            employees={employeesMapped}
            onAddAsset={handleAddAsset}
          />
        );

      case "allocation":
        // All roles
        return (
          <AllocationTransfersView
            currentUser={currentUser}
            assets={assetsMapped}
            departments={departmentsMapped}
            transfers={transfersMapped}
            onRequestTransfer={handleRequestTransfer}
            onApproveTransfer={handleApproveTransfer}
            onRejectTransfer={handleRejectTransfer}
          />
        );

      case "booking":
        // All roles
        return (
          <ResourceBookingView
            currentUser={currentUser}
            bookings={bookingsMapped}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
          />
        );

      case "maintenance":
        // All roles
        return (
          <MaintenanceKanbanView
            currentUser={currentUser}
            maintenance={maintenanceMapped}
            assets={assetsMapped}
            employees={employeesMapped}
            onAddMaintenanceTask={handleAddMaintenanceTask}
            onUpdateMaintenanceStatus={handleUpdateMaintenanceStatus}
            onAddComment={handleAddComment}
          />
        );

      case "audit":
        // Admin + Asset Manager only
        if (!hasAccess(rawRole, "audit")) return denied("Asset Audit");
        return (
          <AssetAuditView
            currentUser={currentUser}
            audits={auditsMapped}
            onVerifyChecklistItem={handleVerifyChecklistItem}
            onResolveDiscrepancy={handleResolveDiscrepancy}
          />
        );

      case "analytics":
        // Admin + Asset Manager + Department Head
        if (!hasAccess(rawRole, "analytics"))
          return denied("Reports & Analytics");
        return (
          <AnalyticsView
            assets={assetsMapped}
            departments={departmentsMapped}
          />
        );

      case "logs":
        // All roles
        return (
          <LogsNotificationsView
            logs={logsMapped}
            notifications={notificationsMapped}
            onMarkNotificationRead={handleMarkNotificationRead}
            onClearNotifications={handleClearNotifications}
          />
        );

      default:
        return (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-white">404</h2>
            <p className="text-slate-400 mt-2">
              Screen &quot;{activeScreen}&quot; not found.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      id="app-viewport"
      className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600/30"
    >
      <Sidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        notifications={notificationsMapped}
      />

      <main
        id="main-content-scroll"
        className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1400px] mx-auto"
      >
        {isQueryLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute w-6 h-6 border-4 border-emerald-500/10 border-b-emerald-500 rounded-full animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-slate-300 font-medium text-sm tracking-wide">
                Syncing Asset Registry
              </p>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                TanStack Query Cache Refreshing...
              </p>
            </div>
          </div>
        ) : (
          renderActiveScreen()
        )}
      </main>
    </div>
  );
}
