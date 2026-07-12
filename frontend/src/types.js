// Enums defined in DATABASE_DESIGN.md
export const RecordStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export const UserRole = {
  ADMIN: 'ADMIN',
  ASSET_MANAGER: 'ASSET_MANAGER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  EMPLOYEE: 'EMPLOYEE'
};

export const AssetStatus = {
  AVAILABLE: 'AVAILABLE',
  ALLOCATED: 'ALLOCATED',
  RESERVED: 'RESERVED',
  UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
  LOST: 'LOST',
  RETIRED: 'RETIRED',
  DISPOSED: 'DISPOSED'
};

export const AssetCondition = {
  NEW: 'NEW',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  POOR: 'POOR',
  DAMAGED: 'DAMAGED'
};

export const TransferStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export const BookingStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const MaintenanceStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

export const MaintenancePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const AuditStatus = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const AuditItemStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  MISSING: 'MISSING',
  DAMAGED: 'DAMAGED'
};

export const NotificationType = {
  ASSET_ASSIGNED: 'ASSET_ASSIGNED',
  TRANSFER_APPROVED: 'TRANSFER_APPROVED',
  TRANSFER_REJECTED: 'TRANSFER_REJECTED',
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_REMINDER: 'BOOKING_REMINDER',
  MAINTENANCE_APPROVED: 'MAINTENANCE_APPROVED',
  AUDIT_ASSIGNED: 'AUDIT_ASSIGNED',
  OVERDUE_RETURN: 'OVERDUE_RETURN'
};

export const ActivityAction = {
  LOGIN: 'LOGIN',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ALLOCATE: 'ALLOCATE',
  RETURN: 'RETURN',
  TRANSFER: 'TRANSFER',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  VERIFY: 'VERIFY',
  RESOLVE: 'RESOLVE',
  BOOK: 'BOOK',
  CANCEL: 'CANCEL'
};

export const EntityType = {
  ASSET: 'ASSET',
  BOOKING: 'BOOKING',
  MAINTENANCE: 'MAINTENANCE',
  TRANSFER: 'TRANSFER',
  AUDIT: 'AUDIT',
  USER: 'USER',
  CATEGORY: 'CATEGORY'
};

// Seed Datasets representing PostgreSQL/Prisma tables

// 6.1 Department
export const initialDepartments = [
  { 
    id: 'd1', 
    name: 'Engineering & DevOps', 
    code: 'ENG', 
    description: 'Hardware development, cloud deployments, and internal IT infrastructure support.',
    parentDepartmentId: null,
    headId: 'u1', // Alice Smith
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  { 
    id: 'd2', 
    name: 'Product & Design', 
    code: 'PROD', 
    description: 'Product lifecycle mapping, user interface crafting, and user research protocols.',
    parentDepartmentId: null,
    headId: 'u2', // Marcus Vance
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  { 
    id: 'd3', 
    name: 'Operations & Logistics', 
    code: 'OPS', 
    description: 'Corporate vehicle fleets, inventory transport warehouses, and physical security assets.',
    parentDepartmentId: null,
    headId: 'u3', // Diana Prince
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  { 
    id: 'd4', 
    name: 'Marketing & Sales', 
    code: 'MKT', 
    description: 'Field marketing equipment, customer showcases, sales collateral, and public relations.',
    parentDepartmentId: null,
    headId: 'u4', // Charlie Green
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  }
];

// 6.2 User
export const initialUsers = [
  {
    id: 'u1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@assetflow.corp',
    passwordHash: '$2b$10$hashedstuff1',
    phone: '+1-555-0199',
    employeeId: 'EMP-001',
    role: UserRole.ADMIN,
    departmentId: 'd1',
    status: RecordStatus.ACTIVE,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-02T09:00:00Z'
  },
  {
    id: 'u2',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@assetflow.corp',
    passwordHash: '$2b$10$hashedstuff2',
    phone: '+1-555-0122',
    employeeId: 'EMP-002',
    role: UserRole.DEPARTMENT_HEAD,
    departmentId: 'd2',
    status: RecordStatus.ACTIVE,
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    createdAt: '2025-01-03T10:00:00Z',
    updatedAt: '2025-01-03T10:00:00Z'
  },
  {
    id: 'u3',
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'diana.prince@assetflow.corp',
    passwordHash: '$2b$10$hashedstuff3',
    phone: '+1-555-0133',
    employeeId: 'EMP-003',
    role: UserRole.DEPARTMENT_HEAD,
    departmentId: 'd3',
    status: RecordStatus.ACTIVE,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: '2025-01-04T11:00:00Z',
    updatedAt: '2025-01-04T11:00:00Z'
  },
  {
    id: 'u4',
    firstName: 'Charlie',
    lastName: 'Green',
    email: 'charlie.green@assetflow.corp',
    passwordHash: '$2b$10$hashedstuff4',
    phone: '+1-555-0144',
    employeeId: 'EMP-004',
    role: UserRole.EMPLOYEE,
    departmentId: 'd4',
    status: RecordStatus.ACTIVE,
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    createdAt: '2025-01-05T12:00:00Z',
    updatedAt: '2025-01-05T12:00:00Z'
  },
  {
    id: 'u5',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@assetflow.corp',
    passwordHash: '$2b$10$hashedstuff5',
    phone: '+1-555-0155',
    employeeId: 'EMP-005',
    role: UserRole.EMPLOYEE,
    departmentId: 'd1',
    status: RecordStatus.ACTIVE,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    createdAt: '2025-01-06T14:00:00Z',
    updatedAt: '2025-01-06T14:00:00Z'
  },
  {
    id: 'u6',
    firstName: 'James',
    lastName: 'Carter',
    email: 'james.carter@assetflow.corp',
    passwordHash: '$2b$10$hashedstuff6',
    phone: '+1-555-0166',
    employeeId: 'EMP-006',
    role: UserRole.ASSET_MANAGER,
    departmentId: 'd3',
    status: RecordStatus.ACTIVE,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: '2025-01-07T15:00:00Z',
    updatedAt: '2025-01-07T15:00:00Z'
  }
];

// 6.3 AssetCategory
export const initialAssetCategories = [
  {
    id: 'cat1',
    name: 'Computing',
    description: 'Laptops, Developer workstations, tablets, and test phones.',
    icon: 'laptop',
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'cat2',
    name: 'Media Equipment',
    description: 'Cameras, Drones, stabilizers, studio lighting, and audio rigs.',
    icon: 'camera',
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'cat3',
    name: 'Infrastructure',
    description: 'Server racks, switches, routers, HVAC monitoring nodes.',
    icon: 'server',
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'cat4',
    name: 'Vehicles',
    description: 'Transit vans, transport trucks, field testing cars.',
    icon: 'truck',
    status: RecordStatus.ACTIVE,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z'
  }
];

// 6.4 Asset
export const initialAssets = [
  {
    id: 'a1',
    assetTag: 'AF-0001',
    qrCode: 'AF-0001',
    name: 'MacBook Pro 16" M3 Max',
    serialNumber: 'C02F1234Q05D',
    description: 'Ultra high end developer laptop with 64GB Unified Memory and 2TB SSD.',
    categoryId: 'cat1',
    ownerDepartmentId: 'd1', // ENG
    acquisitionDate: '2025-11-10T00:00:00Z',
    acquisitionCost: 4200,
    condition: AssetCondition.NEW,
    status: AssetStatus.ALLOCATED,
    locationCode: 'HQ-F3-R301',
    isBookable: false,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
    documentUrl: 'https://manuals.assetflow.corp/macbook_specs.pdf',
    createdAt: '2025-11-10T11:00:00Z',
    updatedAt: '2025-11-10T11:00:00Z'
  },
  {
    id: 'a2',
    assetTag: 'AF-0002',
    qrCode: 'AF-0002',
    name: 'Dell XPS 15 9530',
    serialNumber: 'D45X9821Z08B',
    description: 'High performance Engineering laptop with discrete NVIDIA Graphics.',
    categoryId: 'cat1',
    ownerDepartmentId: 'd1', // ENG
    acquisitionDate: '2025-08-15T00:00:00Z',
    acquisitionCost: 2400,
    condition: AssetCondition.GOOD,
    status: AssetStatus.AVAILABLE,
    locationCode: 'HQ-F3-R305',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300',
    documentUrl: 'https://manuals.assetflow.corp/dell_xps.pdf',
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-08-15T09:00:00Z'
  },
  {
    id: 'a3',
    assetTag: 'AF-0003',
    qrCode: 'AF-0003',
    name: 'iPad Pro 12.9" Cellular',
    serialNumber: 'DLX91283M4',
    description: 'M2 Silicon Liquid Retina display tablet with 5G cellular card.',
    categoryId: 'cat1',
    ownerDepartmentId: 'd2', // PROD
    acquisitionDate: '2025-06-12T00:00:00Z',
    acquisitionCost: 1399,
    condition: AssetCondition.GOOD,
    status: AssetStatus.ALLOCATED,
    locationCode: 'HQ-F2-R204',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
    documentUrl: 'https://manuals.assetflow.corp/ipad_specs.pdf',
    createdAt: '2025-06-12T10:00:00Z',
    updatedAt: '2025-06-12T10:00:00Z'
  },
  {
    id: 'a4',
    assetTag: 'AF-0004',
    qrCode: 'AF-0004',
    name: 'Sony FX3 Cinema Camera',
    serialNumber: 'SNY991823B',
    description: 'Compact cinema line camera with full frame sensor and handle XLR unit.',
    categoryId: 'cat2',
    ownerDepartmentId: 'd4', // MKT
    acquisitionDate: '2025-02-20T00:00:00Z',
    acquisitionCost: 3900,
    condition: AssetCondition.GOOD,
    status: AssetStatus.AVAILABLE,
    locationCode: 'HQ-Studio-B',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300',
    documentUrl: 'https://manuals.assetflow.corp/sony_fx3.pdf',
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-02-20T09:00:00Z'
  },
  {
    id: 'a5',
    assetTag: 'AF-0005',
    qrCode: 'AF-0005',
    name: 'Supermicro Server Rack 4U',
    serialNumber: 'SM903182-X',
    description: 'High density virtualization hypervisor server chassis.',
    categoryId: 'cat3',
    ownerDepartmentId: 'd1', // ENG
    acquisitionDate: '2024-05-14T00:00:00Z',
    acquisitionCost: 12500,
    condition: AssetCondition.GOOD,
    status: AssetStatus.AVAILABLE,
    locationCode: 'DC-Room-4B',
    isBookable: false,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300',
    documentUrl: 'https://manuals.assetflow.corp/supermicro.pdf',
    createdAt: '2024-05-14T09:00:00Z',
    updatedAt: '2024-05-14T09:00:00Z'
  },
  {
    id: 'a6',
    assetTag: 'AF-0006',
    qrCode: 'AF-0006',
    name: 'Ford Transit Cargo Van',
    serialNumber: '1FTYR2489FX123',
    description: 'Operations transport utility van with cargo racking.',
    categoryId: 'cat4',
    ownerDepartmentId: 'd3', // OPS
    acquisitionDate: '2023-11-01T00:00:00Z',
    acquisitionCost: 48000,
    condition: AssetCondition.POOR,
    status: AssetStatus.UNDER_MAINTENANCE,
    locationCode: 'WH-Parking-B',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300',
    documentUrl: 'https://manuals.assetflow.corp/ford_transit.pdf',
    createdAt: '2023-11-01T09:00:00Z',
    updatedAt: '2023-11-01T09:00:00Z'
  },
  {
    id: 'a7',
    assetTag: 'AF-0007',
    qrCode: 'AF-0007',
    name: 'DJI Inspire 3 Drone',
    serialNumber: 'DJI098234-V',
    description: 'Professional 8K cinematic imaging drone for field survey and marketing.',
    categoryId: 'cat2',
    ownerDepartmentId: 'd3', // OPS
    acquisitionDate: '2025-01-08T00:00:00Z',
    acquisitionCost: 16500,
    condition: AssetCondition.GOOD,
    status: AssetStatus.AVAILABLE,
    locationCode: 'WH-A-Safe1',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300',
    documentUrl: 'https://manuals.assetflow.corp/dji_inspire.pdf',
    createdAt: '2025-01-08T09:00:00Z',
    updatedAt: '2025-01-08T09:00:00Z'
  },
  {
    id: 'a8',
    assetTag: 'AF-0008',
    qrCode: 'AF-0008',
    name: 'Conference Room Alpha',
    serialNumber: 'CONF-RM-A',
    description: 'Boardroom space equipped with digital interactive display and Dolby Sound.',
    categoryId: 'cat3',
    ownerDepartmentId: 'd1',
    acquisitionDate: '2024-01-10T00:00:00Z',
    acquisitionCost: 15000,
    condition: AssetCondition.GOOD,
    status: AssetStatus.AVAILABLE,
    locationCode: 'HQ-F1-RoomA',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
    documentUrl: 'https://manuals.assetflow.corp/conference_alpha.pdf',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'a9',
    assetTag: 'AF-0009',
    qrCode: 'AF-0009',
    name: 'High-Speed Testing Rig B',
    serialNumber: 'RIG-B-HS',
    description: 'Specialized diagnostic hardware array for network throughput validation.',
    categoryId: 'cat3',
    ownerDepartmentId: 'd1',
    acquisitionDate: '2025-03-05T00:00:00Z',
    acquisitionCost: 9500,
    condition: AssetCondition.NEW,
    status: AssetStatus.AVAILABLE,
    locationCode: 'HQ-F3-Lab2',
    isBookable: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300',
    documentUrl: 'https://manuals.assetflow.corp/testing_rig.pdf',
    createdAt: '2025-03-05T09:00:00Z',
    updatedAt: '2025-03-05T09:00:00Z'
  }
];

// 6.5 AssetAllocation
export const initialAssetAllocations = [
  {
    id: 'al1',
    assetId: 'a1',
    userId: 'u1', // Alice Smith
    allocatedById: 'u6', // James Carter
    allocatedAt: '2025-11-10T09:00:00Z',
    expectedReturnDate: '2026-11-10T09:00:00Z',
    returnedAt: null,
    returnCondition: null,
    returnRemarks: null,
    createdAt: '2025-11-10T09:00:00Z'
  },
  {
    id: 'al2',
    assetId: 'a3',
    userId: 'u2', // Marcus Vance
    allocatedById: 'u6',
    allocatedAt: '2025-06-12T10:00:00Z',
    expectedReturnDate: '2026-06-12T10:00:00Z',
    returnedAt: null,
    returnCondition: null,
    returnRemarks: null,
    createdAt: '2025-06-12T10:00:00Z'
  },
  {
    id: 'al3',
    assetId: 'a2',
    userId: 'u5', // Sarah Connor (Previously allocated, now returned)
    allocatedById: 'u6',
    allocatedAt: '2025-08-15T09:00:00Z',
    expectedReturnDate: '2026-08-15T09:00:00Z',
    returnedAt: '2026-07-09T17:00:00Z',
    returnCondition: AssetCondition.GOOD,
    returnRemarks: 'Returned after sprint iteration completed.',
    createdAt: '2025-08-15T09:00:00Z'
  }
];

// 6.6 TransferRequest
export const initialTransferRequests = [
  {
    id: 't1',
    assetId: 'a3',
    fromUserId: 'u2', // Marcus Vance
    toUserId: 'u4', // Charlie Green (Marketing)
    requestedById: 'u2',
    approvedById: null,
    reason: 'Need this device for upcoming field testing and customer product showcase.',
    status: TransferStatus.PENDING,
    requestDate: '2026-07-10T14:30:00Z',
    decisionDate: null,
    remarks: null,
    createdAt: '2026-07-10T14:30:00Z',
    updatedAt: '2026-07-10T14:30:00Z'
  },
  {
    id: 't2',
    assetId: 'a2',
    fromUserId: 'u5', // Sarah Connor
    toUserId: 'u6', // James Carter (Operations)
    requestedById: 'u6',
    approvedById: 'u1', // Alice Smith
    reason: 'Urgent replacement for warehouse laptop that was damaged.',
    status: TransferStatus.APPROVED,
    requestDate: '2026-07-09T11:00:00Z',
    decisionDate: '2026-07-09T15:30:00Z',
    remarks: 'Authorized due to logistical urgency.',
    createdAt: '2026-07-09T11:00:00Z',
    updatedAt: '2026-07-09T15:30:00Z'
  }
];

// 6.7 ResourceBooking
export const initialResourceBookings = [
  {
    id: 'b1',
    assetId: 'a8', // Conference Room Alpha
    bookedById: 'u1', // Alice Smith
    startTime: '2026-07-13T09:00:00Z',
    endTime: '2026-07-13T10:30:00Z',
    purpose: 'Sprint Planning Meeting',
    status: BookingStatus.UPCOMING,
    cancellationReason: null,
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-10T09:00:00Z'
  },
  {
    id: 'b2',
    assetId: 'a9', // High-Speed Testing Rig B
    bookedById: 'u5', // Sarah Connor
    startTime: '2026-07-14T13:00:00Z',
    endTime: '2026-07-14T17:00:00Z',
    purpose: 'IoT Stress Testing',
    status: BookingStatus.UPCOMING,
    cancellationReason: null,
    createdAt: '2026-07-11T13:00:00Z',
    updatedAt: '2026-07-11T13:00:00Z'
  }
];

// 6.8 MaintenanceRequest
export const initialMaintenanceRequests = [
  {
    id: 'm1',
    assetId: 'a6', // Ford Transit Cargo Van
    reportedById: 'u3', // Diana Prince
    approvedById: 'u1', // Alice Smith
    assignedToId: 'u6', // James Carter
    title: 'Suspension Noise & Brake Service',
    description: 'Technician noted squeaking sounds from left-front suspension and requested 50,000 mile brake inspection.',
    priority: MaintenancePriority.HIGH,
    status: MaintenanceStatus.ASSIGNED,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300',
    afterPhotoUrl: null,
    resolutionNotes: null,
    reportedAt: '2026-07-11T14:30:00Z',
    completedAt: null,
    createdAt: '2026-07-11T14:30:00Z',
    updatedAt: '2026-07-11T14:30:00Z',
    comments: [
      { id: 'c1', user: 'James Carter', text: 'Parts ordered, arriving tomorrow morning.', timestamp: '2026-07-11 14:30' }
    ] // keep comments embedded for simplicity and UI fidelity
  },
  {
    id: 'm2',
    assetId: 'a1', // MacBook Pro
    reportedById: 'u1',
    approvedById: null,
    assignedToId: null,
    title: 'Keyboard Replacement',
    description: 'Spacebar and Shift key are sticking occasionally.',
    priority: MaintenancePriority.LOW,
    status: MaintenanceStatus.PENDING,
    beforePhotoUrl: null,
    afterPhotoUrl: null,
    resolutionNotes: null,
    reportedAt: '2026-07-12T09:15:00Z',
    completedAt: null,
    createdAt: '2026-07-12T09:15:00Z',
    updatedAt: '2026-07-12T09:15:00Z',
    comments: []
  },
  {
    id: 'm3',
    assetId: 'a5', // Supermicro Server Rack
    reportedById: 'u5',
    approvedById: 'u1',
    assignedToId: 'u6',
    title: 'Fan Module Fault',
    description: 'Sub-fan chamber 2 alert triggered high heat. Needs diagnostic.',
    priority: MaintenancePriority.MEDIUM,
    status: MaintenanceStatus.APPROVED,
    beforePhotoUrl: null,
    afterPhotoUrl: null,
    resolutionNotes: null,
    reportedAt: '2026-07-11T08:15:00Z',
    completedAt: null,
    createdAt: '2026-07-11T08:15:00Z',
    updatedAt: '2026-07-11T08:15:00Z',
    comments: [
      { id: 'c2', user: 'System Alert', text: 'Sensors reported fan rpm dropped below 1500.', timestamp: '2026-07-11 08:15' }
    ]
  }
];

// 6.9 AuditCycle
export const initialAuditCycles = [
  {
    id: 'aud1',
    title: 'Q3 Global Assets Validation Cycle',
    description: 'Verification of all high-value corporate nodes across divisions.',
    departmentId: null,
    locationCode: 'HQ',
    createdById: 'u1',
    startDate: '2026-07-01',
    endDate: '2026-07-25',
    status: AuditStatus.ACTIVE,
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  }
];

// 6.10 AuditAssignment
export const initialAuditAssignments = [
  {
    id: 'asgn1',
    auditCycleId: 'aud1',
    userId: 'u1', // Alice Smith assigned
    assignedAt: '2026-07-01T09:00:00Z'
  },
  {
    id: 'asgn2',
    auditCycleId: 'aud1',
    userId: 'u2', // Marcus Vance assigned
    assignedAt: '2026-07-01T09:00:00Z'
  }
];

// 6.11 AuditItem
export const initialAuditItems = [
  {
    id: 'chk1',
    auditCycleId: 'aud1',
    assetId: 'a1', // MacBook Pro
    verifiedById: 'u1',
    status: AuditItemStatus.VERIFIED,
    remarks: 'Matched serial number. Device clean.',
    verifiedAt: '2026-07-10T10:00:00Z',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z'
  },
  {
    id: 'chk2',
    auditCycleId: 'aud1',
    assetId: 'a2', // Dell XPS
    verifiedById: null,
    status: AuditItemStatus.PENDING,
    remarks: null,
    verifiedAt: null,
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'chk3',
    auditCycleId: 'aud1',
    assetId: 'a3', // iPad Pro
    verifiedById: 'u2',
    status: AuditItemStatus.VERIFIED,
    remarks: 'Located in Storage Locker B instead of HQ - Floor 2.',
    verifiedAt: '2026-07-11T14:00:00Z',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-11T14:00:00Z'
  },
  {
    id: 'chk4',
    auditCycleId: 'aud1',
    assetId: 'a4', // Sony FX3 Cinema
    verifiedById: null,
    status: AuditItemStatus.PENDING,
    remarks: null,
    verifiedAt: null,
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'chk5',
    auditCycleId: 'aud1',
    assetId: 'a6', // Ford Cargo Van
    verifiedById: 'u1',
    status: AuditItemStatus.DAMAGED,
    remarks: 'Odometer mismatch by 2,400 miles from log registry. Shocks squeaking.',
    verifiedAt: '2026-07-11T16:00:00Z',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-11T16:00:00Z'
  }
];

// 6.12 Notification
export const initialNotifications = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Maintenance Pending Approval',
    message: 'A low priority keyboard replacement for Alice Smith has been raised.',
    type: NotificationType.MAINTENANCE_APPROVED,
    relatedEntityType: EntityType.MAINTENANCE,
    relatedEntityId: 'm2',
    isRead: false,
    createdAt: '2026-07-12T09:15:00Z',
    updatedAt: '2026-07-12T09:15:00Z'
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'New Transfer Request',
    message: 'Marcus Vance requested an asset transfer for iPad Pro.',
    type: NotificationType.TRANSFER_APPROVED,
    relatedEntityType: EntityType.TRANSFER,
    relatedEntityId: 't1',
    isRead: false,
    createdAt: '2026-07-12T08:35:00Z',
    updatedAt: '2026-07-12T08:35:00Z'
  },
  {
    id: 'n3',
    userId: 'u1',
    title: 'Audit Cycle Nearing Deadline',
    message: 'Q3 Global Assets Validation Cycle is only 55% verified. Due in 13 days.',
    type: NotificationType.AUDIT_ASSIGNED,
    relatedEntityType: EntityType.AUDIT,
    relatedEntityId: 'aud1',
    isRead: false,
    createdAt: '2026-07-12T07:10:00Z',
    updatedAt: '2026-07-12T07:10:00Z'
  }
];

// 6.13 ActivityLog
export const initialActivityLogs = [
  {
    id: 'l1',
    userId: 'u6', // James Carter
    action: ActivityAction.UPDATE,
    entityType: EntityType.ASSET,
    entityId: 'a6',
    description: 'Changed "Ford Transit Cargo Van" (a6) status from "Active" to "In Maintenance".',
    createdAt: '2026-07-12T09:12:44Z'
  },
  {
    id: 'l2',
    userId: 'u2', // Marcus Vance
    action: ActivityAction.TRANSFER,
    entityType: EntityType.TRANSFER,
    entityId: 't1',
    description: 'Requested transfer of iPad Pro (a3) from Product & Design to Marketing.',
    createdAt: '2026-07-12T08:34:10Z'
  },
  {
    id: 'l3',
    userId: 'u6', // James Carter
    action: ActivityAction.RESOLVE,
    entityType: EntityType.MAINTENANCE,
    entityId: 'm1',
    description: 'Completed diagnostic on High-Speed Testing Rig B.',
    createdAt: '2026-07-11T16:50:00Z'
  },
  {
    id: 'l4',
    userId: 'u1', // Alice Smith
    action: ActivityAction.CREATE,
    entityType: EntityType.ASSET,
    entityId: 'a1',
    description: 'Registered "MacBook Pro 16\" M3 Max" (a1) under Computing with value $4,200.',
    createdAt: '2026-07-11T11:15:30Z'
  },
  {
    id: 'l5',
    userId: 'u1', // Alice Smith
    action: ActivityAction.BOOK,
    entityType: EntityType.BOOKING,
    entityId: 'b1',
    description: 'Booked Conference Room Alpha for 2026-07-13.',
    createdAt: '2026-07-10T14:00:22Z'
  }
];
