#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
京东联盟接入自检 —— 拿到 app_key 后跑这一条命令就知道当前能做什么

  python server/verify_setup.py

检查项：
  1. .env 是否存在、是否被 git 忽略（防止 key 泄露到 GitHub）
  2. 凭据是否填了、格式是否像真的
  3. 签名链路是否打通（用免权限接口实测）
  4. 逐个探测各接口权限，输出「现在能做什么 / 还差什么」
  5. 给出针对性的下一步建议
"""

import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

GREEN, RED, YELLOW, DIM, RESET = "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m"
OK, BAD, WARN = f"{GREEN}✓{RESET}", f"{RED}✗{RESET}", f"{YELLOW}!{RESET}"


def line(char="─", n=58):
    print(char * n)


def section(title):
    print()
    line()
    print(f" {title}")
    line()


def main():
    problems = []

    # ── 1. 安全检查 ────────────────────────────────────────────
    section("1. 安全检查")
    env_path = os.path.join(HERE, ".env")

    if os.path.exists(env_path):
        print(f"{OK} server/.env 存在")
    else:
        print(f"{BAD} server/.env 不存在")
        print(f"  {DIM}→ cp server/.env.example server/.env{RESET}")
        problems.append("创建 .env 并填入凭据")

    # .env 必须被 git 忽略——京东官方明令禁止 key 进版本库
    try:
        r = subprocess.run(["git", "check-ignore", "-q", env_path],
                           cwd=ROOT, capture_output=True)
        if r.returncode == 0:
            print(f"{OK} .env 已被 .gitignore 忽略（key 不会进版本库）")
        else:
            print(f"{BAD} .env 未被 git 忽略 —— 有泄露风险！")
            print(f"  {DIM}→ echo 'server/.env' >> .gitignore{RESET}")
            problems.append("把 server/.env 加进 .gitignore")
    except FileNotFoundError:
        print(f"{WARN} 未检测到 git，跳过忽略检查")

    tracked = subprocess.run(["git", "ls-files", "--error-unmatch", "server/.env"],
                             cwd=ROOT, capture_output=True)
    if tracked.returncode == 0:
        print(f"{BAD} server/.env 已被 git 追踪！立即执行：")
        print(f"  {DIM}git rm --cached server/.env{RESET}")
        problems.append("把 .env 从 git 追踪中移除，并到联盟后台重置 key")
    else:
        print(f"{OK} server/.env 未被 git 追踪")

    # ── 2. 凭据检查 ────────────────────────────────────────────
    section("2. 凭据检查")
    try:
        from jd_client import _cfg, JdError, probe_permissions, is_placeholder
    except Exception as e:
        print(f"{BAD} 无法导入 jd_client：{e}")
        sys.exit(1)

    key, secret = _cfg("JD_APP_KEY"), _cfg("JD_APP_SECRET")
    creds_ok = True

    if not key:
        print(f"{BAD} JD_APP_KEY 未填写")
        problems.append("在 server/.env 填入 JD_APP_KEY")
        creds_ok = False
    elif is_placeholder(key):
        print(f"{BAD} JD_APP_KEY 还是占位符：{key[:16]}…")
        problems.append("把 JD_APP_KEY 换成联盟后台的真实值（32位十六进制）")
        creds_ok = False
    else:
        print(f"{OK} JD_APP_KEY 已配置（{key[:6]}…{key[-4:]}，共 {len(key)} 位）")

    if not secret:
        print(f"{BAD} JD_APP_SECRET 未填写")
        problems.append("在 server/.env 填入 JD_APP_SECRET")
        creds_ok = False
    elif is_placeholder(secret):
        print(f"{BAD} JD_APP_SECRET 还是占位符")
        problems.append("把 JD_APP_SECRET 换成联盟后台的真实值")
        creds_ok = False
    else:
        print(f"{OK} JD_APP_SECRET 已配置（{len(secret)} 位，已隐藏）")

    if not creds_ok:
        section("下一步")
        for i, p in enumerate(problems, 1):
            print(f"  {i}. {p}")
        print(f"\n  {DIM}申请步骤详见 docs/JD_UNION_SETUP.md{RESET}")
        sys.exit(1)

    # ── 3. 接口权限探测 ────────────────────────────────────────
    section("3. 接口权限探测（实际调用，约需 5 秒）")
    try:
        results = probe_permissions()
    except JdError as e:
        print(f"{BAD} 探测失败：{e}")
        sys.exit(1)

    free_ok = apply_ok = 0
    for method, info in results.items():
        mark = OK if info["ok"] else BAD
        tier = "免权限" if info["tier"] == "free" else "需申请"
        print(f"{mark} [{tier}] {info['name']}")
        print(f"      {DIM}{method}{RESET}")
        print(f"      {info['detail']}")
        if info["ok"]:
            if info["tier"] == "free":
                free_ok += 1
            else:
                apply_ok += 1

    # ── 4. 结论 ────────────────────────────────────────────────
    section("4. 结论")

    if free_ok == 0:
        print(f"{BAD} 免权限接口全部失败 —— 说明签名或凭据有问题")
        print()
        print("  常见原因：")
        print("   • app_key/app_secret 复制时带了空格或换行")
        print("   • 用的是「京东宙斯/商家开放平台」的 key（不通用）")
        print("   • 联盟账号未完成实名认证")
        print("   • 服务器时间偏差过大（签名含 timestamp，偏差>10分钟会失败）")
        print(f"\n  {DIM}排查：python server/jd_client.py jingfen{RESET}")
        sys.exit(1)

    print(f"{OK} 签名链路已打通（{free_ok}/3 个免权限接口可用）")
    print()

    if apply_ok:
        print(f"{OK} {GREEN}关键词搜索权限已开通 —— 可以直接批量刷价了{RESET}")
        print()
        print("  下一步：")
        print(f"   1. {DIM}python server/refresh_prices.py --dry-run --limit 5{RESET}   先试5款")
        print(f"   2. {DIM}python server/refresh_prices.py --only data-tablet.js{RESET}  刷单个品类")
        print(f"   3. {DIM}python server/refresh_prices.py{RESET}                        全量刷新")
    else:
        print(f"{WARN} {YELLOW}关键词搜索（goods.query）暂无权限{RESET}")
        print()
        print("  现在能做的：")
        print("   • 按 SKU 精确查价（免权限，最稳）")
        print(f"     {DIM}python server/jd_client.py sku 100065474274{RESET}")
        print("   • 拉京粉精选商品池")
        print(f"     {DIM}python server/jd_client.py jingfen 22{RESET}")
        print()
        print("  要按「品牌+型号」自动刷价，二选一：")
        print("   a) 申请 goods.query 权限（1-3 工作日，免费）")
        print("      联盟后台 → 开放平台 → API 权限 → 申请「商品查询」")
        print("   b) 给产品补 skuId 字段，走免权限通道（当天可用）")
        print(f"      {DIM}详见 docs/JD_UNION_SETUP.md 第 5 节{RESET}")

    print()
    line()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n已取消")
        sys.exit(130)
