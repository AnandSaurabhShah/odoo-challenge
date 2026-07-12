import { create } from "zustand";
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
  initialDepartments,
  initialUsers,
  initialAssetCategories,
  initialAssets,
  initialAssetAllocations,
  initialTransferRequests,
  initialResourceBookings,
  initialMaintenanceRequests,
  initialAuditCycles,
  initialAuditAssignments,
  initialAuditItems,
  initialNotifications,
  initialActivityLogs,
} from "../types.js";

export const useAssetStore = create((set, get) => ({
  currentUser: null,
  activeScreen: "dashboard",

  departments: initialDepartments,
  users: initialUsers,
  categories: initialAssetCategories,
  assets: initialAssets,
  allocations: initialAssetAllocations,
  transfers: initialTransferRequests,
  bookings: initialResourceBookings,
  maintenance: initialMaintenanceRequests,
  audits: initialAuditCycles,
  auditAssignments: initialAuditAssignments,
  auditItems: initialAuditItems,
  notifications: initialNotifications,
  logs: initialActivityLogs,

  // Simple Actions
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setCurrentUser: (user) => set({ currentUser: user }),

  logEvent: (actionTitle, details, executorName, category) => {
    const { users } = get();
    const executorUser =
      users.find((u) => `${u.firstName} ${u.lastName}` === executorName) ||
      users[0];

    // Log ActivityLog row
    let actAction = ActivityAction.UPDATE;
    if (
      actionTitle.toLowerCase().includes("register") ||
      actionTitle.toLowerCase().includes("create")
    ) {
      actAction = ActivityAction.CREATE;
    } else if (actionTitle.toLowerCase().includes("transfer")) {
      actAction = ActivityAction.TRANSFER;
    } else if (actionTitle.toLowerCase().includes("approve")) {
      actAction = ActivityAction.APPROVE;
    } else if (actionTitle.toLowerCase().includes("reject")) {
      actAction = ActivityAction.REJECT;
    } else if (actionTitle.toLowerCase().includes("verify")) {
      actAction = ActivityAction.VERIFY;
    } else if (actionTitle.toLowerCase().includes("resolve")) {
      actAction = ActivityAction.RESOLVE;
    } else if (actionTitle.toLowerCase().includes("book")) {
      actAction = ActivityAction.BOOK;
    } else if (actionTitle.toLowerCase().includes("cancel")) {
      actAction = ActivityAction.CANCEL;
    }

    let entType = EntityType.ASSET;
    if (category === "Transfer") entType = EntityType.TRANSFER;
    else if (category === "Maintenance") entType = EntityType.MAINTENANCE;
    else if (category === "Booking") entType = EntityType.BOOKING;

    const newLog = {
      id: "l_" + Date.now() + Math.random().toString(36).substr(2, 4),
      userId: executorUser?.id || "u1",
      action: actAction,
      entityType: entType,
      entityId: null,
      description: details,
      createdAt: new Date().toISOString(),
    };

    // Push associated Notification row
    const isWarning =
      actionTitle.toLowerCase().includes("reject") ||
      actionTitle.toLowerCase().includes("fail") ||
      actionTitle.toLowerCase().includes("cancel");
    const newNotif = {
      id: "n_" + Date.now(),
      userId: executorUser?.id || "u1",
      title: actionTitle,
      message: details,
      type: isWarning
        ? NotificationType.TRANSFER_REJECTED
        : NotificationType.ASSET_ASSIGNED,
      relatedEntityType: entType,
      relatedEntityId: null,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      logs: [newLog, ...state.logs],
      notifications: [newNotif, ...state.notifications],
    }));
  },

  handleLogin: (rawUser) => {
    const { users, departments, logEvent } = get();
    // Look up or establish this user in our state
    let targetUser = users.find((u) => u.email === rawUser.email);
    if (!targetUser) {
      const [first, ...lastParts] = (rawUser.name || "External User").split(
        " ",
      );
      const last = lastParts.join(" ") || "Reviewer";
      targetUser = {
        id: rawUser.id,
        firstName: first,
        lastName: last,
        email: rawUser.email,
        passwordHash: "$2b$10$temporaryhash",
        phone: "+1-555-0100",
        employeeId: "EMP-" + Math.floor(100 + Math.random() * 900),
        role:
          rawUser.role === "System Admin"
            ? UserRole.ADMIN
            : rawUser.role === "Department Manager"
              ? UserRole.DEPARTMENT_HEAD
              : rawUser.role === "Technician"
                ? UserRole.ASSET_MANAGER
                : UserRole.EMPLOYEE,
        departmentId: "d1",
        status: RecordStatus.ACTIVE,
        profileImage: rawUser.avatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({ users: [targetUser, ...state.users] }));
    }

    const mappedUser = {
      id: targetUser.id,
      name: `${targetUser.firstName} ${targetUser.lastName}`,
      email: targetUser.email,
      department:
        departments.find((d) => d.id === targetUser.departmentId)?.name ||
        "Engineering & DevOps",
      role:
        targetUser.role === UserRole.ADMIN
          ? "System Admin"
          : targetUser.role === UserRole.DEPARTMENT_HEAD
            ? "Department Manager"
            : targetUser.role === UserRole.ASSET_MANAGER
              ? "Technician"
              : "Employee",
      avatar: targetUser.profileImage,
    };

    set({ currentUser: mappedUser });
    logEvent(
      "User Session Started",
      `${mappedUser.name} authenticated with corporate role "${mappedUser.role}"`,
      mappedUser.name,
      "System",
    );
  },

  handleLogout: () => {
    const { currentUser, logEvent } = get();
    if (currentUser) {
      logEvent(
        "User Session Terminated",
        `${currentUser.name} signed out securely.`,
        currentUser.name,
        "System",
      );
    }
    set({ currentUser: null, activeScreen: "dashboard" });
  },

  handleAddDepartment: (newDept) => {
    const { currentUser, logEvent } = get();
    const deptId = "d_" + Date.now();
    const rawDept = {
      id: deptId,
      name: newDept.name,
      code: newDept.code.toUpperCase(),
      description: "Custom corporate division config.",
      parentDepartmentId: null,
      headId: "u1", // Default head to Alice for stability
      status: RecordStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ departments: [...state.departments, rawDept] }));
    logEvent(
      "Department Configured",
      `Operational division "${newDept.name}" (${newDept.code}) established.`,
      currentUser?.name,
      "System",
    );
  },

  handleAddEmployee: (newEmp) => {
    const { currentUser, departments, logEvent } = get();
    const empId = "u_" + Date.now();
    const [first, ...lastParts] = newEmp.name.split(" ");
    const last = lastParts.join(" ") || "Staff";

    const targetDept = departments.find((d) => d.name === newEmp.department);
    const deptId = targetDept ? targetDept.id : "d1";

    const rawUser = {
      id: empId,
      firstName: first,
      lastName: last,
      email: newEmp.email,
      passwordHash: "$2b$10$manualhash",
      phone: "+1-555-0100",
      employeeId: "EMP-" + Math.floor(100 + Math.random() * 900),
      role: UserRole.EMPLOYEE,
      departmentId: deptId,
      status: RecordStatus.ACTIVE,
      profileImage:
        newEmp.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({ users: [rawUser, ...state.users] }));
    logEvent(
      "Employee Enrolled",
      `New employee profile "${newEmp.name}" registered under ${newEmp.department} division.`,
      currentUser?.name,
      "System",
    );
  },

  handleDeleteEmployee: (empId) => {
    const { currentUser, users, logEvent } = get();
    const userToDelete = users.find((u) => u.id === empId);
    if (!userToDelete) return;

    set((state) => ({ users: state.users.filter((u) => u.id !== empId) }));
    logEvent(
      "Employee De-enrolled",
      `Employee "${userToDelete.firstName} ${userToDelete.lastName}" removed from active staff records.`,
      currentUser?.name,
      "System",
    );
  },

  handleAddAsset: (newAsset) => {
    const { currentUser, categories, departments, users, logEvent } = get();
    const assetId = "a_" + Date.now();
    const targetCat =
      categories.find((c) => c.name === newAsset.category) || categories[0];
    const targetDept =
      departments.find((d) => d.name === newAsset.department) || departments[0];

    const rawAsset = {
      id: assetId,
      assetTag: "AF-" + Math.floor(1000 + Math.random() * 9000),
      qrCode: "AF-" + Math.floor(1000 + Math.random() * 9000),
      name: newAsset.name,
      serialNumber:
        newAsset.serialNumber ||
        "SN-" + Math.floor(100000 + Math.random() * 900000),
      description: "Registered asset model: " + (newAsset.model || "N/A"),
      categoryId: targetCat.id,
      ownerDepartmentId: targetDept.id,
      acquisitionDate: newAsset.purchaseDate + "T00:00:00Z",
      acquisitionCost: Number(newAsset.purchaseValue),
      condition: AssetCondition.NEW,
      status: newAsset.assignedTo
        ? AssetStatus.ALLOCATED
        : AssetStatus.AVAILABLE,
      locationCode: newAsset.location || "HQ - Office",
      isBookable: true,
      imageUrl:
        newAsset.image ||
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
      documentUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({ assets: [rawAsset, ...state.assets] }));

    if (newAsset.assignedTo) {
      const targetUser =
        users.find(
          (u) => `${u.firstName} ${u.lastName}` === newAsset.assignedTo,
        ) || users[0];
      const newAlloc = {
        id: "al_" + Date.now(),
        assetId: assetId,
        userId: targetUser.id,
        allocatedById: "u1",
        allocatedAt: new Date().toISOString(),
        expectedReturnDate: null,
        returnedAt: null,
        returnCondition: null,
        returnRemarks: null,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ allocations: [...state.allocations, newAlloc] }));
    }

    logEvent(
      "New Asset Registered",
      `Registered ${newAsset.name} (Value: $${Number(newAsset.purchaseValue).toLocaleString()}) under ${newAsset.department}.`,
      currentUser?.name,
      "Asset",
    );
  },

  handleRequestTransfer: (newTrans) => {
    const { currentUser, departments, users, assets, allocations, logEvent } =
      get();
    const transId = "t_" + Date.now();

    const targetToDept =
      departments.find((d) => d.name === newTrans.toDept) || departments[0];
    const targetToUser =
      users.find((u) => u.departmentId === targetToDept.id) || users[0];

    const asset = assets.find((a) => a.id === newTrans.assetId);
    const activeAlloc = allocations.find(
      (al) => al.assetId === newTrans.assetId && al.returnedAt === null,
    );
    const fromUserId = activeAlloc
      ? activeAlloc.userId
      : users.find((u) => u.departmentId === asset?.ownerDepartmentId)?.id ||
        "u1";

    const rawTransfer = {
      id: transId,
      assetId: newTrans.assetId,
      fromUserId: fromUserId,
      toUserId: targetToUser.id,
      requestedById: "u1",
      approvedById: null,
      reason: newTrans.notes || "Re-assignment of asset requested.",
      status: TransferStatus.PENDING,
      requestDate: new Date().toISOString(),
      decisionDate: null,
      remarks: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({ transfers: [rawTransfer, ...state.transfers] }));
    logEvent(
      "Transfer Request Raised",
      `Requested re-assignment of "${newTrans.assetName}" to ${newTrans.toDept}.`,
      currentUser?.name,
      "Transfer",
    );
  },

  handleApproveTransfer: (transId) => {
    const { currentUser, transfers, assets, users, logEvent } = get();
    const req = transfers.find((t) => t.id === transId);
    if (!req) return;

    set((state) => ({
      transfers: state.transfers.map((t) =>
        t.id === transId
          ? {
              ...t,
              status: TransferStatus.APPROVED,
              approvedById: "u1",
              decisionDate: new Date().toISOString(),
            }
          : t,
      ),
    }));

    const targetAsset = assets.find((a) => a.id === req.assetId);
    if (targetAsset) {
      const recipientUser = users.find((u) => u.id === req.toUserId);
      const recipientDeptId = recipientUser
        ? recipientUser.departmentId
        : targetAsset.ownerDepartmentId;

      set((state) => ({
        assets: state.assets.map((a) => {
          if (a.id === req.assetId) {
            return {
              ...a,
              ownerDepartmentId: recipientDeptId,
              status: AssetStatus.ALLOCATED,
              locationCode: `HQ - Transferred`,
            };
          }
          return a;
        }),
        allocations: state.allocations.map((al) => {
          if (al.assetId === req.assetId && al.returnedAt === null) {
            return {
              ...al,
              returnedAt: new Date().toISOString(),
              returnCondition: AssetCondition.GOOD,
            };
          }
          return al;
        }),
      }));

      const newAlloc = {
        id: "al_" + Date.now(),
        assetId: req.assetId,
        userId: req.toUserId,
        allocatedById: "u1",
        allocatedAt: new Date().toISOString(),
        expectedReturnDate: null,
        returnedAt: null,
        returnCondition: null,
        returnRemarks: null,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ allocations: [...state.allocations, newAlloc] }));
    }

    const assetName = targetAsset ? targetAsset.name : "Device";
    logEvent(
      "Transfer Approved",
      `Handover of "${assetName}" authorized. New active custody row established.`,
      currentUser?.name,
      "Transfer",
    );
  },

  handleRejectTransfer: (transId) => {
    const { currentUser, logEvent } = get();
    set((state) => ({
      transfers: state.transfers.map((t) =>
        t.id === transId
          ? {
              ...t,
              status: TransferStatus.REJECTED,
              approvedById: "u1",
              decisionDate: new Date().toISOString(),
            }
          : t,
      ),
    }));
    logEvent(
      "Transfer Request Denied",
      `Authorization denied for transfer request #${transId}.`,
      currentUser?.name,
      "Transfer",
    );
  },

  handleAddBooking: (newBook) => {
    const { currentUser, assets, logEvent } = get();
    const bookId = "b_" + Date.now();
    const targetAsset =
      assets.find((a) => a.name === newBook.resourceName) || assets[0];

    const rawBooking = {
      id: bookId,
      assetId: targetAsset.id,
      bookedById: "u1",
      startTime: `${newBook.date}T${newBook.startTime}:00Z`,
      endTime: `${newBook.date}T${newBook.endTime}:00Z`,
      purpose: newBook.purpose,
      status: BookingStatus.UPCOMING,
      cancellationReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      bookings: [rawBooking, ...state.bookings],
      assets: state.assets.map((a) =>
        a.id === targetAsset.id ? { ...a, status: AssetStatus.RESERVED } : a,
      ),
    }));

    logEvent(
      "Resource Reserved",
      `Booked "${newBook.resourceName}" (${newBook.category}) for ${newBook.date} from ${newBook.startTime} to ${newBook.endTime}.`,
      currentUser?.name,
      "Booking",
    );
  },

  handleCancelBooking: (bookId) => {
    const { currentUser, bookings, assets, logEvent } = get();
    const targetBook = bookings.find((b) => b.id === bookId);
    if (!targetBook) return;

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookId
          ? {
              ...b,
              status: BookingStatus.CANCELLED,
              cancellationReason: "Cancelled by user.",
            }
          : b,
      ),
      assets: state.assets.map((a) =>
        a.id === targetBook.assetId
          ? { ...a, status: AssetStatus.AVAILABLE }
          : a,
      ),
    }));

    const asset = assets.find((a) => a.id === targetBook.assetId);
    logEvent(
      "Reservation Revoked",
      `Cancelled booking reservation for "${asset ? asset.name : "Resource"}".`,
      currentUser?.name,
      "Booking",
    );
  },

  handleAddMaintenanceTask: (newTask) => {
    const { currentUser, logEvent } = get();
    const taskId = "m_" + Date.now();

    const rawMaintenance = {
      id: taskId,
      assetId: newTask.assetId,
      reportedById: "u1",
      approvedById: "u1",
      assignedToId: "u6",
      title: newTask.title,
      description: newTask.description,
      priority:
        newTask.priority === "High"
          ? MaintenancePriority.HIGH
          : newTask.priority === "Critical"
            ? MaintenancePriority.CRITICAL
            : newTask.priority === "Low"
              ? MaintenancePriority.LOW
              : MaintenancePriority.MEDIUM,
      status: MaintenanceStatus.ASSIGNED,
      beforePhotoUrl: null,
      afterPhotoUrl: null,
      resolutionNotes: null,
      reportedAt: new Date().toISOString(),
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    set((state) => ({
      maintenance: [rawMaintenance, ...state.maintenance],
      assets: state.assets.map((a) =>
        a.id === newTask.assetId
          ? { ...a, status: AssetStatus.UNDER_MAINTENANCE }
          : a,
      ),
      allocations: state.allocations.map((al) => {
        if (al.assetId === newTask.assetId && al.returnedAt === null) {
          return {
            ...al,
            returnedAt: new Date().toISOString(),
            returnCondition: AssetCondition.DAMAGED,
            returnRemarks: "Transferred to maintenance.",
          };
        }
        return al;
      }),
    }));

    logEvent(
      "Maintenance Ticket Raised",
      `Filed "${newTask.title}" issue ticket for asset "${newTask.assetName}". Status: In Maintenance.`,
      currentUser?.name,
      "Maintenance",
    );
  },

  handleUpdateMaintenanceStatus: (taskId, status, technician) => {
    const { currentUser, maintenance, users, logEvent } = get();
    const task = maintenance.find((m) => m.id === taskId);
    if (!task) return;

    let dbStatus = MaintenanceStatus.PENDING;
    if (status === "Approved") dbStatus = MaintenanceStatus.APPROVED;
    else if (status === "Technician Assigned" || technician)
      dbStatus = MaintenanceStatus.ASSIGNED;
    else if (status === "In Progress") dbStatus = MaintenanceStatus.IN_PROGRESS;
    else if (status === "Completed") dbStatus = MaintenanceStatus.RESOLVED;
    else if (status === "Rejected") dbStatus = MaintenanceStatus.REJECTED;

    const techUser = technician
      ? users.find((u) => `${u.firstName} ${u.lastName}` === technician) ||
        users.find((u) => u.role === UserRole.ASSET_MANAGER)
      : null;

    set((state) => ({
      maintenance: state.maintenance.map((m) => {
        if (m.id === taskId) {
          return {
            ...m,
            status: dbStatus,
            assignedToId: techUser ? techUser.id : m.assignedToId,
            completedAt:
              dbStatus === MaintenanceStatus.RESOLVED
                ? new Date().toISOString()
                : m.completedAt,
          };
        }
        return m;
      }),
    }));

    if (dbStatus === MaintenanceStatus.RESOLVED) {
      set((state) => ({
        assets: state.assets.map((a) =>
          a.id === task.assetId ? { ...a, status: AssetStatus.AVAILABLE } : a,
        ),
      }));
      logEvent(
        "Maintenance Ticket Resolved",
        `Work order "${task.title}" completed. Asset returned to active operation pool.`,
        currentUser?.name,
        "Maintenance",
      );
    } else {
      logEvent(
        "Maintenance Ticket Updated",
        `Task "${task.title}" updated to status "${dbStatus}".`,
        currentUser?.name,
        "Maintenance",
      );
    }
  },

  handleAddComment: (taskId, comment) => {
    const { currentUser, logEvent } = get();
    set((state) => ({
      maintenance: state.maintenance.map((m) => {
        if (m.id === taskId) {
          return { ...m, comments: [...(m.comments || []), comment] };
        }
        return m;
      }),
    }));
    logEvent(
      "Diagnostic Comment Logged",
      `Comment posted under ticket #${taskId}.`,
      currentUser?.name,
      "Maintenance",
    );
  },

  handleVerifyChecklistItem: (auditId, itemId, checkedBy) => {
    const { currentUser, users, auditItems, assets, logEvent } = get();
    set((state) => ({
      auditItems: state.auditItems.map((item) => {
        if (item.id === itemId) {
          const verifier =
            users.find((u) => `${u.firstName} ${u.lastName}` === checkedBy) ||
            users[0];
          return {
            ...item,
            status: AuditItemStatus.VERIFIED,
            verifiedById: verifier.id,
            verifiedAt: new Date().toISOString(),
          };
        }
        return item;
      }),
    }));

    const item = auditItems.find((i) => i.id === itemId);
    const asset = assets.find((a) => a.id === item?.assetId);
    logEvent(
      "Audit Item Verified",
      `Scanned and checked-off asset "${asset ? asset.name : "Device"}" on global registry checklist.`,
      currentUser?.name,
      "System",
    );
  },

  handleResolveDiscrepancy: (auditId, discId) => {
    const { currentUser, auditItems, assets, logEvent } = get();
    const auditItemId = discId.replace("dc_", "");

    set((state) => ({
      auditItems: state.auditItems.map((item) => {
        if (item.id === auditItemId) {
          return {
            ...item,
            status: AuditItemStatus.VERIFIED,
            verifiedById: "u1",
            verifiedAt: new Date().toISOString(),
          };
        }
        return item;
      }),
    }));

    const item = auditItems.find((i) => i.id === auditItemId);
    const asset = assets.find((a) => a.id === item?.assetId);
    logEvent(
      "Discrepancy Reconciled",
      `Resolved registry mismatch for "${asset ? asset.name : "Device"}".`,
      currentUser?.name,
      "System",
    );
  },

  handleMarkNotificationRead: (notifId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n,
      ),
    }));
  },

  handleClearNotifications: () => {
    set({ notifications: [] });
  },
}));
