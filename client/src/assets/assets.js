// src/assets/assets.js

/* ------------------------------------------------------------------
 * SHARED SAMPLE IMAGE
 * ------------------------------------------------------------------ */

export const sampleImage =
  "https://th.bing.com/th/id/R.c655f6ad4bf1a12f920298b6e087200b?rik=KNLe3mk2jiJUjA&riu=http%3a%2f%2fcontent.kens5.com%2fphoto%2f2017%2f10%2f22%2fvegetables_1508727313637_11456014_ver1.0.jpg&ehk=Fq8Eoa9aKzsUPDZ8DtBhyVemrHDc8oqvw4qs3PvJii8%3d&risl=&pid=ImgRaw&r=0";

/* ------------------------------------------------------------------
 * PRODUCT MASTER (USED BY QUOTATION + SALES ORDER)
 * ------------------------------------------------------------------ */

export const productList = [
  {
    code: "OKRA-4KG",
    name: "OKRA | 4Kg",
    unit: "Nos",
    buyingRate: 24.0,
    rate: 5.0,
    image: sampleImage,
    sampleImage,
  },
  {
    code: "CURRY-2KG-IN",
    name: "Curry leaves |2Kg per box - INDIA",
    unit: "Nos",
    buyingRate: 2.0,
    rate: 1.0,
    image: sampleImage,
    sampleImage,
  },
  {
    code: "IND-3374-04",
    name: "Amaranth leaves - green | 4 kg",
    unit: "Box",
    buyingRate: 11.0,
    rate: 29.0,
    image: sampleImage,
    sampleImage,
  },
  {
    code: "CURRY-2KG-NL",
    name: "Curry leaves - 2 kg per box - NETHERLAND",
    unit: "Nos",
    buyingRate: 2.0,
    rate: 2.0,
    image: sampleImage,
    sampleImage,
  },
  {
    code: "ESP-2176-05",
    name: "Lauki long | 5kg | Spain",
    unit: "Box",
    buyingRate: 18.0,
    rate: 18.0,
    image: sampleImage,
    sampleImage,
  },
  {
    code: "ESP-7819-01",
    name: "Amaranth leaves - green | 2 kg",
    unit: "Box",
    buyingRate: 18.0,
    rate: 18.0,
    image: sampleImage,
    sampleImage,
  },
  {
    code: "DO-3038-10",
    name: "Lemon grass | 10kg | Dominican",
    unit: "Box",
    buyingRate: 18.0,
    rate: 19.0,
    image: sampleImage,
    sampleImage,
  },
];

/* ------------------------------------------------------------------
 * CUSTOMERS & ADDRESSES (USED BY QUOTATIONS + SALES ORDERS)
 * ------------------------------------------------------------------ */

export const customersDummy = [
  "Customer A",
  "Customer B",
  "ABC private LTD",
  "Abhishek Kumar",
];

export const customerAddressesDB = {
  "Customer A": {
    billing: ["Customer Address A1", "Customer Address A2"],
    shipping: ["Shipping Address A1"],
    company: ["Company Address A1"],
    contactPersons: ["Person A1", "Person A2"],
  },
  "Customer B": {
    billing: ["Customer Address B1"],
    shipping: ["Shipping Address B1", "Shipping Address B2"],
    company: ["Company Address B1"],
    contactPersons: ["Person B1"],
  },
  "ABC private LTD": {
    billing: ["ABC Pvt LTD, Main Street, Colombo"],
    shipping: ["ABC Warehouse, Colombo"],
    company: ["ABC Pvt LTD HQ, Colombo"],
    contactPersons: ["Procurement Team"],
  },
  "Abhishek Kumar": {
    billing: ["Abhishek Kumar, Bengaluru, India"],
    shipping: ["Abhishek Kumar, Bengaluru, India"],
    company: ["Freelance Customer"],
    contactPersons: ["Abhishek Kumar"],
  },
};

/* ------------------------------------------------------------------
 * PRICING META (SHARED BETWEEN QUOTATIONS + SALES ORDERS)
 * ------------------------------------------------------------------ */

export const currencyListDummy = ["EUR", "USD", "LKR", "GBP"];

export const priceListDummy = ["Retail", "Wholesale", "Online Store"];

export const taxCategoryDummy = ["Netherlands 9%", "Germany 19%", "Sri Lanka VAT"];

export const shippingRuleDummy = [
  "Standard Shipping",
  "Express Shipping",
  "Free Shipping",
];

export const incotermDummy = ["FOB", "CIF", "EXW"];

export const taxTemplateDummy = ["Default EU VAT", "No Tax", "Custom Template A"];

/* ------------------------------------------------------------------
 * PICK LIST (WAREHOUSE / PICKING)
 * ------------------------------------------------------------------ */

const pickListProductNames = ["Curry leaves", "Green", "Onion", "Potato", "Tomato"];
const pickListCountries = ["India", "Netherlands", "Spain", "Mexico", "USA"];

const generateRandomPickListProducts = () => {
  const numberOfProducts = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: numberOfProducts }, (_, i) => {
    const name =
      pickListProductNames[Math.floor(Math.random() * pickListProductNames.length)];
    return {
      id: i + 1,
      name,
      country: pickListCountries[Math.floor(Math.random() * pickListCountries.length)],
      image: sampleImage,
      requiredQuantity: Math.floor(Math.random() * 80) + 1,
      pickedQuantity: 0,
      additionalQuantity: 0,
      weightPerUnit: (Math.random() * 3).toFixed(1),
    };
  });
};

export const pickListData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  customerName: `Customer ${i + 1}`,
  salesOrderId: `SO-${1000 + i}`,
  pickListId: `PL-${2000 + i}`,
  totalQuantity: Math.floor(Math.random() * 50) + 1,
  totalNetWeight: (Math.random() * 100).toFixed(2) + " kg",
  status: ["Pending", "In Progress", "Completed"][Math.floor(Math.random() * 3)],
  pickingDate: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toLocaleDateString(),
  products: generateRandomPickListProducts(),
}));

/* ------------------------------------------------------------------
 * SALES QUOTATION LIST (LIST PAGE)
 * ------------------------------------------------------------------ */

export const quotationData = Array.from({ length: 100 }, (_, index) => {
  const statuses = [
    "Open",
    "Draft",
    "Ordered",
    "Cancelled",
    "Partially Ordered",
    "Lost",
  ];
  const types = ["Sales", "Maintenance", "Shopping Cart"];

  const randomDate = (daysFromToday) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date.toISOString().split("T")[0];
  };

  const createdOffset = -Math.floor(Math.random() * 30);
  const expiryOffset = Math.floor(Math.random() * 30) + 1;
  const deliveryOffset = Math.floor(Math.random() * expiryOffset) + 1;

  return {
    id: index + 1,
    customer: index % 2 === 0 ? "ABC private LTD" : "Abhishek Kumar",
    quotationNo: `SAL-QTN-2025-00${index + 100}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdDate: randomDate(createdOffset),
    expiryDate: randomDate(expiryOffset),
    deliveryDate: randomDate(deliveryOffset),
    grandTotal: parseFloat((Math.random() * 1000000 + 100).toFixed(1)),
    title: `Quotation Title ${index + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
  };
});

/* ------------------------------------------------------------------
 * COUNTING / STOCK TAKING DATA
 * ------------------------------------------------------------------ */

const countingProductNames = [
  "Curry Leaves",
  "Papaya Leaves",
  "Mini White Eggplant",
  "Cauliflower Mushroom",
  "Jackfruit",
  "Red Chilli",
  "Tomato",
  "Onion",
  "Bittermelon",
  "Dasheri Mango",
];

const countingOrigins = ["India", "Netherlands", "Mexico", "Spain", "Brazil", "Thailand"];
const countingWarehouses = ["Work In Progress - FC"];

export const countingData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `${countingProductNames[i % countingProductNames.length]} | ${
    Math.floor(Math.random() * 5 + 1)
  }kg`,
  image: sampleImage,
  origin: countingOrigins[i % countingOrigins.length],
  warehouse: countingWarehouses[0],
  stock: parseFloat((Math.random() * 500).toFixed(1)),
  physicalStock: 0,
}));

/* ------------------------------------------------------------------
 * PURCHASE ORDERS
 * ------------------------------------------------------------------ */

export const purchaseOrders = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    supplierName: [
      "Manoj",
      "Summit Traders Ltd.",
      "Global Corp",
      "SupplyZone",
    ][id % 4],
    purchaseOrderId: `PUR-ORD-2025-${String(50000 + id).padStart(5, "0")}`,
    receiptId: `MAT-PRE-2025-${String(12000 + id).padStart(5, "0")}`,
    quantity: (Math.random() * 100 + 1).toFixed(1),
    netWeight: (Math.random() * 12000).toFixed(1),
    status: "Draft",
    receivingDate: "2025-08-22",
  };
});

export const purchaseOrderItems = [
  {
    id: 1,
    name: "OKRA",
    origin: "Netherlands",
    quality: "Good",
    weight: 4,
    pickedQty: 0,
    maxQty: 3,
    additionalQty: 0,
  },
  {
    id: 2,
    name: "TOMATO",
    origin: "India",
    quality: "Average",
    weight: 5,
    pickedQty: 0,
    maxQty: 2,
    additionalQty: 0,
  },
];

/* ------------------------------------------------------------------
 * USERS
 * ------------------------------------------------------------------ */

export const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  role: ["admin", "sales", "warehouse", "backoffice", "monitor", "user", "reader"][
    i % 7
  ],
  loginCount: Math.floor(Math.random() * 1000),
  lastLoginTime: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
  lastLoginIP: Math.random() > 0.1 ? `192.168.1.${i + 1}` : "N/A",
}));

/* ------------------------------------------------------------------
 * EVENING OVERVIEW / STOCK TAKING OVERVIEWS
 * ------------------------------------------------------------------ */

export const overviewEveningData = Array.from({ length: 100 }, (_, i) => ({
  id: `Stock-Taking - 2025-04-15-${i + 1}`,
  date: "2025-04-15",
  creatorName: `Manoj-${i + 1}`,
  totalItems: Math.floor(Math.random() * 5) + 1,
  stocks: (Math.random() * 20).toFixed(1),
  warehouse: "Stores - FC",
}));

/* ------------------------------------------------------------------
 * STOCK DATA
 * ------------------------------------------------------------------ */

export const stockData = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  code: `CODE${1000 + i}`,
  stock: (Math.random() * 100).toFixed(1),
  physicalStock: (Math.random() * 100).toFixed(1),
  image: sampleImage,
}));

/* ------------------------------------------------------------------
 * PICK LIST ARCHIVE
 * ------------------------------------------------------------------ */

export const pickListArchiveData = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  salesOrderId: `SO202512${800 + index}`,
  deliveryNoteId: `PL202512${950 + index}`,
  customerName: [
    "Ruba import",
    "Badris Tropicals",
    "Karis Bazaar B.V.",
    "Asian Food Market",
    "Pure Fruit Sverige AB",
    "Brima fruit b.v.",
    "Taste of Asia Market B.V",
    "Euro Asia Fruit Dutch B.V.",
    "Raja Cash and Carry",
    "Panjab Supermarket",
    "Humphrey Exotische Groenten en Fruit",
  ][index % 11],
  postingDate: "2025-08-28",
  status: "Submitted",
}));

/* ------------------------------------------------------------------
 * SALES ORDER DETAIL MOCK (USED BY SALES ORDER DETAIL PAGE)
 * ------------------------------------------------------------------ */

export const salesOrderDetailsMock = [
  {
    orderId: "SO-0001",
    series: "SAL-ORD-2025",
    orderDate: "2025-11-01",
    deliveryDate: "2025-11-05",
    status: "Draft",
    orderType: "Sales",
    customer: "Sukan Food BV",
    currency: "EUR",
    priceList: "Retail",
    taxCategory: "Netherlands 9%",
    shippingRule: "Standard Shipping",
    incoterm: "FOB Rotterdam",
    addresses: {
      billing:
        "Sukan Food BV\nMain Street 1\n1234 AB Amsterdam\nNetherlands",
      shipping:
        "Sukan Food BV – DC #2\nWarehouse Lane 3\n1234 AB Amsterdam\nNetherlands",
      company:
        "Your Company BV\nCompany Street 10\n5678 CD Rotterdam\nNetherlands",
      contactPerson: "John Doe\n+31 6 1234 5678\nsales@sukanfood.example",
    },
    // Items: UI will seed default items from productList on first load if empty
    items: [],
    taxes: [
      {
        id: 1,
        type: "On Net Total",
        accountHead: "VAT 9%",
        rate: 9,
        amount: 0,
      },
      {
        id: 2,
        type: "Actual",
        accountHead: "Shipping Charge",
        rate: null,
        amount: 15.0,
      },
    ],
    taxTemplate: "NL VAT 9% + Shipping",
  },
];

/* ------------------------------------------------------------------
 * SALES ORDERS LIST (LIST PAGE FOR SALES ORDER)
 * ------------------------------------------------------------------ */

export const salesOrderData = Array.from({ length: 100 }).map((_, i) => {
  const statuses = ["Draft", "To Deliver and Bill", "Delivered", "Cancelled"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomAmount = (Math.random() * 200000 + 10).toFixed(2);
  const date = new Date(2025, 7, 28); // 2025-08-28

  // Use SO-0001, SO-0002 ... so it matches SalesOrderDetail route param style
  const orderId = `SO-${String(1 + i).padStart(4, "0")}`;
  const detailMatch = salesOrderDetailsMock.find((o) => o.orderId === orderId);

  return {
    id: i + 1,
    orderId,
    customer: detailMatch?.customer || `Customer ${i + 1}`,
    status: detailMatch?.status || randomStatus,
    orderDate: detailMatch?.orderDate || date.toISOString().split("T")[0],
    deliveryDate: detailMatch?.deliveryDate || detailMatch?.orderDate || null,
    grandTotal: parseFloat(randomAmount),
  };
});

/* ------------------------------------------------------------------
 * PURCHASE QUOTATIONS (LIST + DETAIL)
 * ------------------------------------------------------------------ */

const pqVegetableNames = [
  "Okra",
  "Tomato",
  "Onion",
  "Green Chili",
  "Cabbage",
  "Cauliflower",
  "Brinjal",
  "Bottle Gourd",
  "Bitter Gourd",
  "Spinach",
  "Coriander",
  "Mint",
];

const pqStatuses = ["Waiting Payment", "Paid", "Processing"];
const pqOrderStatuses = ["New", "Delivered", "Packed", "Pending"];

const generatePQProducts = (index) => {
  return Array.from({ length: 3 }, (_, i) => {
    const vegetable = pqVegetableNames[(index + i) % pqVegetableNames.length];
    return {
      name: `${vegetable} - fresh organic`,
      sku: `SKU-${vegetable.substring(0, 3).toUpperCase()}-${index + i + 1}`,
      quantity: 1,
      price: (Math.random() * 100 + 10).toFixed(2),
      image: sampleImage,
    };
  });
};

export const purchaseQuotation = Array.from({ length: 100 }, (_, i) => {
  const now = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
  const products = generatePQProducts(i);
  const price = products.reduce((sum, p) => sum + parseFloat(p.price), 0);

  return {
    id: 2471 + i,
    orderStatus: pqOrderStatuses[i % pqOrderStatuses.length],
    status: pqStatuses[i % pqStatuses.length],
    orderDate: now.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    orderTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    shippingNo: "6183301410" + i,
    products,
    price: +price.toFixed(2),
    shippingCost: 0.0,
    salesTax: 0.0,

    orderHistory: [
      {
        title: "Order Created",
        datetime: "21 Sep, 2022 4:49 PM",
        statusUpdates: [
          {
            status: "New",
            datetime: "13 Sep, 2022 at 8:58",
            labelClass: "bg-green-500",
          },
          {
            status: "Quick Buy",
            datetime: "13 Sep, 2022 at 8:58",
            labelClass: "bg-purple-500",
          },
        ],
      },
    ],
    customerInfo: {
      name: "My Name",
      email: "you@example.com",
      ip: "94.155.40.227",
      ordersCount: 3,
    },
    deliveryDetails: {
      speedy: "Delivery to office",
      office: "RUSE - THE Wrestlers",
      address: "Manipay, Jaffna, Srilanka",
      trackingNo: "6183301410" + i,
    },
    shippingInfo: {
      address: "Manipay, Jaffna, Srilanka",
      phone: "0876537622",
      vatNumber: "-",
    },
    paymentInfo: {
      method: "Cash on delivery",
      transactionNo: "0876537622",
    },
  };
});


























//==============================================Product datas updated dummy data-----------------//
// src/assets/stockData.js

// src/assets/assets.js (or wherever your dummy data lives)

const pad = (n, w = 4) => String(n).padStart(w, "0");
const randBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randChoice = (arr) => arr[randBetween(0, arr.length - 1)];
const randBool = (p = 0.5) => Math.random() < p;

const randomISOInLastDays = (days = 90) => {
  const now = Date.now();
  const past =
    now -
    randBetween(0, days) * 24 * 60 * 60 * 1000 -
    randBetween(0, 86400000);
  return new Date(past).toISOString();
};

const randomFutureISOInDays = (minDays = 30, maxDays = 365) => {
  const now = Date.now();
  const future =
    now +
    randBetween(minDays, maxDays) * 24 * 60 * 60 * 1000 +
    randBetween(0, 86400000);
  return new Date(future).toISOString();
};

const STOCK_IMAGE =
  "https://media.istockphoto.com/id/1203599923/photo/food-background-with-assortment-of-fresh-organic-vegetables.jpg?s=612x612&w=0&k=20&c=DZy1JMfUBkllwiq1Fm_LXtxA4DMDnExuF40jD8u9Z0Q=";

/* -------------------- DROPDOWN MASTER LISTS -------------------- */

export const stockStatuses = ["In Stock", "Low Stock", "Out of Stock", "Discontinued"];

export const itemGroups = ["Vegetables", "Fruits", "Leafy Greens", "Spices", "Root Crops"];
export const productTypes = ["Raw", "Processed", "Frozen", "Packaged", "Fresh"];

export const defaultUnits = ["Nos", "Kg", "g", "Liter", "ml", "Box", "Pack", "Crate", "Bag", "Bundle"];

export const materialRequestTypes = ["Purchase", "Pick", "Transfer", "Return"];
export const validationMethods = ["FIFO", "FEFO", "Batch", "Serial", "None"];
export const weightUoms = ["g", "Kg", "lb", "oz"];

export const updatedBys = ["Admin", "Backoffice", "Accounts", "Sales", "Warehouse"];

/* -------------------- ACTIVITY / HISTORY -------------------- */

const makeAuditEntry = ({ type, by, at, field, from, to, note }) => ({
  id: `LOG-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
  type, // created | updated | visibility | active | inventory | webshop | pricing
  by,
  at,
  field: field || null,
  from: from ?? null,
  to: to ?? null,
  note: note || "",
});

const makeInitialHistory = ({ createdAt, createdBy }) => {
  const log = [
    makeAuditEntry({
      type: "created",
      by: createdBy,
      at: createdAt,
      note: "Created item",
    }),
  ];

  // Add 1–4 random updates in history
  const n = randBetween(1, 4);
  for (let i = 0; i < n; i++) {
    const at = randomISOInLastDays(60);
    const by = randChoice(updatedBys);

    const types = ["updated", "pricing", "inventory", "webshop"];
    const type = randChoice(types);

    const fieldsByType = {
      updated: ["name", "description", "origin"],
      pricing: ["valuationRate", "standardSellingRate", "buyingPrice"],
      inventory: ["openingStock", "shelfLifeDays", "warrantyDays", "endOfLifeDate"],
      webshop: ["isForWebshop", "webItemTitle", "webSmallDescription"],
    };

    const field = randChoice(fieldsByType[type]);
    log.push(
      makeAuditEntry({
        type,
        by,
        at,
        field,
        note: `Changed ${field}`,
      })
    );
  }

  // Sort by time
  log.sort((a, b) => new Date(a.at) - new Date(b.at));
  const last = log[log.length - 1];

  return {
    lastActivity: {
      type: last.type,
      at: last.at,
      by: last.by,
      summary:
        last.type === "created"
          ? "Created item"
          : last.type === "pricing"
          ? "Pricing updated"
          : last.type === "inventory"
          ? "Inventory updated"
          : last.type === "webshop"
          ? "Webshop updated"
          : "Item updated",
    },
    activityLog: log,
  };
};

/* -------------------- DATA GENERATION -------------------- */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const round2 = (n) => Math.round(n * 100) / 100;

const makeRates = () => {
  // valuationRate <= buyingPrice <= sellingRate (usually)
  const valuationRate = round2(randBetween(80, 600) / 10); // 8.0 - 60.0
  const buyingPrice = round2(valuationRate + randBetween(0, 250) / 10); // 0 - 25 higher
  const standardSellingRate = round2(buyingPrice + randBetween(10, 500) / 10); // markup
  return { valuationRate, buyingPrice, standardSellingRate };
};

const deriveStatusFromStock = (stock) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 70) return "Low Stock";
  if (Math.random() < 0.06) return "Discontinued";
  return "In Stock";
};

export const stockItems = Array.from({ length: 120 }, (_, i) => {
  const names = [
    "Okra",
    "Curry Leaves",
    "Tomato",
    "Spinach",
    "Broccoli",
    "Cauliflower",
    "Cabbage",
    "Pumpkin",
    "Carrot",
    "Potato",
    "Beetroot",
    "Brinjal",
    "Leeks",
    "Beans",
    "Banana",
    "Mango",
    "Papaya",
    "Pineapple",
  ];

  const origins = ["Sri Lanka", "India", "Thailand", "Vietnam", "Malaysia"];
  const weights = ["1kg", "2kg", "3kg", "4kg", "5kg", "10kg"];
  const packTypes = ["Loose", "Pack", "Bag", "Crate"];
  const locations = ["Colombo", "Jaffna", "Manipay", "Vavuniya", "Vaddukoddai"];

  const name = randChoice(names);
  const origin = randChoice(origins);
  const weight = randChoice(weights);
  const pack = randChoice(packTypes);
  const loc = randChoice(locations);

  const itemGroup = (() => {
    if (["Banana", "Mango", "Papaya", "Pineapple"].includes(name)) return "Fruits";
    if (["Curry Leaves", "Spinach", "Leeks"].includes(name)) return "Leafy Greens";
    if (["Potato", "Beetroot", "Carrot"].includes(name)) return "Root Crops";
    if (["Okra", "Tomato", "Broccoli", "Cauliflower", "Cabbage", "Pumpkin", "Beans", "Brinjal"].includes(name))
      return "Vegetables";
    return randChoice(itemGroups);
  })();

  const productType = randChoice(productTypes);

  // base stock
  const openingStock = randBetween(0, 1500);
  const stock = clamp(
    openingStock + randBetween(-200, 600),
    0,
    2500
  );

  const status = deriveStatusFromStock(stock);

  const wpUnit = round2(Math.random() * 70 + 2.5); // € (wholesale per unit)
  const createdAt = randomISOInLastDays(180);
  const updatedAt = randomISOInLastDays(60);
  const updatedBy = randChoice(updatedBys);

  const desc = `${name} | ${weight} | ${origin} | ${pack} | ${loc}`;

  const { valuationRate, buyingPrice, standardSellingRate } = makeRates();

  const overDeliveryAllowancePct = round2(randBetween(0, 15) + randBetween(0, 99) / 100); // 0 - 15.99
  const overBillingAllowancePct = round2(randBetween(0, 10) + randBetween(0, 99) / 100); // 0 - 10.99

  const isMaintainStock = randBool(0.85);
  const isHasVariants = randBool(0.25);

  const shelfLifeDays = randBetween(3, 365);
  const warrantyDays = randBetween(0, 365);

  const endOfLifeDate = randBool(0.25) ? randomFutureISOInDays(30, 900) : ""; // optional
  const weightPerUnit = round2(randBetween(50, 5000) / 100); // 0.50 - 50.00
  const weightUom = randChoice(weightUoms);

  const defaultUnitOfMeasure = (() => {
    // Keep it consistent with group sometimes
    if (itemGroup === "Fruits" || itemGroup === "Vegetables") return randChoice(["Kg", "Box", "Crate", "Bag"]);
    if (itemGroup === "Leafy Greens") return randChoice(["Bundle", "Pack", "Kg"]);
    return randChoice(defaultUnits);
  })();

  const defaultMaterialRequestType = randChoice(materialRequestTypes);
  const validationMethod = randChoice(validationMethods);

  const isAllowAlternativeItem = randBool(0.35);
  const isAllowNegativeStock = randBool(0.2);

  const isForWebshop = randBool(0.55);
  const webItemTitle = isForWebshop ? `${name} - Fresh ${origin}` : "";
  const webSmallDescription = isForWebshop
    ? `${name} (${weight}) • ${origin} • ${pack}`
    : "";
  const webLongDescription = isForWebshop
    ? `${name} sourced from ${origin}. Packed as ${pack}. Stored/handled from ${loc}. Best used within ${shelfLifeDays} days.`
    : "";

  const history = makeInitialHistory({ createdAt, createdBy: updatedBy });

  return {
    /* -------- CORE -------- */
    id: `ITM-${pad(i + 1, 4)}`,
    name: `${name} (${origin})`,
    origin,
    image: STOCK_IMAGE,
    status,
    description: desc,

    /* -------- Dropdown-friendly fields -------- */
    itemGroup, // Fruits, Vegetables, Leafy Greens...
    productType, // Raw, Frozen, Packaged...
    defaultUnitOfMeasure, // Nos, Liter, Box...

    /* -------- Stock & Pricing -------- */
    openingStock,
    stock, // current stock
    valuationRate, // valuation rate
    standardSellingRate, // standard selling rate
    buyingPrice, // buying price
    wpUnit, // keep your existing one too (wholesale per unit)

    /* -------- Flags -------- */
    isAllowAlternativeItem,
    isMaintainStock,
    isHasVariants,
    isAllowNegativeStock, // (your "isAllowNavigateStock")

    /* -------- Allowances -------- */
    overDeliveryAllowancePct, // Percentage
    overBillingAllowancePct, // Percentage

    /* -------- Inventory details -------- */
    shelfLifeDays,
    warrantyDays,
    endOfLifeDate, // optional ISO string
    weightPerUnit,
    weightUom,
    defaultMaterialRequestType, // Purchase, Pick...
    validationMethod, // FIFO, FEFO...

    /* -------- Webshop -------- */
    isForWebshop,
    webItemTitle,
    webSmallDescription,
    webLongDescription,

    /* -------- Visibility & Activity -------- */
    isActive: randBool(0.88),
    visibility: { productVisible: randBool(0.9) },

    createdAt,
    updatedAt,
    updatedBy,

    // history fields (for your dashboard last activity + detail page timeline)
    ...history,
  };
});

//==============================================End of Product datas updated dummy data-----------------//










