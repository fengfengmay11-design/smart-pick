// 手机选购对比助手 — 机型静态数据集
// 数据来源：品牌官网、官方商城、公开产品说明书
// 价格参考：京东/拼多多 2026年7月参考到手价（256GB默认版本）
// 最后更新：2026-07-15

const PHONE_DATA = [
  // ==================== 苹果 Apple ====================
  {
    id: "iphone-16",
    brand: "苹果",
    model: "iPhone 16",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2016%20Black.jpg",
    launchDate: "2024-09",
    colors: ["黑色", "白色", "粉色", "深青色", "群青色"],
    popularity: 98,
    sales: 103,
    priceDrop: false,
    tags: ["轻薄", "旗舰性能", "AI"],
    officialUrl: "https://www.apple.com.cn/iphone-16/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 4799, pricePdd: 4459, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 7499, pricePdd: 6949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.1, resolution: "2556×1179", refreshRate: 60, material: "OLED", type: "直屏" },
    body: { height: 147.6, width: 71.6, thickness: 7.8, weight: 170, material: "航空级铝金属" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 2)",
      waterproof: "IP68"
    }
  },
  {
    id: "iphone-16-plus",
    brand: "苹果",
    model: "iPhone 16 Plus",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2016%20Plus%20Black.jpg",
    launchDate: "2024-09",
    colors: ["黑色", "白色", "粉色", "深青色", "群青色"],
    popularity: 85,
    sales: 95,
    priceDrop: false,
    tags: ["大屏", "长续航", "AI"],
    officialUrl: "https://www.apple.com.cn/iphone-16/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 5799, pricePdd: 5359, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 8499, pricePdd: 7899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2796×1290", refreshRate: 60, material: "OLED", type: "直屏" },
    body: { height: 160.9, width: 77.8, thickness: 7.8, weight: 199, material: "航空级铝金属" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 2)",
      waterproof: "IP68"
    }
  },
  {
    id: "iphone-16-pro",
    brand: "苹果",
    model: "iPhone 16 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2016%20Pro%20Black.jpg",
    launchDate: "2024-09",
    colors: ["黑色钛金属", "白色钛金属", "原色钛金属", "沙漠色钛金属"],
    popularity: 92,
    sales: 97,
    priceDrop: false,
    tags: ["旗舰", "专业影像", "AI"],
    officialUrl: "https://www.apple.com.cn/iphone-16-pro/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 6799, pricePdd: 6299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 7999, pricePdd: 7449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 9499, pricePdd: 8799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 10999, pricePdd: 10249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.3, resolution: "2622×1206", refreshRate: 120, material: "OLED (ProMotion)", type: "直屏" },
    body: { height: 149.6, width: 71.5, thickness: 8.25, weight: 199, material: "钛金属" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 3)",
      waterproof: "IP68"
    }
  },
  {
    id: "iphone-16-pro-max",
    brand: "苹果",
    model: "iPhone 16 Pro Max",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2016%20Pro%20Max%20Black.jpg",
    launchDate: "2024-09",
    colors: ["黑色钛金属", "白色钛金属", "原色钛金属", "沙漠色钛金属"],
    popularity: 90,
    sales: 95,
    priceDrop: false,
    tags: ["超大屏", "最强续航", "专业影像"],
    officialUrl: "https://www.apple.com.cn/iphone-16-pro/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 8999, pricePdd: 8399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 10499, pricePdd: 9749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 11999, pricePdd: 11249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.9, resolution: "2868×1320", refreshRate: 120, material: "OLED (ProMotion)", type: "直屏" },
    body: { height: 163.0, width: 77.6, thickness: 8.25, weight: 227, material: "钛金属" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 3)",
      waterproof: "IP68"
    }
  },
  {
    id: "iphone-15",
    brand: "苹果",
    model: "iPhone 15",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2015%20Black.jpg",
    launchDate: "2023-09",
    colors: ["黑色", "蓝色", "绿色", "黄色", "粉色"],
    popularity: 78,
    sales: 88,
    priceDrop: true,
    tags: ["性价比", "轻薄", "USB-C"],
    officialUrl: "https://www.apple.com.cn/iphone-15/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 4099, pricePdd: 3799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.1, resolution: "2556×1179", refreshRate: 60, material: "OLED", type: "直屏" },
    body: { height: 147.6, width: 71.6, thickness: 7.8, weight: 171, material: "航空级铝金属" },
    ram: "6GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      usb: "USB-C (USB 2)",
      waterproof: "IP68"
    }
  },
  {
    id: "iphone-14",
    brand: "苹果",
    model: "iPhone 14",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2014%20Black.jpg",
    launchDate: "2022-09",
    colors: ["午夜色", "星光色", "蓝色", "紫色", "红色"],
    popularity: 60,
    sales: 55,
    priceDrop: true,
    tags: ["入门", "轻薄", "降价"],
    officialUrl: "https://www.apple.com.cn/iphone-14/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 3599, pricePdd: 3299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 4399, pricePdd: 3999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5899, pricePdd: 5449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.1, resolution: "2532×1170", refreshRate: 60, material: "OLED", type: "直屏" },
    body: { height: 146.7, width: 71.5, thickness: 7.8, weight: 172, material: "航空级铝金属" },
    ram: "6GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      usb: "Lightning",
      waterproof: "IP68"
    }
  },

  // ==================== 华为 Huawei ====================
  {
    id: "mate-70",
    brand: "华为",
    model: "Mate 70",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Mate%2060%20Pro.jpg",
    launchDate: "2024-11",
    colors: ["曜金黑", "雪域白", "云杉绿", "风信紫"],
    popularity: 88,
    sales: 98,
    priceDrop: false,
    tags: ["商务旗舰", "鸿蒙", "卫星通信"],
    officialUrl: "https://consumer.huawei.com/cn/phones/mate70/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5999, pricePdd: 5599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2688×1216", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 160.9, width: 75.9, thickness: 7.8, weight: 203, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "mate-70-pro",
    brand: "华为",
    model: "Mate 70 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Mate%2060%20Pro%20Plus.jpg",
    launchDate: "2024-11",
    colors: ["曜金黑", "雪域白", "云杉绿", "风信紫"],
    popularity: 82,
    sales: 92,
    priceDrop: false,
    tags: ["旗舰影像", "3D人脸", "卫星通信"],
    officialUrl: "https://consumer.huawei.com/cn/phones/mate70/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 6499, pricePdd: 6049, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 7999, pricePdd: 7449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.9, resolution: "2832×1316", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 164.6, width: 79.5, thickness: 8.1, weight: 221, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "mate-70-pro-plus",
    brand: "华为",
    model: "Mate 70 Pro+",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Mate%2060%20Pro%20Plus.jpg",
    launchDate: "2024-11",
    colors: ["金丝银锦", "飞天青", "羽衣白", "墨韵黑"],
    popularity: 75,
    sales: 85,
    priceDrop: false,
    tags: ["超旗舰", "钛合金", "最强影像"],
    officialUrl: "https://consumer.huawei.com/cn/phones/mate70/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "512GB", priceJd: 8499, pricePdd: 7899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 9499, pricePdd: 8849, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.9, resolution: "2832×1316", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 164.6, width: 79.5, thickness: 8.1, weight: 226, material: "钛合金+锦纤" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "mate-60",
    brand: "华为",
    model: "Mate 60",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Mate%2060%20Pro.jpg",
    launchDate: "2023-08",
    colors: ["雅川青", "白沙银", "南糯紫", "雅丹黑"],
    popularity: 70,
    sales: 80,
    priceDrop: true,
    tags: ["经典旗舰", "降价", "卫星通信"],
    officialUrl: "https://consumer.huawei.com/cn/phones/mate60/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4499, pricePdd: 4149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.69, resolution: "2688×1216", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 161.4, width: 76.0, thickness: 7.95, weight: 209, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-80",
    brand: "华为",
    model: "Pura 80",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080.jpg",
    launchDate: "2025-04",
    colors: ["香颂绿", "摩卡棕", "羽砂白", "星耀黑"],
    popularity: 72,
    sales: 82,
    priceDrop: false,
    tags: ["影像旗舰", "时尚设计", "鸿蒙"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura80/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.6, resolution: "2760×1256", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 157.6, width: 74.3, thickness: 7.95, weight: 197, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-80-pro",
    brand: "华为",
    model: "Pura 80 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080%20Pro.jpg",
    launchDate: "2025-04",
    colors: ["香颂绿", "摩卡棕", "羽砂白", "星耀黑"],
    popularity: 68,
    sales: 63,
    priceDrop: false,
    tags: ["专业影像", "长焦微距", "时尚设计"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura80/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 7999, pricePdd: 7449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2844×1260", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 162.6, width: 75.1, thickness: 8.4, weight: 215, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-80-ultra",
    brand: "华为",
    model: "Pura 80 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080%20Ultra.jpg",
    launchDate: "2025-04",
    colors: ["香颂绿", "摩卡棕", "星耀黑"],
    popularity: 62,
    sales: 57,
    priceDrop: false,
    tags: ["影像机皇", "1英寸大底", "伸缩镜头"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura80/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "512GB", priceJd: 9999, pricePdd: 9299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 10999, pricePdd: 10249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2844×1260", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 162.6, width: 75.1, thickness: 8.4, weight: 221, material: "素皮" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "nova-14-pro",
    brand: "华为",
    model: "nova 14 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20nova%2012%20Pro.jpg",
    launchDate: "2025-05",
    colors: ["12号色", "曜金黑", "雪域白", "樱语粉"],
    popularity: 65,
    sales: 60,
    priceDrop: false,
    tags: ["自拍", "轻薄", "时尚"],
    officialUrl: "https://consumer.huawei.com/cn/phones/nova14-pro/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3999, pricePdd: 3649, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2760×1236", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 163.3, width: 74.7, thickness: 7.68, weight: 188, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP54"
    }
  },
  {
    id: "nova-14",
    brand: "华为",
    model: "nova 14",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20nova%2012.jpg",
    launchDate: "2025-05",
    colors: ["12号色", "曜金黑", "雪域白", "樱语粉"],
    popularity: 58,
    sales: 53,
    priceDrop: false,
    tags: ["性价比", "轻薄", "自拍"],
    officialUrl: "https://consumer.huawei.com/cn/phones/nova14/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2699, pricePdd: 2449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3199, pricePdd: 2899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2412×1084", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 161.8, width: 74.5, thickness: 6.98, weight: 185, material: "塑料中框+玻璃" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 2.0)",
      waterproof: "生活防水"
    }
  },
  {
    id: "enjoy-70x",
    brand: "华为",
    model: "畅享 70X",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Enjoy%2070.jpg",
    launchDate: "2025-01",
    colors: ["雪域白", "曜金黑", "湖光青"],
    popularity: 45,
    sales: 45,
    priceDrop: false,
    tags: ["千元机", "长续航", "鸿蒙"],
    officialUrl: "https://consumer.huawei.com/cn/phones/enjoy-70x/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 1599, pricePdd: 1449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 1999, pricePdd: 1799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.75, resolution: "2600×1200", refreshRate: 90, material: "LCD", type: "直屏" },
    body: { height: 168.3, width: 77.7, thickness: 8.93, weight: 207, material: "塑料" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: false,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 5",
      bluetooth: "5.1",
      usb: "USB-C (USB 2.0)",
      waterproof: "生活防水"
    }
  },

  // ==================== 小米 Xiaomi ====================
  {
    id: "xiaomi-16",
    brand: "小米",
    model: "Xiaomi 16",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%2015.jpg",
    launchDate: "2025-10",
    colors: ["黑色", "白色", "亮银", "丁香紫"],
    popularity: 85,
    sales: 95,
    priceDrop: false,
    tags: ["小屏旗舰", "徕卡影像", "轻薄"],
    officialUrl: "https://www.mi.com/xiaomi-16",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4299, pricePdd: 3949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4799, pricePdd: 4399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5499, pricePdd: 5049, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.36, resolution: "2670×1200", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 152.8, width: 71.5, thickness: 8.2, weight: 187, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },
  {
    id: "xiaomi-16-pro",
    brand: "小米",
    model: "Xiaomi 16 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%2015%20Ultra.jpg",
    launchDate: "2025-10",
    colors: ["黑色", "白色", "亮银", "松柏绿"],
    popularity: 80,
    sales: 90,
    priceDrop: false,
    tags: ["全能旗舰", "徕卡影像", "大屏"],
    officialUrl: "https://www.mi.com/xiaomi-16-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5299, pricePdd: 4899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5799, pricePdd: 5349, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.73, resolution: "3200×1440", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 161.3, width: 75.3, thickness: 8.5, weight: 213, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },
  {
    id: "xiaomi-15",
    brand: "小米",
    model: "Xiaomi 15",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%2015.jpg",
    launchDate: "2024-10",
    colors: ["黑色", "白色", "浅草绿", "丁香紫"],
    popularity: 75,
    sales: 85,
    priceDrop: true,
    tags: ["小屏旗舰", "徕卡影像", "降价"],
    officialUrl: "https://www.mi.com/xiaomi-15",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3999, pricePdd: 3649, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 4699, pricePdd: 4349, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.36, resolution: "2670×1200", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 152.8, width: 71.5, thickness: 8.2, weight: 188, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },
  {
    id: "xiaomi-15-ultra",
    brand: "小米",
    model: "Xiaomi 15 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%2015%20Ultra.jpg",
    launchDate: "2025-02",
    colors: ["黑色", "白色", "经典相机银"],
    popularity: 68,
    sales: 63,
    priceDrop: false,
    tags: ["影像机皇", "1英寸大底", "徕卡"],
    officialUrl: "https://www.mi.com/xiaomi-15-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 7799, pricePdd: 7249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.73, resolution: "3200×1440", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 161.3, width: 75.3, thickness: 9.2, weight: 229, material: "铝合金+素皮" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },
  {
    id: "redmi-k80-pro",
    brand: "小米",
    model: "Redmi K80 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%20Redmi%20K70%20Pro%2023117RK66C%20Black.jpg",
    launchDate: "2024-11",
    colors: ["晴雪", "墨羽", "浅草绿"],
    popularity: 72,
    sales: 82,
    priceDrop: false,
    tags: ["性价比", "高性能", "大电池"],
    officialUrl: "https://www.mi.com/redmi-k80-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3299, pricePdd: 2999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3699, pricePdd: 3399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 4399, pricePdd: 4049, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "3200×1440", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 160.0, width: 75.0, thickness: 8.1, weight: 206, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP68"
    }
  },
  {
    id: "redmi-k80",
    brand: "小米",
    model: "Redmi K80",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%20Redmi%20K70%2023113RKC6C%20Black.jpg",
    launchDate: "2024-11",
    colors: ["晴雪", "墨羽", "浅草绿"],
    popularity: 78,
    sales: 88,
    priceDrop: false,
    tags: ["性价比", "大电池", "水桶机"],
    officialUrl: "https://www.mi.com/redmi-k80",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2499, pricePdd: 2249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2899, pricePdd: 2649, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "3200×1440", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 160.0, width: 75.0, thickness: 8.1, weight: 201, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP68"
    }
  },
  {
    id: "redmi-note-14-pro-plus",
    brand: "小米",
    model: "Redmi Note 14 Pro+",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Redmi%20Note%2014%20Pro%20Plus%205G.jpg",
    launchDate: "2025-03",
    colors: ["子夜黑", "镜瓷白", "幻影青"],
    popularity: 65,
    sales: 60,
    priceDrop: false,
    tags: ["千元旗舰", "大电量", "快充"],
    officialUrl: "https://www.mi.com/redmi-note-14-pro-plus",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 1999, pricePdd: 1799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2299, pricePdd: 2099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2712×1220", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 162.5, width: 74.5, thickness: 8.7, weight: 195, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP68"
    }
  },
  {
    id: "redmi-note-14-pro",
    brand: "小米",
    model: "Redmi Note 14 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Redmi%20Note%2014%20Pro.jpg",
    launchDate: "2025-03",
    colors: ["子夜黑", "镜瓷白", "幻影青"],
    popularity: 70,
    sales: 80,
    priceDrop: false,
    tags: ["千元机", "长续航", "护眼屏"],
    officialUrl: "https://www.mi.com/redmi-note-14-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 1499, pricePdd: 1349, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 1699, pricePdd: 1549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 1999, pricePdd: 1799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2400×1080", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 162.5, width: 74.5, thickness: 7.98, weight: 187, material: "塑料" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP54"
    }
  },
  {
    id: "redmi-turbo-4",
    brand: "小米",
    model: "Redmi Turbo 4",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%20Redmi%20Note%2013%20Pro.jpg",
    launchDate: "2025-01",
    colors: ["暗影黑", "冰钛", "祥云白"],
    popularity: 60,
    sales: 55,
    priceDrop: false,
    tags: ["性能", "游戏", "性价比"],
    officialUrl: "https://www.mi.com/redmi-turbo-4",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2299, pricePdd: 2099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2699, pricePdd: 2449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 3199, pricePdd: 2899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2712×1220", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 160.8, width: 74.3, thickness: 8.05, weight: 198, material: "塑料" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP64"
    }
  },

  // ==================== 补充：2024年后发布机型 ====================

  // --- 苹果 ---
  {
    id: "iphone-16e",
    brand: "苹果",
    model: "iPhone 16e",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/ios/iPhone%2016e%20Black.jpg",
    launchDate: "2025-02",
    colors: ["黑色", "白色"],
    popularity: 72,
    sales: 82,
    priceDrop: false,
    tags: ["性价比", "轻薄", "A18芯片"],
    officialUrl: "https://www.apple.com.cn/iphone-16e/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 3999, pricePdd: 3699, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.1, resolution: "2532×1170", refreshRate: 60, material: "OLED", type: "直屏" },
    body: { height: 146.7, width: 71.5, thickness: 7.8, weight: 167, material: "航空级铝金属" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      usb: "USB-C (USB 2)",
      waterproof: "IP68"
    }
  },

  // --- 华为 ---
  {
    id: "mate-70-rs",
    brand: "华为",
    model: "Mate 70 RS 非凡大师",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Mate%2060%20RS%20Ultimate.jpg",
    launchDate: "2024-11",
    colors: ["皓白陶瓷", "瑞红陶瓷", "玄黑陶瓷"],
    popularity: 55,
    sales: 50,
    priceDrop: false,
    tags: ["超旗舰", "陶瓷机身", "卫星通信"],
    officialUrl: "https://consumer.huawei.com/cn/phones/mate70-rs/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "512GB", priceJd: 11999, pricePdd: 11299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 12999, pricePdd: 12249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.9, resolution: "2832×1316", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 164.6, width: 79.5, thickness: 8.1, weight: 242, material: "陶瓷" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-70",
    brand: "华为",
    model: "Pura 70",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080.jpg",
    launchDate: "2024-04",
    colors: ["雪域白", "羽砂黑", "樱玫红", "冰晶蓝"],
    popularity: 68,
    sales: 63,
    priceDrop: true,
    tags: ["影像旗舰", "降价", "HarmonyOS"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura70/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4499, pricePdd: 4149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.6, resolution: "2760×1256", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 157.6, width: 74.3, thickness: 7.95, weight: 207, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-70-pro",
    brand: "华为",
    model: "Pura 70 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080%20Pro.jpg",
    launchDate: "2024-04",
    colors: ["雪域白", "羽砂黑", "罗兰紫"],
    popularity: 62,
    sales: 57,
    priceDrop: true,
    tags: ["专业影像", "长焦微距", "降价"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura70-pro/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2844×1260", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 162.6, width: 75.1, thickness: 8.4, weight: 220, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-70-pro-plus",
    brand: "华为",
    model: "Pura 70 Pro+",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080%20Pro.jpg",
    launchDate: "2024-04",
    colors: ["光织银", "弦乐白", "魅影黑"],
    popularity: 55,
    sales: 50,
    priceDrop: true,
    tags: ["旗舰影像", "玄武钢化", "降价"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura70-pro-plus/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "512GB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 7999, pricePdd: 7449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2844×1260", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 162.6, width: 75.1, thickness: 8.4, weight: 220, material: "铝合金+玻璃" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "pura-70-ultra",
    brand: "华为",
    model: "Pura 70 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20Pura%2080%20Ultra.jpg",
    launchDate: "2024-04",
    colors: ["香颂绿", "摩卡棕", "星芒黑", "星芒白"],
    popularity: 58,
    sales: 53,
    priceDrop: true,
    tags: ["影像机皇", "1英寸大底", "伸缩镜头"],
    officialUrl: "https://consumer.huawei.com/cn/phones/pura70-ultra/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "512GB", priceJd: 8999, pricePdd: 8399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 9999, pricePdd: 9299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2844×1260", refreshRate: 120, material: "OLED (LTPO)", type: "等深四曲屏" },
    body: { height: 162.6, width: 75.1, thickness: 8.4, weight: 226, material: "素皮" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 3.1)",
      waterproof: "IP68"
    }
  },
  {
    id: "nova-13",
    brand: "华为",
    model: "nova 13",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20nova%2012.jpg",
    launchDate: "2024-10",
    colors: ["12号色", "曜金黑", "雪域白", "樱语粉"],
    popularity: 60,
    sales: 55,
    priceDrop: false,
    tags: ["中端", "轻薄", "自拍"],
    officialUrl: "https://consumer.huawei.com/cn/phones/nova13/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2399, pricePdd: 2199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2899, pricePdd: 2649, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2412×1084", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 161.8, width: 74.5, thickness: 6.98, weight: 185, material: "塑料中框+玻璃" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 2.0)",
      waterproof: "生活防水"
    }
  },
  {
    id: "nova-13-pro",
    brand: "华为",
    model: "nova 13 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Huawei%20nova%2012%20Pro.jpg",
    launchDate: "2024-10",
    colors: ["12号色", "曜金黑", "雪域白", "樱语粉"],
    popularity: 55,
    sales: 50,
    priceDrop: false,
    tags: ["自拍旗舰", "轻薄", "曲屏"],
    officialUrl: "https://consumer.huawei.com/cn/phones/nova13-pro/",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3199, pricePdd: 2949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3699, pricePdd: 3399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2760×1236", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 163.3, width: 74.7, thickness: 7.68, weight: 188, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP54"
    }
  },

  // --- 小米 ---
  {
    id: "xiaomi-15-pro",
    brand: "小米",
    model: "Xiaomi 15 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%2015%20Ultra.jpg",
    launchDate: "2024-10",
    colors: ["黑色", "白色", "亮银", "岩石青"],
    popularity: 70,
    sales: 80,
    priceDrop: true,
    tags: ["全能旗舰", "2K屏", "徕卡长焦"],
    officialUrl: "https://www.mi.com/xiaomi-15-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4799, pricePdd: 4449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5299, pricePdd: 4899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.73, resolution: "3200×1440", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 161.3, width: 75.3, thickness: 8.5, weight: 213, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },
  {
    id: "xiaomi-14-ultra",
    brand: "小米",
    model: "Xiaomi 14 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%2014%20Ultra.jpg",
    launchDate: "2024-02",
    colors: ["黑色", "白色", "经典相机银"],
    popularity: 62,
    sales: 57,
    priceDrop: true,
    tags: ["影像机皇", "1英寸大底", "徕卡全焦段"],
    officialUrl: "https://www.mi.com/xiaomi-14-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6799, pricePdd: 6299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.73, resolution: "3200×1440", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 161.4, width: 75.3, thickness: 9.2, weight: 224, material: "铝合金+素皮" },
    ram: "16GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },
  {
    id: "xiaomi-civi-4-pro",
    brand: "小米",
    model: "Xiaomi Civi 4 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%20Civi%203.jpg",
    launchDate: "2024-03",
    colors: ["春野绿", "柔雾粉", "微风蓝", "黑色"],
    popularity: 48,
    sales: 48,
    priceDrop: false,
    tags: ["自拍", "轻薄", "时尚设计"],
    officialUrl: "https://www.mi.com/civi-4-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2699, pricePdd: 2449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3199, pricePdd: 2899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.55, resolution: "2750×1236", refreshRate: 120, material: "OLED", type: "等深微曲屏" },
    body: { height: 157.2, width: 72.8, thickness: 7.45, weight: 179, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP54"
    }
  },
  {
    id: "redmi-note-14",
    brand: "小米",
    model: "Redmi Note 14",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Redmi%20Note%2014%205G.jpg",
    launchDate: "2025-03",
    colors: ["子夜黑", "镜瓷白", "幻影青"],
    popularity: 66,
    sales: 61,
    priceDrop: false,
    tags: ["千元机", "长续航", "性价比"],
    officialUrl: "https://www.mi.com/redmi-note-14",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "128GB", priceJd: 1199, pricePdd: 1099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "256GB", priceJd: 1399, pricePdd: 1249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 1699, pricePdd: 1549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2400×1080", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 162.5, width: 74.5, thickness: 7.98, weight: 190, material: "塑料" },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP54"
    }
  },
  {
    id: "redmi-k70-ultra",
    brand: "小米",
    model: "Redmi K70 至尊版",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%20Redmi%20K70%2023113RKC6C%20Black.jpg",
    launchDate: "2024-07",
    colors: ["晴雪", "墨羽", "冰蓝"],
    popularity: 56,
    sales: 51,
    priceDrop: true,
    tags: ["性能旗舰", "144Hz", "天玑9300+"],
    officialUrl: "https://www.mi.com/redmi-k70-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2599, pricePdd: 2399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2999, pricePdd: 2749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 3599, pricePdd: 3299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2712×1220", refreshRate: 144, material: "OLED", type: "直屏" },
    body: { height: 160.4, width: 75.1, thickness: 8.4, weight: 211, material: "铝合金+玻璃" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP68"
    }
  },
  {
    id: "redmi-turbo-3",
    brand: "小米",
    model: "Redmi Turbo 3",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Xiaomi%20Redmi%20Note%2013%20Pro.jpg",
    launchDate: "2024-04",
    colors: ["暗影黑", "冰钛", "祥云白"],
    popularity: 52,
    sales: 47,
    priceDrop: true,
    tags: ["性能", "轻薄", "骁龙8s"],
    officialUrl: "https://www.mi.com/redmi-turbo-3",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 1999, pricePdd: 1799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2299, pricePdd: 2099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 2799, pricePdd: 2549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2712×1220", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 160.5, width: 74.4, thickness: 7.8, weight: 179, material: "塑料" },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP64"
    }
  },

  // ==================== vivo ====================
  {
    id: "vivo-x200-pro-mini",
    brand: "vivo",
    model: "X200 Pro mini",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20X200%20Pro%20mini%20Titanium.jpg",
    launchDate: "2024-10",
    colors: ["钛青", "微粉", "直白", "简黑"],
    popularity: 68,
    sales: 63,
    priceDrop: false,
    tags: ["小屏旗舰", "蔡司影像", "天玑9400"],
    officialUrl: "https://www.vivo.com.cn/x200-pro-mini",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4299, pricePdd: 3949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4799, pricePdd: 4399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5499, pricePdd: 5049, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.31, resolution: "2640×1216", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 150.8, width: 71.8, thickness: 8.15, weight: 187, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP69" }
  },
  {
    id: "vivo-x200",
    brand: "vivo",
    model: "X200",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20X200%20Black.jpg",
    launchDate: "2024-10",
    colors: ["宝石蓝", "钛青", "白月光", "辰夜黑"],
    popularity: 72,
    sales: 82,
    priceDrop: false,
    tags: ["旗舰", "蔡司长焦", "天玑9400"],
    officialUrl: "https://www.vivo.com.cn/x200",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3999, pricePdd: 3699, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4499, pricePdd: 4149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5199, pricePdd: 4799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.67, resolution: "2800×1260", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 160.3, width: 74.8, thickness: 8.0, weight: 197, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP68" }
  },
  {
    id: "vivo-x200-pro",
    brand: "vivo",
    model: "X200 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20X200%20Pro%20Black.jpg",
    launchDate: "2024-10",
    colors: ["宝石蓝", "钛青", "白月光", "辰夜黑"],
    popularity: 74,
    sales: 84,
    priceDrop: false,
    tags: ["影像旗舰", "蔡司APO", "2亿长焦"],
    officialUrl: "https://www.vivo.com.cn/x200-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6199, pricePdd: 5749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1260", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 162.4, width: 76.0, thickness: 8.5, weight: 223, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP69" }
  },
  {
    id: "vivo-x100-ultra",
    brand: "vivo",
    model: "X100 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20X200%20Pro.jpg",
    launchDate: "2024-05",
    colors: ["钛青", "白月光", "深空灰"],
    popularity: 55,
    sales: 50,
    priceDrop: true,
    tags: ["影像机皇", "2亿APO长焦", "1英寸"],
    officialUrl: "https://www.vivo.com.cn/x100-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6799, pricePdd: 6299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "3200×1440", refreshRate: 120, material: "OLED (LTPO)", type: "曲屏" },
    body: { height: 164.1, width: 75.6, thickness: 9.2, weight: 229, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP69" }
  },
  {
    id: "vivo-s20-pro",
    brand: "vivo",
    model: "S20 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20S20%20Pro.jpg",
    launchDate: "2024-12",
    colors: ["凤羽金", "紫气东来", "松烟墨"],
    popularity: 60,
    sales: 55,
    priceDrop: false,
    tags: ["人像", "轻薄", "自拍"],
    officialUrl: "https://www.vivo.com.cn/s20-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2999, pricePdd: 2749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1260", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 164.4, width: 75.1, thickness: 7.5, weight: 185, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP64" }
  },
  {
    id: "iqoo-13",
    brand: "vivo",
    model: "iQOO 13",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20iQOO%2013.jpg",
    launchDate: "2024-11",
    colors: ["传奇版", "赛道版", "纳多灰", "曼岛绿"],
    popularity: 64,
    sales: 59,
    priceDrop: false,
    tags: ["电竞", "骁龙8Elite", "144Hz"],
    officialUrl: "https://www.vivo.com.cn/iqoo-13",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3699, pricePdd: 3399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4199, pricePdd: 3849, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 4899, pricePdd: 4499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.82, resolution: "3168×1440", refreshRate: 144, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 163.2, width: 76.8, thickness: 8.0, weight: 207, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "iqoo-neo10-pro",
    brand: "vivo",
    model: "iQOO Neo10 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20iQOO%20Neo%2010%20Pro.jpg",
    launchDate: "2024-12",
    colors: ["拉力橙", "疾影黑", "驰光白"],
    popularity: 52,
    sales: 47,
    priceDrop: false,
    tags: ["电竞", "天玑9400", "120W快充"],
    officialUrl: "https://www.vivo.com.cn/iqoo-neo10-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2699, pricePdd: 2449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3099, pricePdd: 2799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 3699, pricePdd: 3349, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1260", refreshRate: 144, material: "OLED", type: "直屏" },
    body: { height: 163.5, width: 76.8, thickness: 8.1, weight: 199, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP54" }
  },

  // ==================== OPPO ====================
  {
    id: "oppo-find-x8",
    brand: "OPPO",
    model: "Find X8",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Find%20X8%20Pro.jpg",
    launchDate: "2024-10",
    colors: ["星野黑", "追风蓝", "浮光白", "气泡粉"],
    popularity: 70,
    sales: 80,
    priceDrop: false,
    tags: ["旗舰", "哈苏影像", "天玑9400"],
    officialUrl: "https://www.oppo.com/cn/find-x8",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3999, pricePdd: 3699, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4499, pricePdd: 4149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.59, resolution: "2760×1256", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 157.4, width: 74.3, thickness: 7.85, weight: 193, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.1)", waterproof: "IP69" }
  },
  {
    id: "oppo-find-x8-pro",
    brand: "OPPO",
    model: "Find X8 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Find%20X8%20Pro.jpg",
    launchDate: "2024-10",
    colors: ["星野黑", "追风蓝", "浮光白"],
    popularity: 66,
    sales: 61,
    priceDrop: false,
    tags: ["旗舰影像", "双潜望长焦", "哈苏"],
    officialUrl: "https://www.oppo.com/cn/find-x8-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2780×1264", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 162.3, width: 76.6, thickness: 8.24, weight: 215, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.1)", waterproof: "IP69" }
  },
  {
    id: "oppo-find-x7-ultra",
    brand: "OPPO",
    model: "Find X7 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Find%20X7%20Ultra.jpg",
    launchDate: "2024-01",
    colors: ["海阔天空", "沙漠银月", "松影墨韵"],
    popularity: 52,
    sales: 47,
    priceDrop: true,
    tags: ["影像机皇", "双潜望", "1英寸"],
    officialUrl: "https://www.oppo.com/cn/find-x7-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.82, resolution: "3168×1440", refreshRate: 120, material: "OLED (LTPO)", type: "曲屏" },
    body: { height: 164.3, width: 76.2, thickness: 9.5, weight: 221, material: "铝合金+素皮/玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "oppo-find-x7",
    brand: "OPPO",
    model: "Find X7",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Find%20X7.jpg",
    launchDate: "2024-01",
    colors: ["海阔天空", "沙漠银月", "烟云紫", "星空黑"],
    popularity: 50,
    sales: 45,
    priceDrop: true,
    tags: ["旗舰", "哈苏", "天玑9300"],
    officialUrl: "https://www.oppo.com/cn/find-x7",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3299, pricePdd: 2999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3799, pricePdd: 3449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 4299, pricePdd: 3949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2780×1264", refreshRate: 120, material: "OLED (LTPO)", type: "曲屏" },
    body: { height: 162.7, width: 75.4, thickness: 8.7, weight: 202, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.1)", waterproof: "IP65" }
  },
  {
    id: "oppo-reno13-pro",
    brand: "OPPO",
    model: "Reno 13 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Reno13%20Pro.jpg",
    launchDate: "2024-11",
    colors: ["蝶蝶紫", "星光粉", "午夜黑"],
    popularity: 58,
    sales: 53,
    priceDrop: false,
    tags: ["人像", "轻薄", "ColorOS"],
    officialUrl: "https://www.oppo.com/cn/reno13-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3299, pricePdd: 2999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3799, pricePdd: 3449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.83, resolution: "2800×1272", refreshRate: 120, material: "OLED", type: "等深微曲屏" },
    body: { height: 162.8, width: 76.6, thickness: 7.55, weight: 192, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP69" }
  },
  {
    id: "oppo-reno13",
    brand: "OPPO",
    model: "Reno 13",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Reno13.jpg",
    launchDate: "2024-11",
    colors: ["蝶蝶紫", "星光粉", "午夜黑"],
    popularity: 62,
    sales: 57,
    priceDrop: false,
    tags: ["轻薄", "自拍", "长续航"],
    officialUrl: "https://www.oppo.com/cn/reno13",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2599, pricePdd: 2399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3099, pricePdd: 2799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.59, resolution: "2760×1256", refreshRate: 120, material: "OLED", type: "直屏" },
    body: { height: 157.9, width: 74.7, thickness: 7.24, weight: 181, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP69" }
  },

  // ==================== 荣耀 ====================
  {
    id: "honor-magic7",
    brand: "荣耀",
    model: "Magic7",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20Magic7%20Pro.jpg",
    launchDate: "2024-11",
    colors: ["月影灰", "天际蓝", "朝霞金", "雪域白", "绒黑色"],
    popularity: 66,
    sales: 61,
    priceDrop: false,
    tags: ["AI旗舰", "骁龙8Elite", "荣耀绿洲护眼"],
    officialUrl: "https://www.honor.com/cn/magic7",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4499, pricePdd: 4149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5699, pricePdd: 5249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1264", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 162.1, width: 75.8, thickness: 7.95, weight: 199, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.1)", waterproof: "IP68" }
  },
  {
    id: "honor-magic7-pro",
    brand: "荣耀",
    model: "Magic7 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20Magic7%20Pro.jpg",
    launchDate: "2024-11",
    colors: ["月影灰", "天际蓝", "雪域白", "绒黑色"],
    popularity: 62,
    sales: 57,
    priceDrop: false,
    tags: ["AI旗舰", "3D人脸", "2亿长焦"],
    officialUrl: "https://www.honor.com/cn/magic7-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 5999, pricePdd: 5549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 6699, pricePdd: 6199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2800×1280", refreshRate: 120, material: "OLED (LTPO)", type: "等深微曲屏" },
    body: { height: 162.7, width: 77.1, thickness: 8.5, weight: 223, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.1)", waterproof: "IP68" }
  },
  {
    id: "honor-magic6-pro",
    brand: "荣耀",
    model: "Magic6 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20Magic6%20Pro.jpg",
    launchDate: "2024-01",
    colors: ["祁连雪", "海湖青", "流云紫", "麦浪绿", "绒黑色"],
    popularity: 54,
    sales: 49,
    priceDrop: true,
    tags: ["旗舰", "1.8亿长焦", "降价"],
    officialUrl: "https://www.honor.com/cn/magic6-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4299, pricePdd: 3949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4799, pricePdd: 4399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5499, pricePdd: 5049, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "2800×1280", refreshRate: 120, material: "OLED (LTPO)", type: "曲屏" },
    body: { height: 164.2, width: 76.5, thickness: 8.9, weight: 225, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.3", usb: "USB-C (USB 3.1)", waterproof: "IP68" }
  },
  {
    id: "honor-400-pro",
    brand: "荣耀",
    model: "400 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20400%20Pro.jpg",
    launchDate: "2025-05",
    colors: ["墨岩黑", "茶卡青", "苍山灰", "玉龙雪"],
    popularity: 48,
    sales: 48,
    priceDrop: false,
    tags: ["中端旗舰", "绿洲护眼", "AI"],
    officialUrl: "https://www.honor.com/cn/400-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3299, pricePdd: 2999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3799, pricePdd: 3449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2700×1224", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 163.5, width: 75.5, thickness: 7.8, weight: 188, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },
  {
    id: "honor-300-pro",
    brand: "荣耀",
    model: "300 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20300%20Pro.jpg",
    launchDate: "2024-12",
    colors: ["墨岩黑", "茶卡青", "苍山灰", "玉龙雪"],
    popularity: 52,
    sales: 47,
    priceDrop: false,
    tags: ["中端", "绿洲护眼", "轻薄"],
    officialUrl: "https://www.honor.com/cn/300-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2799, pricePdd: 2549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3299, pricePdd: 2999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2700×1224", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 163.5, width: 75.5, thickness: 7.8, weight: 187, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },

  // ==================== 三星 ====================
  {
    id: "samsung-s25",
    brand: "三星",
    model: "Galaxy S25",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20S25.jpg",
    launchDate: "2025-01",
    colors: ["远海蓝", "冷川绿", "暮河银", "星夜黑"],
    popularity: 56,
    sales: 51,
    priceDrop: false,
    tags: ["小屏旗舰", "骁龙8Elite", "One UI"],
    officialUrl: "https://www.samsung.com/cn/galaxy-s25",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.2, resolution: "2340×1080", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 146.9, width: 70.5, thickness: 7.2, weight: 162, material: "装甲铝+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "samsung-s25-plus",
    brand: "三星",
    model: "Galaxy S25+",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20S25%20Plus.jpg",
    launchDate: "2025-01",
    colors: ["远海蓝", "冷川绿", "暮河银", "星夜黑"],
    popularity: 50,
    sales: 45,
    priceDrop: false,
    tags: ["大屏旗舰", "2K屏", "AI"],
    officialUrl: "https://www.samsung.com/cn/galaxy-s25-plus",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 7499, pricePdd: 6949, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "3120×1440", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 158.4, width: 75.8, thickness: 7.3, weight: 190, material: "装甲铝+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "samsung-s25-ultra",
    brand: "三星",
    model: "Galaxy S25 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20S25%20Ultra.jpg",
    launchDate: "2025-01",
    colors: ["钛银蓝", "钛影黑", "钛辉银", "钛柔金"],
    popularity: 58,
    sales: 53,
    priceDrop: false,
    tags: ["安卓机皇", "S Pen", "2亿像素"],
    officialUrl: "https://www.samsung.com/cn/galaxy-s25-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 8499, pricePdd: 7899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 9499, pricePdd: 8849, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 10999, pricePdd: 10249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.9, resolution: "3120×1440", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 162.8, width: 77.6, thickness: 8.2, weight: 218, material: "钛金属+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "samsung-s24",
    brand: "三星",
    model: "Galaxy S24",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20S24.jpg",
    launchDate: "2024-01",
    colors: ["浅珀黄", "雅岩灰", "水墨黑", "秘矿紫"],
    popularity: 46,
    sales: 46,
    priceDrop: true,
    tags: ["小屏旗舰", "AI", "降价"],
    officialUrl: "https://www.samsung.com/cn/galaxy-s24",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3999, pricePdd: 3699, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.2, resolution: "2340×1080", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 147.0, width: 70.6, thickness: 7.6, weight: 167, material: "装甲铝+玻璃" },
    ram: "8GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 6E", bluetooth: "5.3", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "samsung-s24-ultra",
    brand: "三星",
    model: "Galaxy S24 Ultra",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20S24%20Ultra.jpg",
    launchDate: "2024-01",
    colors: ["钛灰", "钛黑", "钛暮紫", "钛羽黄"],
    popularity: 48,
    sales: 48,
    priceDrop: true,
    tags: ["安卓机皇", "S Pen", "降价"],
    officialUrl: "https://www.samsung.com/cn/galaxy-s24-ultra",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 6999, pricePdd: 6499, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 7999, pricePdd: 7449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 8999, pricePdd: 8399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.8, resolution: "3120×1440", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 162.3, width: 79.0, thickness: 8.6, weight: 232, material: "钛金属+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.3", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },

  // ==================== 补充：更多热门型号 ====================

  // --- vivo ---
  {
    id: "vivo-x100s",
    brand: "vivo",
    model: "X100s",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20X200.jpg",
    launchDate: "2024-05",
    colors: ["青云", "钛青", "白月光", "深空灰"],
    popularity: 48,
    sales: 48,
    priceDrop: true,
    tags: ["直屏旗舰", "天玑9300+", "蔡司"],
    officialUrl: "https://www.vivo.com.cn/x100s",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3599, pricePdd: 3299, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4099, pricePdd: 3749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 4699, pricePdd: 4349, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1260", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 163.1, width: 75.8, thickness: 8.0, weight: 203, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP69" }
  },
  {
    id: "vivo-x100s-pro",
    brand: "vivo",
    model: "X100s Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20X200%20Pro.jpg",
    launchDate: "2024-05",
    colors: ["辰夜黑", "白月光", "钛青"],
    popularity: 44,
    sales: 44,
    priceDrop: true,
    tags: ["影像旗舰", "1英寸", "天玑9300+"],
    officialUrl: "https://www.vivo.com.cn/x100s-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 4499, pricePdd: 4149, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 4999, pricePdd: 4599, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "1TB", priceJd: 5699, pricePdd: 5249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1260", refreshRate: 120, material: "OLED (LTPO)", type: "曲屏" },
    body: { height: 164.1, width: 75.3, thickness: 8.9, weight: 225, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.4", usb: "USB-C (USB 3.2)", waterproof: "IP69" }
  },
  {
    id: "iqoo-z9-turbo-plus",
    brand: "vivo",
    model: "iQOO Z9 Turbo+",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/vivo%20iQOO%20Z9.jpg",
    launchDate: "2024-09",
    colors: ["曜夜黑", "星光白", "山野青"],
    popularity: 46,
    sales: 46,
    priceDrop: false,
    tags: ["电竞", "天玑9300+", "大电池"],
    officialUrl: "https://www.vivo.com.cn/iqoo-z9-turbo-plus",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2199, pricePdd: 1999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2599, pricePdd: 2399, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1260", refreshRate: 144, material: "OLED", type: "直屏" },
    body: { height: 163.8, width: 76.0, thickness: 8.0, weight: 196, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP64" }
  },

  // --- OPPO ---
  {
    id: "oppo-reno12-pro",
    brand: "OPPO",
    model: "Reno 12 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Reno12%20Pro.jpg",
    launchDate: "2024-05",
    colors: ["银幻紫", "乌木黑", "香槟金"],
    popularity: 46,
    sales: 46,
    priceDrop: true,
    tags: ["轻薄", "人像", "AI"],
    officialUrl: "https://www.oppo.com/cn/reno12-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2699, pricePdd: 2449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3199, pricePdd: 2899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2412×1080", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 161.4, width: 74.1, thickness: 7.6, weight: 184, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },
  {
    id: "oppo-reno12",
    brand: "OPPO",
    model: "Reno 12",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Oppo%20Reno12.jpg",
    launchDate: "2024-05",
    colors: ["千禧银", "柔和桃", "乌木黑"],
    popularity: 52,
    sales: 47,
    priceDrop: true,
    tags: ["轻薄", "自拍", "ColorOS"],
    officialUrl: "https://www.oppo.com/cn/reno12",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 1999, pricePdd: 1799, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2499, pricePdd: 2249, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2412×1080", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 161.4, width: 74.1, thickness: 7.3, weight: 179, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.4", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },

  // --- 荣耀 ---
  {
    id: "honor-magic6",
    brand: "荣耀",
    model: "Magic6",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20Magic6.jpg",
    launchDate: "2024-01",
    colors: ["祁连雪", "海湖青", "流云紫", "麦浪绿", "绒黑色"],
    popularity: 48,
    sales: 48,
    priceDrop: true,
    tags: ["旗舰", "骁龙8Gen3", "降价"],
    officialUrl: "https://www.honor.com/cn/magic6",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3999, pricePdd: 3649, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2800×1264", refreshRate: 120, material: "OLED (LTPO)", type: "曲屏" },
    body: { height: 161.8, width: 75.4, thickness: 8.1, weight: 206, material: "铝合金+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: true, wifi: "Wi-Fi 7", bluetooth: "5.3", usb: "USB-C (USB 3.1)", waterproof: "IP68" }
  },
  {
    id: "honor-400",
    brand: "荣耀",
    model: "400",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20400.jpg",
    launchDate: "2025-05",
    colors: ["墨岩黑", "茶卡青", "苍山灰", "玉龙雪"],
    popularity: 44,
    sales: 44,
    priceDrop: false,
    tags: ["中端", "绿洲护眼", "轻薄"],
    officialUrl: "https://www.honor.com/cn/400",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2699, pricePdd: 2449, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3199, pricePdd: 2899, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2664×1200", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 161.5, width: 74.6, thickness: 7.7, weight: 181, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },
  {
    id: "honor-300",
    brand: "荣耀",
    model: "300",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20300.jpg",
    launchDate: "2024-12",
    colors: ["墨岩黑", "茶卡青", "苍山灰", "玉龙雪"],
    popularity: 50,
    sales: 45,
    priceDrop: false,
    tags: ["中端", "护眼", "性价比"],
    officialUrl: "https://www.honor.com/cn/300",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2299, pricePdd: 2099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 2799, pricePdd: 2549, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2664×1200", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 161.5, width: 74.6, thickness: 7.7, weight: 179, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },
  {
    id: "honor-200-pro",
    brand: "荣耀",
    model: "200 Pro",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Honor%20200%20Pro.jpg",
    launchDate: "2024-05",
    colors: ["天海青", "珊瑚粉", "月影白", "绒黑色"],
    popularity: 46,
    sales: 46,
    priceDrop: true,
    tags: ["人像", "雅顾光影", "骁龙8s"],
    officialUrl: "https://www.honor.com/cn/200-pro",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2999, pricePdd: 2749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 3499, pricePdd: 3199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.78, resolution: "2700×1224", refreshRate: 120, material: "OLED", type: "曲屏" },
    body: { height: 163.5, width: 75.5, thickness: 8.2, weight: 199, material: "塑料中框+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: true, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP65" }
  },

  // --- 三星 ---
  {
    id: "samsung-s24-plus",
    brand: "三星",
    model: "Galaxy S24+",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20S24%20Plus%20Amber%20Yellow.jpg",
    launchDate: "2024-01",
    colors: ["浅珀黄", "雅岩灰", "水墨黑", "秘矿紫"],
    popularity: 44,
    sales: 44,
    priceDrop: true,
    tags: ["大屏旗舰", "2K屏", "AI"],
    officialUrl: "https://www.samsung.com/cn/galaxy-s24-plus",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 5499, pricePdd: 5099, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" },
      { storage: "512GB", priceJd: 6499, pricePdd: 5999, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "3120×1440", refreshRate: 120, material: "OLED (LTPO)", type: "直屏" },
    body: { height: 158.5, width: 75.9, thickness: 7.7, weight: 196, material: "装甲铝+玻璃" },
    ram: "12GB",
    features: { expandableStorage: false, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 6E", bluetooth: "5.3", usb: "USB-C (USB 3.2)", waterproof: "IP68" }
  },
  {
    id: "samsung-a56",
    brand: "三星",
    model: "Galaxy A56 5G",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20A56%205G.jpg",
    launchDate: "2025-03",
    colors: ["浅蓝", "浅粉", "石墨黑", "橄榄绿"],
    popularity: 42,
    sales: 42,
    priceDrop: false,
    tags: ["中端", "AMOLED", "One UI"],
    officialUrl: "https://www.samsung.com/cn/galaxy-a56",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2999, pricePdd: 2749, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.7, resolution: "2340×1080", refreshRate: 120, material: "Super AMOLED", type: "直屏" },
    body: { height: 162.2, width: 77.5, thickness: 8.2, weight: 198, material: "塑料中框+玻璃" },
    ram: "8GB",
    features: { expandableStorage: true, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP67" }
  },
  {
    id: "samsung-a55",
    brand: "三星",
    model: "Galaxy A55 5G",
    image: "https://cdn.jsdelivr.net/gh/orcastor/phone_images@master/android/Samsung%20Galaxy%20A55.jpg",
    launchDate: "2024-03",
    colors: ["浅蓝", "浅紫", "石墨黑", "柠檬黄"],
    popularity: 40,
    sales: 40,
    priceDrop: true,
    tags: ["中端", "金属中框", "降价"],
    officialUrl: "https://www.samsung.com/cn/galaxy-a55",
    lastVerified: "2026-07-15",
    storageOptions: [
      { storage: "256GB", priceJd: 2399, pricePdd: 2199, shopTypeJd: "官方旗舰店", shopTypePdd: "品牌", couponNote: "" }
    ],
    defaultStorage: "256GB",
    screen: { size: 6.6, resolution: "2340×1080", refreshRate: 120, material: "Super AMOLED", type: "直屏" },
    body: { height: 161.1, width: 77.4, thickness: 8.2, weight: 213, material: "铝合金+玻璃" },
    ram: "8GB",
    features: { expandableStorage: true, dualSim: true, fiveG: true, nfc: true, infrared: false, esim: false, satellite: false, wifi: "Wi-Fi 6", bluetooth: "5.3", usb: "USB-C (USB 2.0)", waterproof: "IP67" }
  },

  {
    id: "oneplus-13",
    brand: "一加",
    model: "OnePlus 13",
    launchDate: "2024-12",
    colors: [
      "黑曜秘境",
      "蓝调时刻",
      "白露晨曦"
    ],
    popularity: 82,
    sales: 78,
    priceDrop: false,
    tags: [
      "旗舰性能",
      "2K屏",
      "长续航"
    ],
    officialUrl: "https://www.oneplus.com/cn/oneplus-13",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 3999,
        pricePdd: 3699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 4499,
        pricePdd: 4199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 5999,
        pricePdd: 5699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.82,
      resolution: "3168×1440",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "全等深微曲屏"
    },
    body: {
      height: 162.9,
      width: 76.5,
      thickness: 8.5,
      weight: 210,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP69"
    }
  },

  {
    id: "oneplus-ace5",
    brand: "一加",
    model: "OnePlus Ace 5",
    launchDate: "2024-12",
    colors: [
      "全速黑",
      "天青蓝",
      "钛金灰"
    ],
    popularity: 75,
    sales: 80,
    priceDrop: false,
    tags: [
      "性价比",
      "电竞",
      "长续航"
    ],
    officialUrl: "https://www.oneplus.com/cn/oneplus-ace-5",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 2499,
        pricePdd: 2299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 2999,
        pricePdd: 2799,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 3499,
        pricePdd: 3299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.78,
      resolution: "2780×1264",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 161.7,
      width: 75.3,
      thickness: 8.0,
      weight: 206,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP65"
    }
  },

  {
    id: "oneplus-ace5-pro",
    brand: "一加",
    model: "OnePlus Ace 5 Pro",
    launchDate: "2024-12",
    colors: [
      "星穹紫",
      "潜航黑",
      "白月光"
    ],
    popularity: 78,
    sales: 72,
    priceDrop: false,
    tags: [
      "旗舰芯",
      "电竞",
      "陶瓷"
    ],
    officialUrl: "https://www.oneplus.com/cn/oneplus-ace-5-pro",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 3399,
        pricePdd: 3199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 3999,
        pricePdd: 3699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 4699,
        pricePdd: 4399,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.78,
      resolution: "2780×1264",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 161.7,
      width: 75.3,
      thickness: 8.1,
      weight: 203,
      material: "金属中框+陶瓷"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP65"
    }
  },

  {
    id: "oneplus-13t",
    brand: "一加",
    model: "OnePlus 13T",
    launchDate: "2025-04",
    colors: [
      "怦然红",
      "云墨黑",
      "晨雾绿"
    ],
    popularity: 76,
    sales: 70,
    priceDrop: false,
    tags: [
      "小屏旗舰",
      "长续航",
      "旗舰芯"
    ],
    officialUrl: "https://www.oneplus.com/cn/oneplus-13t",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 3499,
        pricePdd: 3299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 3999,
        pricePdd: 3699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 4499,
        pricePdd: 4199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.32,
      resolution: "2640×1216",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 150.8,
      width: 72.0,
      thickness: 8.1,
      weight: 187,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP69"
    }
  },

  {
    id: "realme-gt7-pro",
    brand: "realme",
    model: "realme GT7 Pro",
    launchDate: "2024-11",
    colors: [
      "火星红",
      "星迹钛",
      "光域白"
    ],
    popularity: 74,
    sales: 73,
    priceDrop: false,
    tags: [
      "旗舰性能",
      "长续航",
      "潜望长焦"
    ],
    officialUrl: "https://www.realme.com/cn/realme-gt7-pro",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 3499,
        pricePdd: 3299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 3999,
        pricePdd: 3699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 4499,
        pricePdd: 4199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.78,
      resolution: "2780×1264",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "等深四曲屏"
    },
    body: {
      height: 162.5,
      width: 76.9,
      thickness: 8.6,
      weight: 222,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP69"
    }
  },

  {
    id: "realme-gt6",
    brand: "realme",
    model: "realme GT6",
    launchDate: "2024-07",
    colors: [
      "风暴紫",
      "光年白",
      "暗夜黑"
    ],
    popularity: 70,
    sales: 71,
    priceDrop: true,
    tags: [
      "性价比",
      "电竞屏",
      "快充"
    ],
    officialUrl: "https://www.realme.com/cn/realme-gt6",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 2099,
        pricePdd: 1899,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 2599,
        pricePdd: 2299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 3099,
        pricePdd: 2799,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.74,
      resolution: "2772×1240",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 162.0,
      width: 75.1,
      thickness: 8.4,
      weight: 199,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP65"
    }
  },

  {
    id: "realme-neo7",
    brand: "realme",
    model: "realme Neo7",
    launchDate: "2024-12",
    colors: [
      "陨石黑",
      "潜航蓝",
      "星舰绿"
    ],
    popularity: 72,
    sales: 75,
    priceDrop: false,
    tags: [
      "超大电池",
      "性价比",
      "电竞"
    ],
    officialUrl: "https://www.realme.com/cn/realme-neo7",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 2099,
        pricePdd: 1899,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 2499,
        pricePdd: 2299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 3099,
        pricePdd: 2799,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.78,
      resolution: "2780×1264",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 162.6,
      width: 76.7,
      thickness: 8.6,
      weight: 213,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP69"
    }
  },

  {
    id: "oppo-find-x8-ultra",
    brand: "OPPO",
    model: "OPPO Find X8 Ultra",
    launchDate: "2025-04",
    colors: [
      "月光白",
      "星野黑",
      "晨曦微光"
    ],
    popularity: 80,
    sales: 68,
    priceDrop: false,
    tags: [
      "影像旗舰",
      "2K屏",
      "长焦"
    ],
    officialUrl: "https://www.oppo.com/cn/smartphones/series-find-x/find-x8-ultra/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 6499,
        pricePdd: 6199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 6999,
        pricePdd: 6699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 7999,
        pricePdd: 7699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.82,
      resolution: "3168×1440",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 163.1,
      width: 76.8,
      thickness: 8.8,
      weight: 226,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP69"
    }
  },

  {
    id: "oppo-find-x8s",
    brand: "OPPO",
    model: "OPPO Find X8s",
    launchDate: "2025-04",
    colors: [
      "星野黑",
      "月光白",
      "海岛蓝"
    ],
    popularity: 76,
    sales: 66,
    priceDrop: false,
    tags: [
      "小屏旗舰",
      "轻薄",
      "影像"
    ],
    officialUrl: "https://www.oppo.com/cn/smartphones/series-find-x/find-x8s/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 4199,
        pricePdd: 3999,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 4699,
        pricePdd: 4499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 5499,
        pricePdd: 5199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.32,
      resolution: "2640×1216",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 150.6,
      width: 71.8,
      thickness: 7.8,
      weight: 179,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP69"
    }
  },

  {
    id: "vivo-x200s",
    brand: "vivo",
    model: "vivo X200s",
    launchDate: "2025-04",
    colors: [
      "简黑",
      "直白",
      "青松"
    ],
    popularity: 77,
    sales: 69,
    priceDrop: false,
    tags: [
      "直屏旗舰",
      "长续航",
      "影像"
    ],
    officialUrl: "https://www.vivo.com.cn/products/x200s",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 4199,
        pricePdd: 3999,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 4699,
        pricePdd: 4499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 5199,
        pricePdd: 4999,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.67,
      resolution: "2800×1260",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 160.0,
      width: 74.3,
      thickness: 7.95,
      weight: 203,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP69"
    }
  },

  {
    id: "vivo-x200-ultra",
    brand: "vivo",
    model: "vivo X200 Ultra",
    launchDate: "2025-04",
    colors: [
      "黑",
      "银",
      "红"
    ],
    popularity: 79,
    sales: 64,
    priceDrop: false,
    tags: [
      "影像机皇",
      "2K屏",
      "长焦"
    ],
    officialUrl: "https://www.vivo.com.cn/products/x200-ultra",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 6499,
        pricePdd: 6199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 6999,
        pricePdd: 6699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 7999,
        pricePdd: 7699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.82,
      resolution: "3168×1440",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "等深四曲屏"
    },
    body: {
      height: 163.3,
      width: 76.7,
      thickness: 8.9,
      weight: 229,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP69"
    }
  },

  {
    id: "honor-gt-pro",
    brand: "荣耀",
    model: "荣耀 GT Pro",
    launchDate: "2024-12",
    colors: [
      "幻夜黑",
      "冰晶白",
      "极光绿"
    ],
    popularity: 73,
    sales: 72,
    priceDrop: false,
    tags: [
      "电竞",
      "大电池",
      "旗舰芯"
    ],
    officialUrl: "https://www.honor.com/cn/phones/honor-gt-pro/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 3199,
        pricePdd: 2999,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 3699,
        pricePdd: 3499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 4299,
        pricePdd: 3999,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.78,
      resolution: "2800×1264",
      refreshRate: 144,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 162.8,
      width: 75.9,
      thickness: 8.6,
      weight: 219,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP69"
    }
  },

  {
    id: "redmi-turbo-4-pro",
    brand: "小米",
    model: "红米 Turbo 4 Pro",
    launchDate: "2025-04",
    colors: [
      "墨晶黑",
      "冰瓷白",
      "青刃"
    ],
    popularity: 78,
    sales: 82,
    priceDrop: false,
    tags: [
      "性价比",
      "超大电池",
      "金属中框"
    ],
    officialUrl: "https://www.mi.com/redmi-turbo4-pro",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 1999,
        pricePdd: 1799,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 2299,
        pricePdd: 2099,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 2799,
        pricePdd: 2599,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.83,
      resolution: "2772×1280",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "直屏"
    },
    body: {
      height: 164.0,
      width: 77.5,
      thickness: 8.1,
      weight: 208,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP68"
    }
  },

  {
    id: "xiaomi-civi-5-pro",
    brand: "小米",
    model: "小米 Civi 5 Pro",
    launchDate: "2025-05",
    colors: [
      "星云紫",
      "微风蓝",
      "偏爱粉",
      "月光白"
    ],
    popularity: 71,
    sales: 67,
    priceDrop: false,
    tags: [
      "轻薄自拍",
      "颜值",
      "长续航"
    ],
    officialUrl: "https://www.mi.com/civi5-pro",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 2999,
        pricePdd: 2799,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 3299,
        pricePdd: 3099,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 3799,
        pricePdd: 3499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.55,
      resolution: "2750×1236",
      refreshRate: 120,
      material: "LTPO AMOLED",
      type: "全等深微曲屏"
    },
    body: {
      height: 160.4,
      width: 73.2,
      thickness: 7.45,
      weight: 184,
      material: "金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 2.0)",
      waterproof: "IP68"
    }
  },

  {
    id: "iphone-17",
    brand: "苹果",
    model: "iPhone 17",
    launchDate: "2025-09",
    colors: [
      "黑色",
      "白色",
      "粉色",
      "薰衣草紫",
      "浅蓝"
    ],
    popularity: 95,
    sales: 98,
    priceDrop: false,
    tags: [
      "A19",
      "ProMotion",
      "轻薄"
    ],
    officialUrl: "https://www.apple.com.cn/iphone-17/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 5999,
        pricePdd: 5699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 7999,
        pricePdd: 7599,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.3,
      resolution: "2622×1206",
      refreshRate: 120,
      material: "OLED",
      type: "直屏"
    },
    body: {
      height: 149.6,
      width: 71.5,
      thickness: 7.95,
      weight: 177,
      material: "铝合金中框+玻璃"
    },
    ram: "8GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 2)",
      waterproof: "IP68"
    }
  },

  {
    id: "iphone-17-pro",
    brand: "苹果",
    model: "iPhone 17 Pro",
    launchDate: "2025-09",
    colors: [
      "深空黑",
      "银色",
      "宇宙橙"
    ],
    popularity: 96,
    sales: 96,
    priceDrop: false,
    tags: [
      "A19 Pro",
      "三摄",
      "ProMotion"
    ],
    officialUrl: "https://www.apple.com.cn/iphone-17-pro/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 8999,
        pricePdd: 8599,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 10999,
        pricePdd: 10499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 12999,
        pricePdd: 12499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.3,
      resolution: "2622×1206",
      refreshRate: 120,
      material: "OLED",
      type: "直屏"
    },
    body: {
      height: 149.6,
      width: 71.5,
      thickness: 8.75,
      weight: 204,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 3)",
      waterproof: "IP68"
    }
  },

  {
    id: "iphone-17-pro-max",
    brand: "苹果",
    model: "iPhone 17 Pro Max",
    launchDate: "2025-09",
    colors: [
      "深空黑",
      "银色",
      "宇宙橙"
    ],
    popularity: 97,
    sales: 97,
    priceDrop: false,
    tags: [
      "A19 Pro",
      "大屏",
      "长焦"
    ],
    officialUrl: "https://www.apple.com.cn/iphone-17-pro-max/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 9999,
        pricePdd: 9599,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 11999,
        pricePdd: 11499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 13999,
        pricePdd: 13499,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.9,
      resolution: "2868×1320",
      refreshRate: 120,
      material: "OLED",
      type: "直屏"
    },
    body: {
      height: 163.4,
      width: 78.0,
      thickness: 8.75,
      weight: 233,
      material: "铝合金中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: false,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      usb: "USB-C (USB 3)",
      waterproof: "IP68"
    }
  },

  {
    id: "samsung-s26",
    brand: "三星",
    model: "Samsung S26",
    launchDate: "2026-01",
    colors: [
      "秘矿黑",
      "星河蓝",
      "极光银"
    ],
    popularity: 85,
    sales: 80,
    priceDrop: false,
    tags: [
      "骁龙8 Elite Gen2",
      "小屏",
      "AI"
    ],
    officialUrl: "https://www.samsung.com/cn/smartphones/galaxy-s26/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 5999,
        pricePdd: 5699,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 6999,
        pricePdd: 6599,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.2,
      resolution: "2340×1080",
      refreshRate: 120,
      material: "Dynamic AMOLED 2X",
      type: "直屏"
    },
    body: {
      height: 146.9,
      width: 70.5,
      thickness: 7.2,
      weight: 172,
      material: "装甲铝中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: false,
      esim: true,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  },

  {
    id: "samsung-s26-ultra",
    brand: "三星",
    model: "Samsung S26 Ultra",
    launchDate: "2026-01",
    colors: [
      "秘矿黑",
      "星河银",
      "钛金灰"
    ],
    popularity: 90,
    sales: 85,
    priceDrop: false,
    tags: [
      "S Pen",
      "2亿像素",
      "AI"
    ],
    officialUrl: "https://www.samsung.com/cn/smartphones/galaxy-s26-ultra/",
    lastVerified: "2026-08-04",
    storageOptions: [
      {
        storage: "256GB",
        priceJd: 9699,
        pricePdd: 9299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "512GB",
        priceJd: 10699,
        pricePdd: 10299,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      },
      {
        storage: "1TB",
        priceJd: 12699,
        pricePdd: 12199,
        shopTypeJd: "官方旗舰店",
        shopTypePdd: "品牌",
        couponNote: ""
      }
    ],
    defaultStorage: "256GB",
    screen: {
      size: 6.9,
      resolution: "3120×1440",
      refreshRate: 120,
      material: "Dynamic AMOLED 2X",
      type: "直屏"
    },
    body: {
      height: 162.8,
      width: 77.6,
      thickness: 8.2,
      weight: 232,
      material: "钛金属中框+玻璃"
    },
    ram: "12GB",
    features: {
      expandableStorage: false,
      dualSim: true,
      fiveG: true,
      nfc: true,
      infrared: true,
      esim: true,
      satellite: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usb: "USB-C (USB 3.2)",
      waterproof: "IP68"
    }
  }
];

const BRANDS = ["苹果", "华为", "小米", "vivo", "OPPO", "荣耀", "三星"];

// 获取手机默认价格（取京东和拼多多中较低者）
function getDefaultPrice(phone, storage) {
  const opt = phone.storageOptions.find(o => o.storage === storage) || phone.storageOptions[0];
  return Math.min(opt.priceJd, opt.pricePdd);
}

function getPhonePrice(phone, storage, platform) {
  const opt = phone.storageOptions.find(o => o.storage === storage) || phone.storageOptions[0];
  if (!opt) return null;
  return platform === 'jd' ? opt.priceJd : opt.pricePdd;
}

function getPriceSource(phone, storage) {
  const opt = phone.storageOptions.find(o => o.storage === storage) || phone.storageOptions[0];
  if (!opt) return { platform: '', price: 0 };
  if (opt.pricePdd < opt.priceJd) {
    return { platform: '拼多多', price: opt.pricePdd, shopType: opt.shopTypePdd, couponNote: opt.couponNote };
  }
  return { platform: '京东', price: opt.priceJd, shopType: opt.shopTypeJd, couponNote: opt.couponNote };
}

function getPriceRange(phone, storage) {
  const price = getDefaultPrice(phone, storage);
  for (const range of PRICE_RANGES) {
    if (price >= range.min && price < range.max) return range.label;
  }
  return PRICE_RANGES[PRICE_RANGES.length - 1].label;
}
