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
