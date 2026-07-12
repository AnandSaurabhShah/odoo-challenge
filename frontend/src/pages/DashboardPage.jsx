import React from "react";
import { useCurrentUser, useLogoutMutation } from "../hooks/useAuth.js";
import {
  RecordStatus,
  UserRole,
  AssetStatus,
  AssetCondition,
  TransferStatus,
  BookingStatus,
  MaintenanceStatus,
  MaintenancePriority,
  AuditStatus,
  AuditItemStatus,
  NotificationType,
  ActivityAction,
  EntityType,
} from "../types.js";

import { useAssetStore } from "../store/useAssetStore.js";
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

  // Map the backend User shape → the UI user shape expected by all views
  const currentUser = rawUser
    ? {
        id: rawUser.id,
        name: rawUser.fullName,
        email: rawUser.email,
        department: rawUser.department?.name ?? "N/A",
        role:
          rawUser.role === "ADMIN"
            ? "System Admin"
            : rawUser.role === "DEPARTMENT_HEAD"
              ? "Department Manager"
              : rawUser.role === "ASSET_MANAGER"
                ? "Technician"
                : "Employee",
        avatar:
          rawUser.profileImage ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      }
    : null;

  const handleLogout = () => logoutMutation.mutate();

  // ── Client UI State (navigation) ────────────────────────────────────────
  const activeScreen = useAssetStore((state) => state.activeScreen);
  const setActiveScreen = useAssetStore((state) => state.setActiveScreen);

  // ── Server State (Fetched & Cached via TanStack Query) ──────────────────
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

  // ── Server Actions (Mutations) ───────────────────────────────────────────
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

  const handleAddDepartment = (newDept) => addDeptMutation.mutate(newDept);
  const handleAddEmployee = (newEmp) => addEmpMutation.mutate(newEmp);
  const handleDeleteEmployee = (empId) => deleteEmpMutation.mutate(empId);
  const handleAddAsset = (newAsset) => addAssetMutation.mutate(newAsset);
  const handleRequestTransfer = (newTrans) => requestTransferMutation.mutate(newTrans);
  const handleApproveTransfer = (transId) => approveTransferMutation.mutate(transId);
  const handleRejectTransfer = (transId) => rejectTransferMutation.mutate(transId);
  const handleAddBooking = (newBook) => addBookingMutation.mutate(newBook);
  const handleCancelBooking = (bookId) => cancelBookingMutation.mutate(bookId);
  const handleAddMaintenanceTask = (newTask) => addMaintenanceTaskMutation.mutate(newTask);
  const handleUpdateMaintenanceStatus = (taskId, status, technician) =>
    updateMaintenanceStatusMutation.mutate({ taskId, status, technician });
  const handleAddComment = (taskId, comment) =>
    addCommentMutation.mutate({ taskId, comment });
  const handleVerifyChecklistItem = (auditId, itemId, checkedBy) =>
    verifyChecklistItemMutation.mutate({ auditId, itemId, checkedBy });
  const handleResolveDiscrepancy = (auditId, discId) =>
    resolveDiscrepancyMutation.mutate({ auditId, discId });
  const handleMarkNotificationRead = (notifId) =>
    markNotificationReadMutation.mutate(notifId);
  const handleClearNotifications = () => clearNotificationsMutation.mutate();

  const handleQuickAction = (screenId) => setActiveScreen(screenId);

  const isQueryLoading =
    isLoadingDept || isLoadingUsers || isLoadingCategories || isLoadingAssets;

  // ── Data Projection / Mapping Layer ─────────────────────────────────────

  const employeesMapped = users.map((u) => {
    const dept = departments.find((d) => d.id === u.departmentId);
    return {
      id: u.id,
      name: u.fullName,
      email: u.email,
      department: dept ? dept.name : "N/A",
      role:
        u.role === UserRole.ADMIN
          ? "System Admin"
          : u.role === UserRole.DEPARTMENT_HEAD
            ? "Department Manager"
            : u.role === UserRole.ASSET_MANAGER
              ? "Technician"
              : "Employee",
      avatar: u.profileImage,
      phone: u.phone,
      employeeId: u.employeeId,
      status: u.status,
    };
  });

  const departmentsMapped = departments.map((d) => {
    const headUser = users.find((u) => u.id === d.headId);
    const managerName = headUser ? headUser.fullName : "N/A";
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
      manager: managerName,
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
    const assignedName = assignedUser ? assignedUser.fullName : undefined;

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
      assignedTo: assignedName,
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

    const fromDept = fromUser
      ? departments.find((d) => d.id === fromUser.departmentId)?.name
      : "N/A";
    const toDept = toUser
      ? departments.find((d) => d.id === toUser.departmentId)?.name
      : "N/A";

    return {
      id: t.id,
      assetId: t.assetId,
      assetName: asset ? asset.name : "Unknown Device",
      fromDept: fromDept || "N/A",
      toDept: toDept || "N/A",
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

    const dateStr = b.startTime ? b.startTime.substring(0, 10) : "2026-07-12";
    const startHours = b.startTime ? b.startTime.substring(11, 16) : "09:00";
    const endHours = b.endTime ? b.endTime.substring(11, 16) : "10:30";

    return {
      id: b.id,
      resourceName: asset ? asset.name : "Meeting Space",
      category: catName || "Resource",
      bookedBy: user ? user.fullName : "System",
      date: dateStr,
      startTime: startHours,
      endTime: endHours,
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

    const discItems = items.filter(
      (item) =>
        item.status === AuditItemStatus.MISSING ||
        item.status === AuditItemStatus.DAMAGED,
    );
    const discrepancies = discItems.map((item) => {
      const asset = assets.find((a) => a.id === item.assetId);
      let issue = "Unverified or missing scan telemetry";
      if (item.status === AuditItemStatus.DAMAGED) {
        issue = item.remarks || "Hardware reported damaged during audit cycle scan.";
      } else if (item.status === AuditItemStatus.MISSING) {
        issue = "Missing from mapped location code - zero radio response.";
      }

      return {
        id: `dc_${item.id}`,
        assetId: item.assetId,
        assetName: asset ? asset.name : "Unknown Device",
        issue: issue,
        severity: item.status === AuditItemStatus.MISSING ? "High" : "Medium",
        status: item.status === AuditItemStatus.VERIFIED ? "Resolved" : "Pending",
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
    const userName = user ? user.fullName : "System";

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
      user: userName,
      details: l.description,
      category: categoryName,
    };
  });

  const notificationsMapped = notifications.map((n) => {
    return {
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
    };
  });

  // ── Screen Router ────────────────────────────────────────────────────────
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case "dashboard":
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
        return (
          <ResourceBookingView
            currentUser={currentUser}
            bookings={bookingsMapped}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
          />
        );
      case "maintenance":
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
        return (
          <AssetAuditView
            currentUser={currentUser}
            audits={auditsMapped}
            onVerifyChecklistItem={handleVerifyChecklistItem}
            onResolveDiscrepancy={handleResolveDiscrepancy}
          />
        );
      case "analytics":
        return (
          <AnalyticsView
            assets={assetsMapped}
            departments={departmentsMapped}
          />
        );
      case "logs":
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
            <h2 className="text-xl font-bold text-white">404 Error</h2>
            <p className="text-slate-400 mt-2">
              Specified asset screen code &quot;{activeScreen}&quot; not recognized.
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
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute w-6 h-6 border-4 border-emerald-500/10 border-b-emerald-500 rounded-full animate-spin"></div>
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
