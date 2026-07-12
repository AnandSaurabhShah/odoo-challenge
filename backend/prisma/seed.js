import prisma from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();

  await prisma.auditItem.deleteMany();
  await prisma.auditAssignment.deleteMany();
  await prisma.auditCycle.deleteMany();

  await prisma.maintenanceRequest.deleteMany();
  await prisma.resourceBooking.deleteMany();
  await prisma.transferRequest.deleteMany();
  await prisma.assetAllocation.deleteMany();

  await prisma.asset.deleteMany();
  await prisma.assetCategory.deleteMany();

  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log("✅ Database cleared");
}


async function seedDepartments() {
  console.log("📂 Seeding Departments...");

  // Clear existing data


  // Insert fresh data
  await prisma.department.createMany({
    data: [
      {
        name: "Administration",
        code: "ADMIN",
        description: "Administrative Department",
      },
      {
        name: "Information Technology",
        code: "IT",
        description: "IT Department",
      },
      {
        name: "Human Resources",
        code: "HR",
        description: "Human Resources Department",
      },
      {
        name: "Finance",
        code: "FIN",
        description: "Finance Department",
      },
      {
        name: "Engineering",
        code: "ENG",
        description: "Engineering Department",
      },
      {
        name: "Sales",
        code: "SALES",
        description: "Sales Department",
      },
    ],
    
  });

  console.log("✅ Departments Seeded");
}


async function seedUsers() {
  console.log("👤 Seeding Users...");

  

  const hashedPassword = await bcrypt.hash("password123", 10);

  const departments = await prisma.department.findMany();

  const adminDept = departments.find((d) => d.code === "ADMIN");
  const itDept = departments.find((d) => d.code === "IT");
  const hrDept = departments.find((d) => d.code === "HR");
  const financeDept = departments.find((d) => d.code === "FIN");
  const engineeringDept = departments.find((d) => d.code === "ENG");
  const salesDept = departments.find((d) => d.code === "SALES");

  await prisma.user.createMany({
    data: [
      {
        employeeId: "EMP001",
        fullName: "System Administrator",
        email: "admin@assetflow.com",
        password: hashedPassword,
        role: "ADMIN",
        departmentId: adminDept.id,
      },
      {
        employeeId: "EMP002",
        fullName: "Asset Manager",
        email: "manager@assetflow.com",
        password: hashedPassword,
        role: "ASSET_MANAGER",
        departmentId: adminDept.id,
      },
      {
        employeeId: "EMP003",
        fullName: "Rahul Sharma",
        email: "rahul@assetflow.com",
        designation: "IT Head",
        password: hashedPassword,
        role: "DEPARTMENT_HEAD",
        departmentId: itDept.id,
      },
      {
        employeeId: "EMP004",
        fullName: "Priya Mehta",
        email: "priya@assetflow.com",
        designation: "Finance Head",
        password: hashedPassword,
        role: "DEPARTMENT_HEAD",
        departmentId: financeDept.id,
      },
      {
        employeeId: "EMP005",
        fullName: "Aman Verma",
        email: "aman@assetflow.com",
        password: hashedPassword,
        role: "EMPLOYEE",
        departmentId: engineeringDept.id,
      },
      {
        employeeId: "EMP006",
        fullName: "Neha Kapoor",
        email: "neha@assetflow.com",
        password: hashedPassword,
        role: "EMPLOYEE",
        departmentId: hrDept.id,
      },
      {
        employeeId: "EMP007",
        fullName: "Rohan Patel",
        email: "rohan@assetflow.com",
        password: hashedPassword,
        role: "EMPLOYEE",
        departmentId: salesDept.id,
      },
    ],
  });

  console.log("✅ Users Seeded");
}

async function seedAssetCategories() {
  console.log("📦 Seeding Asset Categories...");

  

  await prisma.assetCategory.createMany({
    data: [
      {
        name: "Laptop",
        code: "LAPTOP",
        description: "Company laptops",
        isBookable: false,
        customFields: {
          warranty: true,
          serialNumber: true,
          manufacturer: true,
        },
      },
      {
        name: "Monitor",
        code: "MONITOR",
        description: "External monitors",
        isBookable: false,
        customFields: {
          serialNumber: true,
          size: true,
        },
      },
      {
        name: "Projector",
        code: "PROJECTOR",
        description: "Meeting room projectors",
        isBookable: false,
        customFields: {
          lumen: true,
        },
      },
      {
        name: "Printer",
        code: "PRINTER",
        description: "Office printers",
        isBookable: false,
        customFields: {
          networkEnabled: true,
        },
      },
      {
        name: "Conference Room",
        code: "CONF_ROOM",
        description: "Bookable conference rooms",
        isBookable: true,
        customFields: {
          seatingCapacity: true,
          floor: true,
        },
      },
      {
        name: "Vehicle",
        code: "VEHICLE",
        description: "Company vehicles",
        isBookable: true,
        customFields: {
          registrationNumber: true,
        },
      },
    ],
  });

  console.log("✅ Asset Categories Seeded");
}

async function seedAssets() {
  console.log("💻 Seeding Assets...");

  const categories = await prisma.assetCategory.findMany();
  const departments = await prisma.department.findMany();

  const laptop = categories.find(c => c.code === "LAPTOP");
  const monitor = categories.find(c => c.code === "MONITOR");
  const projector = categories.find(c => c.code === "PROJECTOR");
  const printer = categories.find(c => c.code === "PRINTER");
  const room = categories.find(c => c.code === "CONF_ROOM");
  const vehicle = categories.find(c => c.code === "VEHICLE");

  const it = departments.find(d => d.code === "IT");
  const admin = departments.find(d => d.code === "ADMIN");

  const assets = [];

  // Laptops
  for (let i = 1; i <= 10; i++) {
    assets.push({
      assetTag: `LAP-${String(i).padStart(3, "0")}`,
      name: `Dell Latitude ${5400 + i}`,
      serialNumber: `DLLLAP${1000 + i}`,
      categoryId: laptop.id,
      ownerDepartmentId: it.id,
      locationCode: "IT-01",
      vendor: "Dell",
      acquisitionCost: 75000,
      isBookable: false,
    });
  }

  // Monitors
  for (let i = 1; i <= 8; i++) {
    assets.push({
      assetTag: `MON-${String(i).padStart(3, "0")}`,
      name: `Dell 27-inch Monitor ${i}`,
      serialNumber: `MON${1000 + i}`,
      categoryId: monitor.id,
      ownerDepartmentId: it.id,
      locationCode: "IT-01",
      vendor: "Dell",
      acquisitionCost: 18000,
      isBookable: false,
    });
  }

  // Projectors
  for (let i = 1; i <= 2; i++) {
    assets.push({
      assetTag: `PRO-${String(i).padStart(3, "0")}`,
      name: `Epson Projector ${i}`,
      categoryId: projector.id,
      ownerDepartmentId: admin.id,
      locationCode: "MEETING",
      vendor: "Epson",
      acquisitionCost: 45000,
      isBookable: false,
    });
  }

  // Printers
  for (let i = 1; i <= 2; i++) {
    assets.push({
      assetTag: `PRN-${String(i).padStart(3, "0")}`,
      name: `HP LaserJet ${i}`,
      categoryId: printer.id,
      ownerDepartmentId: admin.id,
      locationCode: "ADMIN",
      vendor: "HP",
      acquisitionCost: 25000,
      isBookable: false,
    });
  }

  // Conference Rooms
  ["Alpha", "Beta", "Gamma", "Delta", "Omega"].forEach((name, index) => {
    assets.push({
      assetTag: `ROOM-${index + 1}`,
      name: `Conference Room ${name}`,
      categoryId: room.id,
      ownerDepartmentId: admin.id,
      locationCode: `Floor-${index + 1}`,
      isBookable: true,
    });
  });

  // Vehicles
  for (let i = 1; i <= 3; i++) {
    assets.push({
      assetTag: `VEH-${String(i).padStart(3, "0")}`,
      name: `Company Car ${i}`,
      categoryId: vehicle.id,
      ownerDepartmentId: admin.id,
      locationCode: "Parking",
      vendor: "Toyota",
      acquisitionCost: 850000,
      isBookable: true,
    });
  }

  await prisma.asset.createMany({
    data: assets,
  });

  console.log(`✅ ${assets.length} Assets Seeded`);
}

async function seedAllocations() {
  console.log("📋 Seeding Asset Allocations...");

  const users = await prisma.user.findMany();
  const assets = await prisma.asset.findMany({
    where: {
      isBookable: false,
    },
  });

  const employees = users.filter((u) => u.role === "EMPLOYEE");

  const allocations = [];

  for (let i = 0; i < 5; i++) {
    allocations.push({
      assetId: assets[i].id,
      userId: employees[i % employees.length].id,
      allocatedById: users[1].id, // Asset Manager
      allocatedAt: new Date(),
    });
  }

  await prisma.assetAllocation.createMany({
    data: allocations,
  });

  console.log("✅ Asset Allocations Seeded");
}

async function seedBookings() {
  console.log("📅 Seeding Bookings...");

  const users = await prisma.user.findMany();

  const rooms = await prisma.asset.findMany({
    where: {
      isBookable: true,
    },
  });

  await prisma.resourceBooking.createMany({
    data: [
      {
        assetId: rooms[0].id,
        bookedById: users[4].id,
        startTime: new Date(Date.now() + 3600000),
        endTime: new Date(Date.now() + 7200000),
        purpose: "Sprint Planning",
      },
      {
        assetId: rooms[1].id,
        bookedById: users[5].id,
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 90000000),
        purpose: "Client Meeting",
      },
      {
        assetId: rooms[2].id,
        bookedById: users[6].id,
        startTime: new Date(Date.now() + 172800000),
        endTime: new Date(Date.now() + 176400000),
        purpose: "Design Review",
      },
    ],
  });

  console.log("✅ Bookings Seeded");
}

async function seedMaintenance() {
  console.log("🛠 Seeding Maintenance...");

  const users = await prisma.user.findMany();

  const assets = await prisma.asset.findMany({
    where: {
      isBookable: false,
    },
  });

  await prisma.maintenanceRequest.createMany({
    data: [
      {
        assetId: assets[8].id,
        reportedById: users[4].id,
        title: "Keyboard not working",
        description: "Laptop keyboard has multiple faulty keys.",
        priority: "HIGH",
      },
      {
        assetId: assets[10].id,
        reportedById: users[5].id,
        title: "Display Flickering",
        description: "Monitor screen flickers continuously.",
        priority: "MEDIUM",
      },
    ],
  });

  console.log("✅ Maintenance Requests Seeded");
}



async function main() {
    await clearDatabase();

  await seedDepartments();
  await seedUsers();
  await seedAssetCategories();
  await seedAssets()

  await seedAllocations();
  await seedBookings();
  await seedMaintenance();
}

main()
  .then(async () => {
    console.log("🌱 Database Seeded Successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });