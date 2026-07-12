import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAssetStore } from "../store/useAssetStore.js";

// Query keys for TanStack Query cache invalidations
export const QUERY_KEYS = {
  DEPARTMENTS: "departments",
  USERS: "users",
  CATEGORIES: "categories",
  ASSETS: "assets",
  ALLOCATIONS: "allocations",
  TRANSFERS: "transfers",
  BOOKINGS: "bookings",
  MAINTENANCE: "maintenance",
  AUDITS: "audits",
  AUDIT_ITEMS: "auditItems",
  NOTIFICATIONS: "notifications",
  LOGS: "logs",
};

// ==========================================
// 1. QUERY HOOKS (Fetching Server State)
// ==========================================

export function useDepartments() {
  const departments = useAssetStore((state) => state.departments);
  return useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENTS],
    queryFn: async () => {
      // Simulation of a server network request
      await new Promise((resolve) => setTimeout(resolve, 50));
      return departments;
    },
    placeholderData: departments,
  });
}

export function useUsers() {
  const users = useAssetStore((state) => state.users);
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return users;
    },
    placeholderData: users,
  });
}

export function useCategories() {
  const categories = useAssetStore((state) => state.categories);
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return categories;
    },
    placeholderData: categories,
  });
}

export function useAssets() {
  const assets = useAssetStore((state) => state.assets);
  return useQuery({
    queryKey: [QUERY_KEYS.ASSETS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return assets;
    },
    placeholderData: assets,
  });
}

export function useAllocations() {
  const allocations = useAssetStore((state) => state.allocations);
  return useQuery({
    queryKey: [QUERY_KEYS.ALLOCATIONS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return allocations;
    },
    placeholderData: allocations,
  });
}

export function useTransfers() {
  const transfers = useAssetStore((state) => state.transfers);
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSFERS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return transfers;
    },
    placeholderData: transfers,
  });
}

export function useBookings() {
  const bookings = useAssetStore((state) => state.bookings);
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return bookings;
    },
    placeholderData: bookings,
  });
}

export function useMaintenance() {
  const maintenance = useAssetStore((state) => state.maintenance);
  return useQuery({
    queryKey: [QUERY_KEYS.MAINTENANCE],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return maintenance;
    },
    placeholderData: maintenance,
  });
}

export function useAudits() {
  const audits = useAssetStore((state) => state.audits);
  return useQuery({
    queryKey: [QUERY_KEYS.AUDITS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return audits;
    },
    placeholderData: audits,
  });
}

export function useAuditItems() {
  const auditItems = useAssetStore((state) => state.auditItems);
  return useQuery({
    queryKey: [QUERY_KEYS.AUDIT_ITEMS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return auditItems;
    },
    placeholderData: auditItems,
  });
}

export function useNotifications() {
  const notifications = useAssetStore((state) => state.notifications);
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return notifications;
    },
    placeholderData: notifications,
  });
}

export function useLogs() {
  const logs = useAssetStore((state) => state.logs);
  return useQuery({
    queryKey: [QUERY_KEYS.LOGS],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return logs;
    },
    placeholderData: logs,
  });
}

// ==========================================
// 2. MUTATION HOOKS (Modifying Server State)
// ==========================================

export function useAddDepartmentMutation() {
  const queryClient = useQueryClient();
  const handleAddDepartment = useAssetStore(
    (state) => state.handleAddDepartment,
  );

  return useMutation({
    mutationFn: async (newDept) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleAddDepartment(newDept);
      return newDept;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPARTMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useAddEmployeeMutation() {
  const queryClient = useQueryClient();
  const handleAddEmployee = useAssetStore((state) => state.handleAddEmployee);

  return useMutation({
    mutationFn: async (newEmp) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleAddEmployee(newEmp);
      return newEmp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  const handleDeleteEmployee = useAssetStore(
    (state) => state.handleDeleteEmployee,
  );

  return useMutation({
    mutationFn: async (empId) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleDeleteEmployee(empId);
      return empId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useAddAssetMutation() {
  const queryClient = useQueryClient();
  const handleAddAsset = useAssetStore((state) => state.handleAddAsset);

  return useMutation({
    mutationFn: async (newAsset) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleAddAsset(newAsset);
      return newAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useRequestTransferMutation() {
  const queryClient = useQueryClient();
  const handleRequestTransfer = useAssetStore(
    (state) => state.handleRequestTransfer,
  );

  return useMutation({
    mutationFn: async (newTrans) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleRequestTransfer(newTrans);
      return newTrans;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSFERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useApproveTransferMutation() {
  const queryClient = useQueryClient();
  const handleApproveTransfer = useAssetStore(
    (state) => state.handleApproveTransfer,
  );

  return useMutation({
    mutationFn: async (transId) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleApproveTransfer(transId);
      return transId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSFERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useRejectTransferMutation() {
  const queryClient = useQueryClient();
  const handleRejectTransfer = useAssetStore(
    (state) => state.handleRejectTransfer,
  );

  return useMutation({
    mutationFn: async (transId) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleRejectTransfer(transId);
      return transId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSFERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useAddBookingMutation() {
  const queryClient = useQueryClient();
  const handleAddBooking = useAssetStore((state) => state.handleAddBooking);

  return useMutation({
    mutationFn: async (newBook) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleAddBooking(newBook);
      return newBook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  const handleCancelBooking = useAssetStore(
    (state) => state.handleCancelBooking,
  );

  return useMutation({
    mutationFn: async (bookId) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleCancelBooking(bookId);
      return bookId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useAddMaintenanceTaskMutation() {
  const queryClient = useQueryClient();
  const handleAddMaintenanceTask = useAssetStore(
    (state) => state.handleAddMaintenanceTask,
  );

  return useMutation({
    mutationFn: async (newTask) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleAddMaintenanceTask(newTask);
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MAINTENANCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALLOCATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useUpdateMaintenanceStatusMutation() {
  const queryClient = useQueryClient();
  const handleUpdateMaintenanceStatus = useAssetStore(
    (state) => state.handleUpdateMaintenanceStatus,
  );

  return useMutation({
    mutationFn: async ({ taskId, status, technician }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleUpdateMaintenanceStatus(taskId, status, technician);
      return { taskId, status, technician };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MAINTENANCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useAddCommentMutation() {
  const queryClient = useQueryClient();
  const handleAddComment = useAssetStore((state) => state.handleAddComment);

  return useMutation({
    mutationFn: async ({ taskId, comment }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleAddComment(taskId, comment);
      return { taskId, comment };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MAINTENANCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
    },
  });
}

export function useVerifyChecklistItemMutation() {
  const queryClient = useQueryClient();
  const handleVerifyChecklistItem = useAssetStore(
    (state) => state.handleVerifyChecklistItem,
  );

  return useMutation({
    mutationFn: async ({ auditId, itemId, checkedBy }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleVerifyChecklistItem(auditId, itemId, checkedBy);
      return { auditId, itemId, checkedBy };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUDIT_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useResolveDiscrepancyMutation() {
  const queryClient = useQueryClient();
  const handleResolveDiscrepancy = useAssetStore(
    (state) => state.handleResolveDiscrepancy,
  );

  return useMutation({
    mutationFn: async ({ auditId, discId }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleResolveDiscrepancy(auditId, discId);
      return { auditId, discId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUDIT_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  const handleMarkNotificationRead = useAssetStore(
    (state) => state.handleMarkNotificationRead,
  );

  return useMutation({
    mutationFn: async (notifId) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      handleMarkNotificationRead(notifId);
      return notifId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useClearNotificationsMutation() {
  const queryClient = useQueryClient();
  const handleClearNotifications = useAssetStore(
    (state) => state.handleClearNotifications,
  );

  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      handleClearNotifications();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}
