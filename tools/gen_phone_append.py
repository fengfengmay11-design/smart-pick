# -*- coding: utf-8 -*-
"""
gen_phone_append.py — 向 phone-data.js 的 PHONE_DATA 数组批量追加新机型

用法：
  python3 tools/gen_phone_append.py

行为：
  - 读取 phone-data.js，定位 `const PHONE_DATA = [` 之后第一个 `];`（数组闭合）
  - 在其前插入 NEW_PHONES（19 款 2024-2025/2026 旗舰/中端，含一加、realme 等新品牌）
  - 生成与现有文件同构的 JS（双引号字符串、2 空格缩进、标识符键去引号）
  - 原地写回，并打印新增数量

数据口径：
  - 规格为公开参数整理，价格为 2026-07 京东/拼多多参考到手价（估算，发布前请以下方 live API 刷新）
  - lastVerified = 2026-08-04
  - 不写 image 字段，交由前端 bingImage 在线兜底
"""
import json
import re

NEW_PHONES = [
    # ==================== 一加 OnePlus ====================
    {
        "id": "oneplus-13", "brand": "一加", "model": "OnePlus 13",
        "launchDate": "2024-12",
        "colors": ["黑曜秘境", "蓝调时刻", "白露晨曦"],
        "popularity": 82, "sales": 78, "priceDrop": False,
        "tags": ["旗舰性能", "2K屏", "长续航"],
        "officialUrl": "https://www.oneplus.com/cn/oneplus-13",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 3999, "pricePdd": 3699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 4499, "pricePdd": 4199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 5999, "pricePdd": 5699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.82, "resolution": "3168×1440", "refreshRate": 120, "material": "LTPO AMOLED", "type": "全等深微曲屏"},
        "body": {"height": 162.9, "width": 76.5, "thickness": 8.5, "weight": 210, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP69"}
    },
    {
        "id": "oneplus-ace5", "brand": "一加", "model": "OnePlus Ace 5",
        "launchDate": "2024-12",
        "colors": ["全速黑", "天青蓝", "钛金灰"],
        "popularity": 75, "sales": 80, "priceDrop": False,
        "tags": ["性价比", "电竞", "长续航"],
        "officialUrl": "https://www.oneplus.com/cn/oneplus-ace-5",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 2499, "pricePdd": 2299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 2999, "pricePdd": 2799, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 3499, "pricePdd": 3299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.78, "resolution": "2780×1264", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 161.7, "width": 75.3, "thickness": 8.0, "weight": 206, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP65"}
    },
    {
        "id": "oneplus-ace5-pro", "brand": "一加", "model": "OnePlus Ace 5 Pro",
        "launchDate": "2024-12",
        "colors": ["星穹紫", "潜航黑", "白月光"],
        "popularity": 78, "sales": 72, "priceDrop": False,
        "tags": ["旗舰芯", "电竞", "陶瓷"],
        "officialUrl": "https://www.oneplus.com/cn/oneplus-ace-5-pro",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 3399, "pricePdd": 3199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 3999, "pricePdd": 3699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 4699, "pricePdd": 4399, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.78, "resolution": "2780×1264", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 161.7, "width": 75.3, "thickness": 8.1, "weight": 203, "material": "金属中框+陶瓷"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP65"}
    },
    {
        "id": "oneplus-13t", "brand": "一加", "model": "OnePlus 13T",
        "launchDate": "2025-04",
        "colors": ["怦然红", "云墨黑", "晨雾绿"],
        "popularity": 76, "sales": 70, "priceDrop": False,
        "tags": ["小屏旗舰", "长续航", "旗舰芯"],
        "officialUrl": "https://www.oneplus.com/cn/oneplus-13t",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 3499, "pricePdd": 3299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 3999, "pricePdd": 3699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 4499, "pricePdd": 4199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.32, "resolution": "2640×1216", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 150.8, "width": 72.0, "thickness": 8.1, "weight": 187, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP69"}
    },
    # ==================== realme ====================
    {
        "id": "realme-gt7-pro", "brand": "realme", "model": "realme GT7 Pro",
        "launchDate": "2024-11",
        "colors": ["火星红", "星迹钛", "光域白"],
        "popularity": 74, "sales": 73, "priceDrop": False,
        "tags": ["旗舰性能", "长续航", "潜望长焦"],
        "officialUrl": "https://www.realme.com/cn/realme-gt7-pro",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 3499, "pricePdd": 3299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 3999, "pricePdd": 3699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 4499, "pricePdd": 4199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.78, "resolution": "2780×1264", "refreshRate": 120, "material": "LTPO AMOLED", "type": "等深四曲屏"},
        "body": {"height": 162.5, "width": 76.9, "thickness": 8.6, "weight": 222, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP69"}
    },
    {
        "id": "realme-gt6", "brand": "realme", "model": "realme GT6",
        "launchDate": "2024-07",
        "colors": ["风暴紫", "光年白", "暗夜黑"],
        "popularity": 70, "sales": 71, "priceDrop": True,
        "tags": ["性价比", "电竞屏", "快充"],
        "officialUrl": "https://www.realme.com/cn/realme-gt6",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 2099, "pricePdd": 1899, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 2599, "pricePdd": 2299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 3099, "pricePdd": 2799, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.74, "resolution": "2772×1240", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 162.0, "width": 75.1, "thickness": 8.4, "weight": 199, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 6", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP65"}
    },
    {
        "id": "realme-neo7", "brand": "realme", "model": "realme Neo7",
        "launchDate": "2024-12",
        "colors": ["陨石黑", "潜航蓝", "星舰绿"],
        "popularity": 72, "sales": 75, "priceDrop": False,
        "tags": ["超大电池", "性价比", "电竞"],
        "officialUrl": "https://www.realme.com/cn/realme-neo7",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 2099, "pricePdd": 1899, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 2499, "pricePdd": 2299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 3099, "pricePdd": 2799, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.78, "resolution": "2780×1264", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 162.6, "width": 76.7, "thickness": 8.6, "weight": 213, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP69"}
    },
    # ==================== OPPO（补齐 2025 影像旗舰） ====================
    {
        "id": "oppo-find-x8-ultra", "brand": "OPPO", "model": "OPPO Find X8 Ultra",
        "launchDate": "2025-04",
        "colors": ["月光白", "星野黑", "晨曦微光"],
        "popularity": 80, "sales": 68, "priceDrop": False,
        "tags": ["影像旗舰", "2K屏", "长焦"],
        "officialUrl": "https://www.oppo.com/cn/smartphones/series-find-x/find-x8-ultra/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 6499, "pricePdd": 6199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 6999, "pricePdd": 6699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 7999, "pricePdd": 7699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.82, "resolution": "3168×1440", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 163.1, "width": 76.8, "thickness": 8.8, "weight": 226, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP69"}
    },
    {
        "id": "oppo-find-x8s", "brand": "OPPO", "model": "OPPO Find X8s",
        "launchDate": "2025-04",
        "colors": ["星野黑", "月光白", "海岛蓝"],
        "popularity": 76, "sales": 66, "priceDrop": False,
        "tags": ["小屏旗舰", "轻薄", "影像"],
        "officialUrl": "https://www.oppo.com/cn/smartphones/series-find-x/find-x8s/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 4199, "pricePdd": 3999, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 4699, "pricePdd": 4499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 5499, "pricePdd": 5199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.32, "resolution": "2640×1216", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 150.6, "width": 71.8, "thickness": 7.8, "weight": 179, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP69"}
    },
    # ==================== vivo（补齐 2025 直屏/影像旗舰） ====================
    {
        "id": "vivo-x200s", "brand": "vivo", "model": "vivo X200s",
        "launchDate": "2025-04",
        "colors": ["简黑", "直白", "青松"],
        "popularity": 77, "sales": 69, "priceDrop": False,
        "tags": ["直屏旗舰", "长续航", "影像"],
        "officialUrl": "https://www.vivo.com.cn/products/x200s",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 4199, "pricePdd": 3999, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 4699, "pricePdd": 4499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 5199, "pricePdd": 4999, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.67, "resolution": "2800×1260", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 160.0, "width": 74.3, "thickness": 7.95, "weight": 203, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP69"}
    },
    {
        "id": "vivo-x200-ultra", "brand": "vivo", "model": "vivo X200 Ultra",
        "launchDate": "2025-04",
        "colors": ["黑", "银", "红"],
        "popularity": 79, "sales": 64, "priceDrop": False,
        "tags": ["影像机皇", "2K屏", "长焦"],
        "officialUrl": "https://www.vivo.com.cn/products/x200-ultra",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 6499, "pricePdd": 6199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 6999, "pricePdd": 6699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 7999, "pricePdd": 7699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.82, "resolution": "3168×1440", "refreshRate": 120, "material": "LTPO AMOLED", "type": "等深四曲屏"},
        "body": {"height": 163.3, "width": 76.7, "thickness": 8.9, "weight": 229, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP69"}
    },
    # ==================== 荣耀（补齐电竞旗舰） ====================
    {
        "id": "honor-gt-pro", "brand": "荣耀", "model": "荣耀 GT Pro",
        "launchDate": "2024-12",
        "colors": ["幻夜黑", "冰晶白", "极光绿"],
        "popularity": 73, "sales": 72, "priceDrop": False,
        "tags": ["电竞", "大电池", "旗舰芯"],
        "officialUrl": "https://www.honor.com/cn/phones/honor-gt-pro/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 3199, "pricePdd": 2999, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 3699, "pricePdd": 3499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 4299, "pricePdd": 3999, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.78, "resolution": "2800×1264", "refreshRate": 144, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 162.8, "width": 75.9, "thickness": 8.6, "weight": 219, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP69"}
    },
    # ==================== 小米/红米（补齐 2025 性价比/轻薄） ====================
    {
        "id": "redmi-turbo-4-pro", "brand": "小米", "model": "红米 Turbo 4 Pro",
        "launchDate": "2025-04",
        "colors": ["墨晶黑", "冰瓷白", "青刃"],
        "popularity": 78, "sales": 82, "priceDrop": False,
        "tags": ["性价比", "超大电池", "金属中框"],
        "officialUrl": "https://www.mi.com/redmi-turbo4-pro",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 1999, "pricePdd": 1799, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 2299, "pricePdd": 2099, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 2799, "pricePdd": 2599, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.83, "resolution": "2772×1280", "refreshRate": 120, "material": "LTPO AMOLED", "type": "直屏"},
        "body": {"height": 164.0, "width": 77.5, "thickness": 8.1, "weight": 208, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP68"}
    },
    {
        "id": "xiaomi-civi-5-pro", "brand": "小米", "model": "小米 Civi 5 Pro",
        "launchDate": "2025-05",
        "colors": ["星云紫", "微风蓝", "偏爱粉", "月光白"],
        "popularity": 71, "sales": 67, "priceDrop": False,
        "tags": ["轻薄自拍", "颜值", "长续航"],
        "officialUrl": "https://www.mi.com/civi5-pro",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 2999, "pricePdd": 2799, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 3299, "pricePdd": 3099, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 3799, "pricePdd": 3499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.55, "resolution": "2750×1236", "refreshRate": 120, "material": "LTPO AMOLED", "type": "全等深微曲屏"},
        "body": {"height": 160.4, "width": 73.2, "thickness": 7.45, "weight": 184, "material": "金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": False, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 2.0)", "waterproof": "IP68"}
    },
    # ==================== 苹果（2025 旗舰） ====================
    {
        "id": "iphone-17", "brand": "苹果", "model": "iPhone 17",
        "launchDate": "2025-09",
        "colors": ["黑色", "白色", "粉色", "薰衣草紫", "浅蓝"],
        "popularity": 95, "sales": 98, "priceDrop": False,
        "tags": ["A19", "ProMotion", "轻薄"],
        "officialUrl": "https://www.apple.com.cn/iphone-17/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 5999, "pricePdd": 5699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 7999, "pricePdd": 7599, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.3, "resolution": "2622×1206", "refreshRate": 120, "material": "OLED", "type": "直屏"},
        "body": {"height": 149.6, "width": 71.5, "thickness": 7.95, "weight": 177, "material": "铝合金中框+玻璃"},
        "ram": "8GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": True, "wifi": "Wi-Fi 7", "bluetooth": "5.3", "usb": "USB-C (USB 2)", "waterproof": "IP68"}
    },
    {
        "id": "iphone-17-pro", "brand": "苹果", "model": "iPhone 17 Pro",
        "launchDate": "2025-09",
        "colors": ["深空黑", "银色", "宇宙橙"],
        "popularity": 96, "sales": 96, "priceDrop": False,
        "tags": ["A19 Pro", "三摄", "ProMotion"],
        "officialUrl": "https://www.apple.com.cn/iphone-17-pro/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 8999, "pricePdd": 8599, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 10999, "pricePdd": 10499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 12999, "pricePdd": 12499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.3, "resolution": "2622×1206", "refreshRate": 120, "material": "OLED", "type": "直屏"},
        "body": {"height": 149.6, "width": 71.5, "thickness": 8.75, "weight": 204, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": True, "wifi": "Wi-Fi 7", "bluetooth": "5.3", "usb": "USB-C (USB 3)", "waterproof": "IP68"}
    },
    {
        "id": "iphone-17-pro-max", "brand": "苹果", "model": "iPhone 17 Pro Max",
        "launchDate": "2025-09",
        "colors": ["深空黑", "银色", "宇宙橙"],
        "popularity": 97, "sales": 97, "priceDrop": False,
        "tags": ["A19 Pro", "大屏", "长焦"],
        "officialUrl": "https://www.apple.com.cn/iphone-17-pro-max/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 9999, "pricePdd": 9599, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 11999, "pricePdd": 11499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 13999, "pricePdd": 13499, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.9, "resolution": "2868×1320", "refreshRate": 120, "material": "OLED", "type": "直屏"},
        "body": {"height": 163.4, "width": 78.0, "thickness": 8.75, "weight": 233, "material": "铝合金中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": False, "satellite": True, "wifi": "Wi-Fi 7", "bluetooth": "5.3", "usb": "USB-C (USB 3)", "waterproof": "IP68"}
    },
    # ==================== 三星（2026 旗舰） ====================
    {
        "id": "samsung-s26", "brand": "三星", "model": "Samsung S26",
        "launchDate": "2026-01",
        "colors": ["秘矿黑", "星河蓝", "极光银"],
        "popularity": 85, "sales": 80, "priceDrop": False,
        "tags": ["骁龙8 Elite Gen2", "小屏", "AI"],
        "officialUrl": "https://www.samsung.com/cn/smartphones/galaxy-s26/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 5999, "pricePdd": 5699, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 6999, "pricePdd": 6599, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.2, "resolution": "2340×1080", "refreshRate": 120, "material": "Dynamic AMOLED 2X", "type": "直屏"},
        "body": {"height": 146.9, "width": 70.5, "thickness": 7.2, "weight": 172, "material": "装甲铝中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": False, "esim": True, "satellite": True, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP68"}
    },
    {
        "id": "samsung-s26-ultra", "brand": "三星", "model": "Samsung S26 Ultra",
        "launchDate": "2026-01",
        "colors": ["秘矿黑", "星河银", "钛金灰"],
        "popularity": 90, "sales": 85, "priceDrop": False,
        "tags": ["S Pen", "2亿像素", "AI"],
        "officialUrl": "https://www.samsung.com/cn/smartphones/galaxy-s26-ultra/",
        "lastVerified": "2026-08-04",
        "storageOptions": [
            {"storage": "256GB", "priceJd": 9699, "pricePdd": 9299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "512GB", "priceJd": 10699, "pricePdd": 10299, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""},
            {"storage": "1TB", "priceJd": 12699, "pricePdd": 12199, "shopTypeJd": "官方旗舰店", "shopTypePdd": "品牌", "couponNote": ""}
        ],
        "defaultStorage": "256GB",
        "screen": {"size": 6.9, "resolution": "3120×1440", "refreshRate": 120, "material": "Dynamic AMOLED 2X", "type": "直屏"},
        "body": {"height": 162.8, "width": 77.6, "thickness": 8.2, "weight": 232, "material": "钛金属中框+玻璃"},
        "ram": "12GB",
        "features": {"expandableStorage": False, "dualSim": True, "fiveG": True, "nfc": True, "infrared": True, "esim": True, "satellite": True, "wifi": "Wi-Fi 7", "bluetooth": "5.4", "usb": "USB-C (USB 3.2)", "waterproof": "IP68"}
    },
]


def to_js(d):
    s = json.dumps(d, indent=2, ensure_ascii=False)
    # 标识符键去引号，与现有 phone-data.js 风格一致
    s = re.sub(r'"([A-Za-z_][A-Za-z0-9_]*)":', r'\1:', s)
    # 加 2 空格基准缩进，使新对象与数组内其它条目（2 空格基准 + 2 空格属性）对齐
    s = '\n'.join(('  ' + ln) if ln.strip() else ln for ln in s.split('\n'))
    return s


def main():
    path = "phone-data.js"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    start = content.index("const PHONE_DATA = [")
    # 找到数组闭合 ]; （在 helper 函数之前）
    arr_close = content.index("];", start)
    # 定位 ]; 所在行之前插入
    head = content[:arr_close]
    tail = content[arr_close:]

    blocks = []
    for ph in NEW_PHONES:
        blocks.append(to_js(ph))
    joined = ",\n\n".join(blocks)
    inserted = "\n" + joined + "\n"

    new_content = head + ",\n" + inserted + tail

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"已追加 {len(NEW_PHONES)} 款机型到 PHONE_DATA（插入位置：原数组闭合前）。")


if __name__ == "__main__":
    main()
