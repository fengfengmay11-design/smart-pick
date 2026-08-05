#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成 5 个新品类种子数据 CSV（供 import_csv.py 使用）。
数据基于各机型公开发布的规格参数（参考价），lastVerified 标注生成日期，
正式对外展示前请按 tools/SCHEMA.md 核对一遍真实参数与到手价。
"""
import csv
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.join(HERE, "templates")
os.makedirs(TPL, exist_ok=True)

COLUMNS = ["id", "brand", "model", "image", "launchDate", "popularity",
           "sales", "priceDrop", "price_jd", "price_pdd", "specs",
           "tags", "officialUrl", "lastVerified"]

LV = "2026-08-05"


def write_csv(cat, rows):
    path = os.path.join(TPL, cat + ".csv")
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        for r in rows:
            w.writerow(r)
    print(f"  {cat}.csv  {len(rows)} 款")


# ==================== 平板 tablet ====================
tablet = [
    {"id":"ipad-pro-13-m4","brand":"苹果","model":"iPad Pro 13 (M4)","image":"","launchDate":"2024-05","popularity":95,"sales":82,"priceDrop":False,"price_jd":8999,"price_pdd":8699,
     "specs":json.dumps({"size":"13英寸","resolution":"2752x2064 OLED","chip":"Apple M4","ram":"8GB","storage":"256GB","battery":"约10小时","weight":"579g","refreshRate":"120Hz"},ensure_ascii=False),
     "tags":"M4;OLED;120Hz","officialUrl":"","lastVerified":LV},
    {"id":"ipad-air-11-m2","brand":"苹果","model":"iPad Air 11 (M2)","image":"","launchDate":"2024-05","popularity":88,"sales":80,"priceDrop":False,"price_jd":4799,"price_pdd":4499,
     "specs":json.dumps({"size":"11英寸","resolution":"2360x1640","chip":"Apple M2","ram":"8GB","storage":"128GB","battery":"约10小时","weight":"462g","refreshRate":"60Hz"},ensure_ascii=False),
     "tags":"M2;轻薄","officialUrl":"","lastVerified":LV},
    {"id":"huawei-matepad-pro-132","brand":"华为","model":"MatePad Pro 13.2","image":"","launchDate":"2023-09","popularity":82,"sales":70,"priceDrop":True,"price_jd":5199,"price_pdd":4699,
     "specs":json.dumps({"size":"13.2英寸","resolution":"2880x1920 OLED","chip":"麒麟9000WL","ram":"12GB","storage":"256GB","battery":"约10小时","weight":"580g","refreshRate":"120Hz"},ensure_ascii=False),
     "tags":"鸿蒙;OLED;办公","officialUrl":"","lastVerified":LV},
    {"id":"xiaomi-pad-6s-pro-124","brand":"小米","model":"平板6S Pro 12.4","image":"","launchDate":"2024-02","popularity":80,"sales":76,"priceDrop":False,"price_jd":2999,"price_pdd":2799,
     "specs":json.dumps({"size":"12.4英寸","resolution":"3048x2032","chip":"骁龙8 Gen2","ram":"8GB","storage":"256GB","battery":"10000mAh","weight":"590g","refreshRate":"144Hz"},ensure_ascii=False),
     "tags":"性价比;144Hz","officialUrl":"","lastVerified":LV},
    {"id":"samsung-tab-s9","brand":"三星","model":"Galaxy Tab S9","image":"","launchDate":"2023-07","popularity":72,"sales":58,"priceDrop":True,"price_jd":4999,"price_pdd":3999,
     "specs":json.dumps({"size":"11英寸","resolution":"2560x1600 AMOLED","chip":"骁龙8 Gen2","ram":"8GB","storage":"128GB","battery":"8400mAh","weight":"498g","refreshRate":"120Hz"},ensure_ascii=False),
     "tags":"AMOLED;三星","officialUrl":"","lastVerified":LV},
    {"id":"honor-pad9-121","brand":"荣耀","model":"平板9 12.1","image":"","launchDate":"2023-12","popularity":64,"sales":60,"priceDrop":False,"price_jd":1499,"price_pdd":1399,
     "specs":json.dumps({"size":"12.1英寸","resolution":"2560x1600","chip":"骁龙6 Gen1","ram":"8GB","storage":"256GB","battery":"8300mAh","weight":"555g","refreshRate":"120Hz"},ensure_ascii=False),
     "tags":"大屏;护眼","officialUrl":"","lastVerified":LV},
    {"id":"lenovo-xiaoxin-pad-pro-127","brand":"联想","model":"小新 Pad Pro 12.7","image":"","launchDate":"2024-01","popularity":60,"sales":54,"priceDrop":False,"price_jd":1499,"price_pdd":1399,
     "specs":json.dumps({"size":"12.7英寸","resolution":"2944x1840","chip":"天玑8300","ram":"8GB","storage":"128GB","battery":"10200mAh","weight":"615g","refreshRate":"144Hz"},ensure_ascii=False),
     "tags":"大屏;性价比","officialUrl":"","lastVerified":LV},
]

# ==================== 相机 camera ====================
camera = [
    {"id":"sony-a7m4","brand":"索尼","model":"Alpha 7 IV (A7M4)","image":"","launchDate":"2021-10","popularity":95,"sales":80,"priceDrop":False,"price_jd":16999,"price_pdd":15999,
     "specs":json.dumps({"sensor":"全画幅","resolution":"3300万","video":"4K60","mount":"E卡口","ibis":"五轴防抖","weight":"658g","screen":"3英寸翻转屏"},ensure_ascii=False),
     "tags":"全画幅;防抖;视频","officialUrl":"","lastVerified":LV},
    {"id":"canon-r6ii","brand":"佳能","model":"EOS R6 Mark II","image":"","launchDate":"2022-11","popularity":90,"sales":76,"priceDrop":False,"price_jd":15999,"price_pdd":14999,
     "specs":json.dumps({"sensor":"全画幅","resolution":"2420万","video":"4K60","mount":"RF卡口","ibis":"五轴防抖","weight":"670g","screen":"3英寸翻转屏"},ensure_ascii=False),
     "tags":"全画幅;防抖;连拍","officialUrl":"","lastVerified":LV},
    {"id":"nikon-z6iii","brand":"尼康","model":"Z6 III","image":"","launchDate":"2024-06","popularity":84,"sales":64,"priceDrop":False,"price_jd":13999,"price_pdd":13599,
     "specs":json.dumps({"sensor":"全画幅","resolution":"2450万","video":"6K60","mount":"Z卡口","ibis":"五轴防抖","weight":"760g","screen":"3.2英寸翻转屏"},ensure_ascii=False),
     "tags":"全画幅;6K视频;防抖","officialUrl":"","lastVerified":LV},
    {"id":"fujifilm-xt5","brand":"富士","model":"X-T5","image":"","launchDate":"2022-11","popularity":86,"sales":70,"priceDrop":False,"price_jd":11990,"price_pdd":10990,
     "specs":json.dumps({"sensor":"APS-C","resolution":"4020万","video":"6.2K30","mount":"X卡口","ibis":"五轴防抖","weight":"557g","screen":"三向翻折屏"},ensure_ascii=False),
     "tags":"复古;高像素;胶片模拟","officialUrl":"","lastVerified":LV},
    {"id":"sony-zve10ii","brand":"索尼","model":"ZV-E10 II","image":"","launchDate":"2024-07","popularity":78,"sales":72,"priceDrop":False,"price_jd":5999,"price_pdd":5699,
     "specs":json.dumps({"sensor":"APS-C","resolution":"2600万","video":"4K60","mount":"E卡口","ibis":"无防抖","weight":"377g","screen":"翻折屏"},ensure_ascii=False),
     "tags":"Vlog;轻量;4K","officialUrl":"","lastVerified":LV},
    {"id":"canon-r50","brand":"佳能","model":"EOS R50","image":"","launchDate":"2023-02","popularity":70,"sales":66,"priceDrop":False,"price_jd":4599,"price_pdd":4299,
     "specs":json.dumps({"sensor":"APS-C","resolution":"2420万","video":"4K30","mount":"RF卡口","ibis":"无防抖","weight":"375g","screen":"翻折屏"},ensure_ascii=False),
     "tags":"入门;轻量;Vlog","officialUrl":"","lastVerified":LV},
]

# ==================== 电视 tv ====================
tv = [
    {"id":"xiaomi-tv-spro-65","brand":"小米","model":"电视 S Pro 65 Mini LED","image":"","launchDate":"2024-01","popularity":85,"sales":82,"priceDrop":True,"price_jd":4299,"price_pdd":3799,
     "specs":json.dumps({"size":"65英寸","resolution":"4K","panel":"Mini LED","refreshRate":"144Hz","hdr":"杜比视界","brightness":"1200nits","ports":"HDMI 2.1 x2"},ensure_ascii=False),
     "tags":"MiniLED;144Hz;性价比","officialUrl":"","lastVerified":LV},
    {"id":"hisense-u8n-65","brand":"海信","model":"U8N 65 Mini LED","image":"","launchDate":"2024-03","popularity":80,"sales":70,"priceDrop":False,"price_jd":6999,"price_pdd":6499,
     "specs":json.dumps({"size":"65英寸","resolution":"4K","panel":"Mini LED","refreshRate":"144Hz","hdr":"杜比视界","brightness":"2000nits","ports":"HDMI 2.1 x2"},ensure_ascii=False),
     "tags":"MiniLED;高亮度;信芯","officialUrl":"","lastVerified":LV},
    {"id":"tcl-q10k-65","brand":"TCL","model":"Q10K 65 Mini LED","image":"","launchDate":"2024-04","popularity":78,"sales":74,"priceDrop":False,"price_jd":4499,"price_pdd":4199,
     "specs":json.dumps({"size":"65英寸","resolution":"4K","panel":"Mini LED","refreshRate":"144Hz","hdr":"杜比视界","brightness":"1600nits","ports":"HDMI 2.1 x2"},ensure_ascii=False),
     "tags":"MiniLED;高分区;性价比","officialUrl":"","lastVerified":LV},
    {"id":"sony-x90l-65","brand":"索尼","model":"XR-65X90L","image":"","launchDate":"2023-05","popularity":82,"sales":68,"priceDrop":True,"price_jd":6999,"price_pdd":5999,
     "specs":json.dumps({"size":"65英寸","resolution":"4K","panel":"全阵列LED","refreshRate":"120Hz","hdr":"杜比视界","brightness":"普通","ports":"HDMI 2.1 x2"},ensure_ascii=False),
     "tags":"XR芯片;画质调校","officialUrl":"","lastVerified":LV},
    {"id":"ffalcon-h7-65","brand":"雷鸟","model":"鹤7 65 Mini LED","image":"","launchDate":"2024-03","popularity":72,"sales":66,"priceDrop":False,"price_jd":3299,"price_pdd":3099,
     "specs":json.dumps({"size":"65英寸","resolution":"4K","panel":"Mini LED","refreshRate":"144Hz","hdr":"杜比视界","brightness":"1300nits","ports":"HDMI 2.1 x2"},ensure_ascii=False),
     "tags":"MiniLED;高性价比","officialUrl":"","lastVerified":LV},
    {"id":"huawei-vision-v5pro-65","brand":"华为","model":"智慧屏 V5 Pro 65","image":"","launchDate":"2023-09","popularity":66,"sales":50,"priceDrop":False,"price_jd":8999,"price_pdd":8499,
     "specs":json.dumps({"size":"65英寸","resolution":"4K","panel":"LCD","refreshRate":"120Hz","hdr":"HDR10","brightness":"普通","ports":"HDMI 2.1"},ensure_ascii=False),
     "tags":"鸿鹄;灵犀遥控;智慧屏","officialUrl":"","lastVerified":LV},
]

# ==================== 智能手表 watch ====================
watch = [
    {"id":"apple-watch-s10-46","brand":"苹果","model":"Apple Watch Series 10 (46mm)","image":"","launchDate":"2024-09","popularity":92,"sales":84,"priceDrop":False,"price_jd":3199,"price_pdd":2999,
     "specs":json.dumps({"size":"46mm","screen":"1.9英寸 LTPO OLED","battery":"18小时","gps":"双频GPS","health":"血氧/ECG/心率","weight":"36.6g","os":"watchOS"},ensure_ascii=False),
     "tags":"苹果;ECG;旗舰","officialUrl":"","lastVerified":LV},
    {"id":"huawei-watch-gt5pro","brand":"华为","model":"Watch GT5 Pro","image":"","launchDate":"2024-09","popularity":84,"sales":78,"priceDrop":False,"price_jd":2488,"price_pdd":2288,
     "specs":json.dumps({"size":"46mm","screen":"1.43英寸 AMOLED","battery":"14天","gps":"双频GPS","health":"血氧/心率/睡眠","weight":"53g","os":"HarmonyOS"},ensure_ascii=False),
     "tags":"长续航;鸿蒙;运动","officialUrl":"","lastVerified":LV},
    {"id":"samsung-watch7","brand":"三星","model":"Galaxy Watch7","image":"","launchDate":"2024-07","popularity":74,"sales":64,"priceDrop":False,"price_jd":1899,"price_pdd":1699,
     "specs":json.dumps({"size":"44mm","screen":"1.5英寸 AMOLED","battery":"约40小时","gps":"GPS","health":"血氧/心率/体脂","weight":"33.8g","os":"Wear OS"},ensure_ascii=False),
     "tags":"三星;WearOS","officialUrl":"","lastVerified":LV},
    {"id":"xiaomi-watch-s4","brand":"小米","model":"Watch S4","image":"","launchDate":"2024-10","popularity":70,"sales":66,"priceDrop":False,"price_jd":999,"price_pdd":899,
     "specs":json.dumps({"size":"47mm","screen":"1.43英寸 AMOLED","battery":"15天","gps":"GPS","health":"血氧/心率/睡眠","weight":"44.5g","os":"HyperOS"},ensure_ascii=False),
     "tags":"性价比;长续航","officialUrl":"","lastVerified":LV},
    {"id":"honor-watch5","brand":"荣耀","model":"Watch 5","image":"","launchDate":"2024-09","popularity":60,"sales":52,"priceDrop":False,"price_jd":999,"price_pdd":899,
     "specs":json.dumps({"size":"46mm","screen":"1.85英寸 AMOLED","battery":"约14天","gps":"GPS","health":"血氧/心率","weight":"32g","os":"MagicOS"},ensure_ascii=False),
     "tags":"轻商务;长续航","officialUrl":"","lastVerified":LV},
]

# ==================== 机械键盘 keyboard ====================
keyboard = [
    {"id":"logitech-mx-keys-s","brand":"罗技","model":"MX Keys S","image":"","launchDate":"2023-01","popularity":88,"sales":80,"priceDrop":True,"price_jd":699,"price_pdd":599,
     "specs":json.dumps({"layout":"全尺寸","switch":"薄膜剪刀脚","connection":"蓝牙+USB接收器","battery":"续航数月","weight":"810g"},ensure_ascii=False),
     "tags":"办公;静音;多设备","officialUrl":"","lastVerified":LV},
    {"id":"varmilo-va87","brand":"阿米洛","model":"VA87 静音版","image":"","launchDate":"2023-01","popularity":72,"sales":60,"priceDrop":False,"price_jd":599,"price_pdd":549,
     "specs":json.dumps({"layout":"87键","switch":"静音红轴(机械)","connection":"有线/蓝牙","battery":"有线无","weight":"1.1kg"},ensure_ascii=False),
     "tags":"静音;机械;做工","officialUrl":"","lastVerified":LV},
    {"id":"ajazz-ak992","brand":"黑爵","model":"AK992 三模","image":"","launchDate":"2024-01","popularity":68,"sales":64,"priceDrop":False,"price_jd":299,"price_pdd":269,
     "specs":json.dumps({"layout":"98键","switch":"机械(热插拔)","connection":"三模(有线/蓝牙/2.4G)","battery":"4000mAh","weight":"1.0kg"},ensure_ascii=False),
     "tags":"三模;热插拔;性价比","officialUrl":"","lastVerified":LV},
    {"id":"flesports-fl980","brand":"腹灵","model":"FL980 三模","image":"","launchDate":"2023-06","popularity":64,"sales":56,"priceDrop":False,"price_jd":399,"price_pdd":359,
     "specs":json.dumps({"layout":"98键","switch":"机械(热插拔)","connection":"三模","battery":"4000mAh","weight":"1.1kg"},ensure_ascii=False),
     "tags":"三模;热插拔","officialUrl":"","lastVerified":LV},
    {"id":"ducky-k320w","brand":"杜伽","model":"K320W 三模","image":"","launchDate":"2023-03","popularity":62,"sales":52,"priceDrop":False,"price_jd":399,"price_pdd":369,
     "specs":json.dumps({"layout":"87键","switch":"机械(热插拔)","connection":"三模","battery":"续航持久","weight":"0.9kg"},ensure_ascii=False),
     "tags":"三模;复古;做工","officialUrl":"","lastVerified":LV},
]

if __name__ == "__main__":
    write_csv("tablet", tablet)
    write_csv("camera", camera)
    write_csv("tv", tv)
    write_csv("watch", watch)
    write_csv("keyboard", keyboard)
    print("全部种子 CSV 已生成到 tools/templates/")
