#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
品类扩充脚本 —— 给 5 个新品类追加产品，把每类做到 20+ 款

工作方式（沿用现有管道，不绕过校验）：
    本脚本 → 追加行到 tools/templates/<cat>.csv → import_csv.py 校验并生成 data-<cat>.js

用法：
    python tools/expand_catalog.py            # 追加并自动调用 import_csv.py
    python tools/expand_catalog.py --csv-only # 只写 CSV，不生成 js

数据口径：
    规格为公开参数整理；价格为 2026-07 京东/拼多多参考到手价估算，
    lastVerified 统一 2026-08-05。正式对外前建议用 server/ 的价格刷新层刷新。
"""

import argparse
import csv
import io
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TPL = os.path.join(ROOT, "tools", "templates")
VERIFIED = "2026-08-05"

PY = sys.executable

# 品类 -> (CSV 文件名, JS 输出名, JS 常量名)
CATS = {
    "tablet":   ("tablet.csv",   "data-tablet.js",   "TABLET_DATA"),
    "camera":   ("camera.csv",   "data-camera.js",   "CAMERA_DATA"),
    "tv":       ("tv.csv",       "data-tv.js",       "TV_DATA"),
    "watch":    ("watch.csv",    "data-watch.js",    "WATCH_DATA"),
    "keyboard": ("keyboard.csv", "data-keyboard.js", "KEYBOARD_DATA"),
}


def row(pid, brand, model, launch, pop, sales, drop, jd, pdd, specs, tags):
    """构造一行 CSV dict。specs 传 dict，tags 传 list。"""
    return {
        "id": pid, "brand": brand, "model": model, "image": "",
        "launchDate": launch, "popularity": pop, "sales": sales,
        "priceDrop": "True" if drop else "False",
        "price_jd": jd, "price_pdd": pdd,
        "specs": json.dumps(specs, ensure_ascii=False),
        "tags": ";".join(tags), "officialUrl": "", "lastVerified": VERIFIED,
    }


# ==================== 平板 +17（7 → 24）====================
def sp_tab(size, res, chip, ram, sto, bat, wt, hz):
    return {"size": size, "resolution": res, "chip": chip, "ram": ram,
            "storage": sto, "battery": bat, "weight": wt, "refreshRate": hz}


TABLET_NEW = [
    row("ipad-pro-11-m4", "苹果", "iPad Pro 11 (M4)", "2024-05", 92, 80, False, 7999, 7699,
        sp_tab("11英寸", "2420x1668 OLED", "Apple M4", "8GB", "256GB", "约10小时", "444g", "120Hz"),
        ["M4", "OLED", "轻薄"]),
    row("ipad-air-13-m2", "苹果", "iPad Air 13 (M2)", "2024-05", 84, 74, False, 6799, 6299,
        sp_tab("13英寸", "2732x2048", "Apple M2", "8GB", "128GB", "约10小时", "617g", "60Hz"),
        ["M2", "大屏"]),
    row("ipad-mini-7", "苹果", "iPad mini 7", "2024-10", 80, 72, False, 3999, 3799,
        sp_tab("8.3英寸", "2266x1488", "A17 Pro", "8GB", "128GB", "约10小时", "293g", "60Hz"),
        ["小巧", "单手持"]),
    row("ipad-10", "苹果", "iPad (第10代)", "2022-10", 76, 78, True, 2999, 2599,
        sp_tab("10.9英寸", "2360x1640", "A14", "4GB", "64GB", "约10小时", "477g", "60Hz"),
        ["入门", "降价"]),
    row("huawei-matepad-115s", "华为", "MatePad 11.5 S", "2024-05", 78, 72, False, 2799, 2599,
        sp_tab("11.5英寸", "2800x1840", "骁龙8+", "8GB", "128GB", "8800mAh", "510g", "144Hz"),
        ["鸿蒙", "柔光屏", "144Hz"]),
    row("huawei-matepad-air-115", "华为", "MatePad Air 11.5", "2023-05", 70, 66, True, 2299, 2099,
        sp_tab("11.5英寸", "2800x1840", "骁龙888", "8GB", "128GB", "8300mAh", "508g", "144Hz"),
        ["鸿蒙", "轻薄"]),
    row("huawei-matepad-se-11", "华为", "MatePad SE 11", "2024-03", 58, 62, False, 1199, 1099,
        sp_tab("11英寸", "1920x1200", "骁龙680", "6GB", "128GB", "7700mAh", "479g", "60Hz"),
        ["入门", "护眼"]),
    row("xiaomi-pad-7-pro", "小米", "平板7 Pro", "2024-11", 90, 84, False, 2799, 2599,
        sp_tab("11.2英寸", "3200x2136", "骁龙8s Gen3", "8GB", "256GB", "8850mAh", "500g", "144Hz"),
        ["高刷", "性价比", "3.2K"]),
    row("xiaomi-pad-7", "小米", "平板7", "2024-11", 86, 86, False, 1999, 1899,
        sp_tab("11.2英寸", "3200x2136", "骁龙7+ Gen3", "8GB", "128GB", "8850mAh", "500g", "144Hz"),
        ["性价比", "3.2K"]),
    row("redmi-pad-pro", "小米", "Redmi Pad Pro", "2024-05", 72, 80, False, 1499, 1349,
        sp_tab("12.1英寸", "2560x1600", "骁龙7s Gen2", "6GB", "128GB", "10000mAh", "571g", "120Hz"),
        ["大电池", "千元档"]),
    row("samsung-tab-s10-plus", "三星", "Galaxy Tab S10+", "2024-10", 74, 58, False, 7199, 6699,
        sp_tab("12.4英寸", "2800x1752 AMOLED", "天玑9300+", "12GB", "256GB", "10090mAh", "571g", "120Hz"),
        ["AMOLED", "旗舰"]),
    row("samsung-tab-s9-fe", "三星", "Galaxy Tab S9 FE", "2023-10", 60, 56, True, 2999, 2699,
        sp_tab("10.9英寸", "2304x1440", "Exynos 1380", "6GB", "128GB", "8000mAh", "523g", "90Hz"),
        ["防水", "手写笔"]),
    row("honor-padv9", "荣耀", "平板V9", "2024-07", 68, 66, False, 2299, 2099,
        sp_tab("11.5英寸", "2800x1840", "天玑8300", "8GB", "256GB", "8300mAh", "475g", "144Hz"),
        ["轻薄", "高刷"]),
    row("honor-pad-x9", "荣耀", "平板X9", "2023-08", 54, 64, True, 1099, 999,
        sp_tab("11.5英寸", "2000x1200", "骁龙685", "6GB", "128GB", "8300mAh", "495g", "120Hz"),
        ["入门", "大电池"]),
    row("lenovo-yoga-pad-pro-145", "联想", "YOGA Pad Pro 14.5", "2024-04", 62, 52, False, 3299, 2999,
        sp_tab("14.5英寸", "3000x1876 OLED", "天玑9000", "12GB", "256GB", "10200mAh", "740g", "120Hz"),
        ["超大屏", "OLED", "影音"]),
    row("oppo-pad3-pro", "OPPO", "Pad 3 Pro", "2024-08", 66, 58, False, 3699, 3399,
        sp_tab("13.2英寸", "3392x2400", "骁龙8 Gen3", "12GB", "256GB", "9520mAh", "675g", "144Hz"),
        ["旗舰芯", "大屏"]),
    row("vivo-pad3-pro", "vivo", "Pad3 Pro", "2024-05", 64, 56, False, 3299, 2999,
        sp_tab("13英寸", "3096x2064", "天玑9300", "8GB", "256GB", "11500mAh", "675g", "144Hz"),
        ["超大电池", "大屏"]),
]

# ==================== 相机 +18（6 → 24）====================
def sp_cam(sensor, res, video, mount, ibis, weight, screen):
    return {"sensor": sensor, "resolution": res, "video": video, "mount": mount,
            "ibis": ibis, "weight": weight, "screen": screen}


CAMERA_NEW = [
    row("sony-a7cii", "索尼", "Alpha 7C II (A7C2)", "2023-08", 88, 74, False, 15499, 14699,
        sp_cam("全画幅", "3300万", "4K60", "E卡口", "五轴防抖", "514g", "3英寸翻转屏"),
        ["全画幅", "轻便", "旅拍"]),
    row("sony-a7rv", "索尼", "Alpha 7R V (A7R5)", "2022-10", 82, 48, False, 25999, 24999,
        sp_cam("全画幅", "6100万", "8K24", "E卡口", "五轴防抖", "723g", "3.2英寸四轴屏"),
        ["高像素", "风光", "旗舰"]),
    row("sony-a6700", "索尼", "Alpha 6700 (A6700)", "2023-07", 84, 70, False, 10499, 9899,
        sp_cam("APS-C", "2600万", "4K120", "E卡口", "五轴防抖", "493g", "3英寸翻转屏"),
        ["APS-C", "视频", "AI对焦"]),
    row("sony-zv1m2", "索尼", "ZV-1 II", "2023-05", 70, 66, True, 5299, 4799,
        sp_cam("1英寸", "2010万", "4K30", "固定镜头", "电子防抖", "292g", "3英寸翻转屏"),
        ["Vlog", "口袋机", "广角"]),
    row("sony-a1", "索尼", "Alpha 1 (A1)", "2021-01", 76, 30, False, 42999, 41599,
        sp_cam("全画幅", "5010万", "8K30", "E卡口", "五轴防抖", "737g", "3英寸翻转屏"),
        ["旗舰", "高速连拍", "8K"]),
    row("canon-r5ii", "佳能", "EOS R5 Mark II", "2024-07", 90, 52, False, 25999, 25299,
        sp_cam("全画幅", "4500万", "8K60", "RF卡口", "五轴防抖", "656g", "3.2英寸翻转屏"),
        ["旗舰", "8K", "高像素"]),
    row("canon-r8", "佳能", "EOS R8", "2023-02", 78, 72, False, 9999, 9399,
        sp_cam("全画幅", "2420万", "4K60", "RF卡口", "无机身防抖", "461g", "3英寸翻转屏"),
        ["全画幅", "轻便", "入门"]),
    row("canon-r7", "佳能", "EOS R7", "2022-05", 74, 68, True, 8999, 8299,
        sp_cam("APS-C", "3250万", "4K60", "RF卡口", "五轴防抖", "612g", "3英寸翻转屏"),
        ["APS-C", "打鸟", "连拍"]),
    row("canon-r100", "佳能", "EOS R100", "2023-05", 58, 74, True, 3499, 3199,
        sp_cam("APS-C", "2410万", "4K24", "RF卡口", "无机身防抖", "356g", "3英寸固定屏"),
        ["入门", "轻便", "学生"]),
    row("nikon-z8", "尼康", "Z8", "2023-05", 86, 46, False, 24999, 23999,
        sp_cam("全画幅", "4571万", "8K60", "Z卡口", "五轴防抖", "910g", "3.2英寸翻转屏"),
        ["旗舰", "8K", "无黑视"]),
    row("nikon-zf", "尼康", "Zf", "2023-09", 80, 58, False, 14999, 14299,
        sp_cam("全画幅", "2450万", "4K60", "Z卡口", "五轴防抖", "710g", "3.2英寸翻转屏"),
        ["复古", "全画幅", "手感"]),
    row("nikon-z50ii", "尼康", "Z50 II", "2024-11", 72, 66, False, 6799, 6399,
        sp_cam("APS-C", "2088万", "4K60", "Z卡口", "电子防抖", "550g", "3.2英寸翻转屏"),
        ["入门", "轻便", "视频"]),
    row("fujifilm-xs20", "富士", "X-S20", "2023-05", 82, 76, False, 9499, 8999,
        sp_cam("APS-C", "2610万", "6K30", "X卡口", "五轴防抖", "491g", "3英寸翻转屏"),
        ["胶片模拟", "Vlog", "防抖"]),
    row("fujifilm-xt50", "富士", "X-T50", "2024-05", 80, 68, False, 10499, 9899,
        sp_cam("APS-C", "4020万", "6K30", "X卡口", "五轴防抖", "438g", "3英寸翻转屏"),
        ["胶片模拟", "高像素", "轻便"]),
    row("fujifilm-x100vi", "富士", "X100VI", "2024-02", 94, 40, False, 13999, 13999,
        sp_cam("APS-C", "4020万", "6K30", "固定镜头", "五轴防抖", "521g", "3英寸翻转屏"),
        ["旁轴", "扫街", "一机一镜"]),
    row("fujifilm-xh2s", "富士", "X-H2S", "2022-05", 70, 40, True, 16999, 15999,
        sp_cam("APS-C", "2616万", "6K30", "X卡口", "五轴防抖", "660g", "3英寸翻转屏"),
        ["高速连拍", "视频旗舰"]),
    row("panasonic-s5ii", "松下", "LUMIX S5 II", "2023-01", 68, 44, False, 12999, 12299,
        sp_cam("全画幅", "2420万", "6K30", "L卡口", "五轴防抖", "740g", "3英寸翻转屏"),
        ["视频", "相位对焦", "无过热"]),
    row("panasonic-g9m2", "松下", "LUMIX G9 II", "2023-09", 60, 36, False, 11499, 10999,
        sp_cam("M4/3", "2520万", "5.8K30", "M4/3卡口", "五轴防抖", "658g", "3英寸翻转屏"),
        ["M43", "连拍", "生态"]),
]

# ==================== 电视 +18（6 → 24）====================
def sp_tv(size, res, panel, hz, hdr, bright, sound, sys_):
    return {"size": size, "resolution": res, "panel": panel, "refreshRate": hz,
            "hdr": hdr, "brightness": bright, "sound": sound, "system": sys_}


TV_NEW = [
    row("xiaomi-tv-s-75", "小米", "电视S 75", "2024-03", 84, 86, False, 3999, 3699,
        sp_tv("75英寸", "4K", "VA", "120Hz", "HDR10+", "500nit", "30W", "澎湃OS"),
        ["大屏", "性价比", "120Hz"]),
    row("xiaomi-tv-es-55", "小米", "电视ES 55", "2023-04", 62, 78, True, 1899, 1699,
        sp_tv("55英寸", "4K", "VA", "60Hz", "HDR10", "300nit", "20W", "MIUI TV"),
        ["入门", "小屏"]),
    row("redmi-tv-x-65", "小米", "Redmi X 2024 65", "2024-01", 70, 84, False, 2499, 2299,
        sp_tv("65英寸", "4K", "VA", "120Hz", "HDR10+", "400nit", "24W", "澎湃OS"),
        ["性价比", "120Hz"]),
    row("hisense-e5n-65", "海信", "E5N 65", "2024-03", 76, 88, False, 3299, 2999,
        sp_tv("65英寸", "4K", "ULED", "144Hz", "HDR10+", "800nit", "30W", "VIDAA"),
        ["ULED", "高刷", "性价比"]),
    row("hisense-u7n-75", "海信", "U7N 75", "2024-04", 82, 70, False, 7499, 6999,
        sp_tv("75英寸", "4K", "ULED Mini LED", "144Hz", "杜比视界", "1500nit", "60W", "VIDAA"),
        ["MiniLED", "高亮度", "游戏"]),
    row("hisense-e8n-65", "海信", "E8N 65", "2024-05", 80, 68, False, 5499, 4999,
        sp_tv("65英寸", "4K", "ULED Mini LED", "144Hz", "杜比视界", "1600nit", "60W", "VIDAA"),
        ["MiniLED", "画质", "分区背光"]),
    row("tcl-t7k-65", "TCL", "T7K 65", "2024-03", 78, 82, False, 3799, 3499,
        sp_tv("65英寸", "4K", "Mini LED", "144Hz", "HDR10+", "1000nit", "30W", "灵控桌面"),
        ["MiniLED", "性价比", "高刷"]),
    row("tcl-c11g-75", "TCL", "C11G 75", "2024-05", 84, 62, False, 8999, 8299,
        sp_tv("75英寸", "4K", "Mini LED", "144Hz", "杜比视界", "2000nit", "80W", "灵控桌面"),
        ["MiniLED", "旗舰", "高亮度"]),
    row("tcl-t8k-65", "TCL", "T8K 65", "2024-04", 76, 72, False, 4999, 4599,
        sp_tv("65英寸", "4K", "Mini LED", "144Hz", "杜比视界", "1300nit", "40W", "灵控桌面"),
        ["MiniLED", "画质"]),
    row("sony-a80l-65", "索尼", "A80L 65 OLED", "2023-03", 80, 34, True, 12999, 11999,
        sp_tv("65英寸", "4K", "OLED", "120Hz", "杜比视界", "800nit", "50W", "Google TV"),
        ["OLED", "画质旗舰", "影音"]),
    row("sony-x80l-55", "索尼", "X80L 55", "2023-04", 62, 48, True, 3799, 3499,
        sp_tv("55英寸", "4K", "VA", "60Hz", "杜比视界", "400nit", "20W", "Google TV"),
        ["索尼画质", "入门"]),
    row("ffalcon-s585-65", "雷鸟", "鹤6 Pro 65", "2024-04", 72, 80, False, 3199, 2899,
        sp_tv("65英寸", "4K", "Mini LED", "144Hz", "HDR10+", "1000nit", "30W", "雷鸟系统"),
        ["MiniLED", "性价比", "游戏"]),
    row("ffalcon-peak-75", "雷鸟", "鹏7 Pro 75", "2024-03", 74, 68, False, 5299, 4899,
        sp_tv("75英寸", "4K", "Mini LED", "144Hz", "杜比视界", "1200nit", "40W", "雷鸟系统"),
        ["MiniLED", "大屏", "高刷"]),
    row("huawei-vision-se3-65", "华为", "智慧屏SE3 65", "2023-08", 66, 60, True, 2999, 2699,
        sp_tv("65英寸", "4K", "VA", "120Hz", "HDR10", "400nit", "24W", "鸿蒙"),
        ["鸿蒙", "互联", "护眼"]),
    row("skyworth-a5d-65", "创维", "A5D 65", "2024-03", 60, 62, False, 3499, 3199,
        sp_tv("65英寸", "4K", "Mini LED", "144Hz", "HDR10+", "900nit", "30W", "酷开系统"),
        ["MiniLED", "护眼"]),
    row("changhong-d6p-65", "长虹", "D6P 65", "2024-01", 52, 58, True, 2299, 1999,
        sp_tv("65英寸", "4K", "VA", "120Hz", "HDR10", "350nit", "20W", "启客系统"),
        ["入门", "大屏低价"]),
    row("samsung-qn85d-65", "三星", "QN85D 65", "2024-04", 70, 40, False, 11999, 10999,
        sp_tv("65英寸", "4K", "Neo QLED", "144Hz", "HDR10+", "1400nit", "60W", "Tizen"),
        ["NeoQLED", "游戏", "旗舰"]),
    row("lg-c4-65", "LG", "C4 65 OLED", "2024-04", 78, 38, False, 13999, 12999,
        sp_tv("65英寸", "4K", "OLED evo", "144Hz", "杜比视界", "1000nit", "40W", "webOS"),
        ["OLED", "游戏", "画质旗舰"]),
]

# ==================== 智能手表 +15（5 → 20）====================
def sp_watch(size, screen, battery, gps, health, water, chip):
    return {"size": size, "screen": screen, "battery": battery, "gps": gps,
            "health": health, "waterproof": water, "chip": chip}


WATCH_NEW = [
    row("apple-watch-ultra2", "苹果", "Watch Ultra 2", "2023-09", 90, 58, False, 6499, 5999,
        sp_watch("49mm", "1.92英寸 LTPO", "36小时", "双频GPS", "血氧/心电/体温", "100米", "S9 SiP"),
        ["户外", "旗舰", "长续航"]),
    row("apple-watch-s9-45", "苹果", "Watch Series 9 45mm", "2023-09", 78, 66, True, 3199, 2799,
        sp_watch("45mm", "1.9英寸 LTPO", "18小时", "GPS", "血氧/心电", "50米", "S9 SiP"),
        ["生态", "心电", "降价"]),
    row("apple-watch-se2", "苹果", "Watch SE (2代) 44mm", "2022-09", 72, 80, True, 1899, 1699,
        sp_watch("44mm", "1.78英寸 OLED", "18小时", "GPS", "心率/跌倒检测", "50米", "S8 SiP"),
        ["入门", "性价比"]),
    row("huawei-watch-gt5-46", "华为", "WATCH GT5 46mm", "2024-09", 86, 88, False, 1488, 1388,
        sp_watch("46mm", "1.43英寸 AMOLED", "14天", "双频GPS", "血氧/睡眠/情绪", "50米", "麒麟A2"),
        ["超长续航", "健康", "性价比"]),
    row("huawei-watch4-pro", "华为", "WATCH 4 Pro", "2023-05", 74, 56, True, 2999, 2699,
        sp_watch("48mm", "1.5英寸 LTPO", "4.5天", "双频GPS", "血糖风险/心电/血氧", "50米", "麒麟A1"),
        ["eSIM", "商务", "健康旗舰"]),
    row("huawei-watch-fit3", "华为", "WATCH FIT 3", "2024-05", 76, 90, False, 799, 729,
        sp_watch("方形43mm", "1.82英寸 AMOLED", "10天", "GPS", "血氧/睡眠", "50米", "自研"),
        ["轻薄", "百元档", "运动"]),
    row("huawei-watch-ultimate", "华为", "WATCH Ultimate", "2023-03", 68, 32, True, 4999, 4499,
        sp_watch("48.5mm", "1.5英寸 LTPO", "14天", "双频GPS", "血氧/心电", "100米潜水", "麒麟A1"),
        ["潜水", "高端", "钛合金"]),
    row("samsung-watch-ultra", "三星", "Galaxy Watch Ultra", "2024-07", 70, 42, False, 4699, 4299,
        sp_watch("47mm", "1.5英寸 AMOLED", "60小时", "双频GPS", "血氧/心电/体成分", "100米", "Exynos W1000"),
        ["户外", "钛合金", "安卓生态"]),
    row("samsung-watch6-classic", "三星", "Galaxy Watch6 Classic 47mm", "2023-07", 62, 50, True, 2499, 2199,
        sp_watch("47mm", "1.5英寸 AMOLED", "40小时", "GPS", "血氧/心电/体成分", "50米", "Exynos W930"),
        ["旋转表圈", "经典"]),
    row("xiaomi-watch-s4-41", "小米", "Watch S4 41mm", "2024-11", 72, 78, False, 999, 899,
        sp_watch("41mm", "1.32英寸 AMOLED", "12天", "双频GPS", "血氧/心率/睡眠", "50米", "自研"),
        ["小尺寸", "长续航", "百元档"]),
    row("xiaomi-band9-pro", "小米", "手环9 Pro", "2024-08", 80, 92, False, 399, 359,
        sp_watch("方形45mm", "1.74英寸 AMOLED", "21天", "GPS", "血氧/心率/睡眠", "50米", "自研"),
        ["超长续航", "轻量", "入门"]),
    row("honor-watch-gs4", "荣耀", "Watch GS 4", "2023-11", 56, 60, True, 999, 899,
        sp_watch("46mm", "1.43英寸 AMOLED", "14天", "GPS", "血氧/心率/睡眠", "50米", "自研"),
        ["长续航", "性价比"]),
    row("amazfit-trex3", "华米", "Amazfit T-Rex 3", "2024-09", 66, 54, False, 1699, 1549,
        sp_watch("48mm", "1.5英寸 AMOLED", "27天", "双频GPS", "血氧/心率/海拔", "100米", "自研"),
        ["军规户外", "超长续航", "越野"]),
    row("amazfit-balance", "华米", "Amazfit Balance", "2023-09", 58, 48, True, 1499, 1299,
        sp_watch("46mm", "1.5英寸 AMOLED", "14天", "双频GPS", "血氧/体成分/睡眠", "50米", "自研"),
        ["体成分", "睡眠", "轻商务"]),
    row("garmin-fenix8", "佳明", "Fenix 8 47mm", "2024-08", 74, 26, False, 8480, 7999,
        sp_watch("47mm", "1.4英寸 AMOLED", "16天", "多频GPS", "血氧/心率/训练负荷", "100米潜水", "自研"),
        ["专业运动", "铁三", "旗舰"]),
]

# ==================== 机械键盘 +15（5 → 20）====================
def sp_kb(layout, switch, connection, battery, keycap, hotswap, backlight):
    return {"layout": layout, "switch": switch, "connection": connection,
            "battery": battery, "keycap": keycap, "hotswap": hotswap, "backlight": backlight}


KEYBOARD_NEW = [
    row("logitech-g913-tkl", "罗技", "G913 TKL", "2019-08", 74, 56, True, 1299, 1099,
        sp_kb("87键TKL", "GL矮轴", "无线2.4G/蓝牙", "40小时", "ABS", "不支持", "RGB"),
        ["超薄", "无线", "电竞"]),
    row("logitech-mx-mechanical", "罗技", "MX Mechanical", "2022-05", 70, 58, False, 999, 869,
        sp_kb("108键全尺寸", "矮轴茶轴", "无线2.4G/蓝牙", "15天", "ABS", "不支持", "白色背光"),
        ["办公", "静音", "多设备"]),
    row("logitech-g512", "罗技", "G512", "2018-06", 58, 62, True, 549, 449,
        sp_kb("108键全尺寸", "GX青轴", "有线", "无", "ABS", "不支持", "RGB"),
        ["有线", "电竞", "入门"]),
    row("varmilo-mier108", "阿米洛", "米色系列 108", "2023-05", 66, 48, False, 799, 729,
        sp_kb("108键全尺寸", "樱桃红轴", "有线", "无", "PBT", "不支持", "无背光"),
        ["高颜值", "静电容手感", "PBT"]),
    row("varmilo-va108m", "阿米洛", "VA108M", "2021-03", 60, 44, True, 699, 599,
        sp_kb("108键全尺寸", "樱桃茶轴", "有线", "无", "PBT", "不支持", "白光"),
        ["经典", "PBT", "办公"]),
    row("ajazz-ak820pro", "黑爵", "AK820 Pro", "2023-10", 82, 88, False, 329, 289,
        sp_kb("75键紧凑", "客制化线性轴", "三模", "3000mAh", "PBT", "支持", "RGB"),
        ["客制化", "TFT屏", "高性价比"]),
    row("ajazz-ak680", "黑爵", "AK680", "2024-03", 72, 84, False, 199, 169,
        sp_kb("68键紧凑", "线性轴", "三模", "3000mAh", "PBT", "支持", "RGB"),
        ["小巧", "百元档", "热插拔"]),
    row("flesports-mk870", "腹灵", "MK870", "2022-08", 68, 62, True, 429, 379,
        sp_kb("87键TKL", "凯华BOX轴", "三模", "4000mAh", "PBT", "支持", "RGB"),
        ["Gasket", "手感", "热插拔"]),
    row("flesports-fl680", "腹灵", "FL680", "2023-06", 64, 60, False, 359, 319,
        sp_kb("68键紧凑", "线性轴", "三模", "3750mAh", "PBT", "支持", "RGB"),
        ["小配列", "客制化"]),
    row("ducky-one3", "杜伽", "One 3 TKL", "2021-11", 62, 42, True, 899, 799,
        sp_kb("87键TKL", "樱桃银轴", "有线", "无", "PBT", "不支持", "RGB"),
        ["原厂轴", "做工", "信仰"]),
    row("keychron-k8pro", "Keychron", "K8 Pro", "2022-03", 76, 58, False, 699, 629,
        sp_kb("87键TKL", "佳达隆红轴", "无线蓝牙/有线", "4000mAh", "PBT", "支持", "RGB"),
        ["Mac兼容", "QMK改键", "热插拔"]),
    row("keychron-q1pro", "Keychron", "Q1 Pro", "2023-01", 72, 40, False, 1299, 1149,
        sp_kb("75键紧凑", "佳达隆茶轴", "无线蓝牙/有线", "4000mAh", "PBT", "支持", "RGB"),
        ["铝坨坨", "Gasket", "高端"]),
    row("akko-3098b", "Akko", "3098B 多模", "2022-06", 70, 74, True, 399, 349,
        sp_kb("98键紧凑", "AKKO粉轴", "三模", "3000mAh", "PBT", "支持", "白光"),
        ["高颜值", "多配色", "性价比"]),
    row("akko-5075b-plus", "Akko", "5075B Plus", "2023-03", 74, 70, False, 459, 419,
        sp_kb("75键紧凑", "AKKO奶青轴", "三模", "3600mAh", "PBT", "支持", "RGB"),
        ["Gasket", "手感", "热插拔"]),
    row("rk-r75", "RK", "R75", "2023-08", 66, 78, False, 269, 239,
        sp_kb("81键紧凑", "线性轴", "三模", "3000mAh", "PBT", "支持", "RGB"),
        ["旋钮", "百元档", "热插拔"]),
]

NEW_ROWS = {
    "tablet": TABLET_NEW,
    "camera": CAMERA_NEW,
    "tv": TV_NEW,
    "watch": WATCH_NEW,
    "keyboard": KEYBOARD_NEW,
}


def append_csv(cat, rows):
    """把新行追加到 CSV，跳过已存在的 id。返回 (新增数, 总数)。"""
    fname, out_js, const = CATS[cat]
    path = os.path.join(TPL, fname)
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        header = reader.fieldnames
        existing = list(reader)
    have = {r["id"] for r in existing}

    added = [r for r in rows if r["id"] not in have]
    if not added:
        return 0, len(existing)

    # 重写整个文件（保留 utf-8-sig BOM，与原文件一致）
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=header, lineterminator="\n")
    w.writeheader()
    for r in existing + added:
        w.writerow({k: r.get(k, "") for k in header})
    with open(path, "w", encoding="utf-8-sig") as f:
        f.write(buf.getvalue())

    return len(added), len(existing) + len(added)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv-only", action="store_true", help="只写 CSV，不调用 import_csv.py")
    args = ap.parse_args()

    print("=== 追加 CSV ===")
    summary = []
    for cat, rows in NEW_ROWS.items():
        added, total = append_csv(cat, rows)
        summary.append((cat, added, total))
        print(f"  {cat:<9} +{added:<3} → 共 {total} 款")

    if args.csv_only:
        print("\n--csv-only，未生成 js。")
        return

    print("\n=== 走 import_csv.py 校验并生成 data-*.js ===")
    for cat, _, _ in summary:
        fname, out_js, const = CATS[cat]
        cmd = [PY, os.path.join(ROOT, "tools", "import_csv.py"),
               "--csv", os.path.join(TPL, fname),
               "--out", os.path.join(ROOT, out_js),
               "--const", const]
        r = subprocess.run(cmd, capture_output=True, text=True)
        print("  " + (r.stdout.strip() or r.stderr.strip()))
        if r.returncode != 0:
            sys.exit(f"导入 {cat} 失败，已中止")

    print("\n完成。下一步：python tools/fetch_images.py 补图")


if __name__ == "__main__":
    main()
