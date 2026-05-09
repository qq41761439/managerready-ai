#!/bin/bash
set -e

# ============================================
# ManagerReady AI - 一键免费部署脚本
# 前端 → Vercel (免费)
# 后端 → Render (免费750小时/月)
# ============================================

echo "=========================================="
echo "  ManagerReady AI - 免费部署脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查必需信息
echo -e "${YELLOW}[1/5] 检查部署配置...${NC}"

# GitHub 仓库（已推送）
REPO_URL="https://github.com/qq41761439/managerready-ai.git"
echo "✓ GitHub 仓库: $REPO_URL"

# OpenRouter API Key must be configured in Render, not committed to the repo.
OPENROUTER_KEY_PLACEHOLDER="<paste-your-openrouter-api-key-in-render>"
echo "✓ OpenRouter API Key 将在 Render 环境变量中手动配置"

echo ""
echo -e "${YELLOW}[2/5] Vercel 前端部署${NC}"
echo "----------------------------------------"
echo "请按以下步骤操作："
echo ""
echo "1. 打开 https://vercel.com 并登录（用GitHub账号）"
echo "2. 点击 'Add New...' → 'Project'"
echo "3. Import Git Repository: 选择 qq41761439/managerready-ai"
echo "4. 配置项目："
echo "   - Root Directory: 选择 'frontend' （重要！）"
echo "   - Framework Preset: 自动检测为 Next.js"
echo "   - Environment Variables: 暂时不填"
echo "5. 点击 'Deploy'"
echo ""
echo -e "${GREEN}等待部署完成，记下 Vercel 给你的域名（格式：xxx.vercel.app）${NC}"
echo ""
read -p "请输入你的 Vercel 前端域名 (例如: managerready-ai.vercel.app): " VERCEL_DOMAIN

if [ -z "$VERCEL_DOMAIN" ]; then
    echo -e "${RED}错误: 域名不能为空${NC}"
    exit 1
fi

# 去掉 https:// 前缀（如果有）
VERCEL_DOMAIN=${VERCEL_DOMAIN#https://}
VERCEL_DOMAIN=${VERCEL_DOMAIN%/}

echo "✓ 前端域名: https://$VERCEL_DOMAIN"
echo ""

echo -e "${YELLOW}[3/5] Render 后端部署${NC}"
echo "----------------------------------------"
echo "请按以下步骤操作："
echo ""
echo "1. 打开 https://render.com 并登录（用GitHub账号）"
echo "2. 点击 'New +' → 'Web Service'"
echo "3. Connect a repository: 选择 qq41761439/managerready-ai"
echo "4. 配置服务："
echo "   - Name: managerready-ai-api （随意）"
echo "   - Root Directory: 填 'backend'"
echo "   - Runtime: Python 3"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "5. Environment Variables（重要！）添加以下变量："
echo "   --------------------------------------------------"
echo "   AI_PROVIDER              = openai_compatible"
echo "   AI_PROVIDER_NAME         = openrouter"
echo "   AI_BASE_URL              = https://openrouter.ai/api/v1"
echo "   AI_API_KEY               = $OPENROUTER_KEY_PLACEHOLDER"
echo "   AI_MODEL                 = nvidia/nemotron-3-super-120b-a12b:free"
echo "   AI_TIMEOUT_SECONDS       = 90"
echo "   AI_ENABLE_MOCK_FALLBACK  = 0"
echo "   OPENROUTER_API_KEY       = $OPENROUTER_KEY_PLACEHOLDER"
echo "   CORS_ORIGINS             = https://$VERCEL_DOMAIN,http://localhost:3000"
echo "   --------------------------------------------------"
echo ""
echo "6. 点击 'Create Web Service'"
echo ""
echo -e "${GREEN}等待部署完成，记下 Render 给你的域名（格式：xxx.onrender.com）${NC}"
echo ""
read -p "请输入你的 Render 后端域名 (例如: managerready-ai-api.onrender.com): " RENDER_DOMAIN

if [ -z "$RENDER_DOMAIN" ]; then
    echo -e "${RED}错误: 域名不能为空${NC}"
    exit 1
fi

# 去掉 https:// 前缀（如果有）
RENDER_DOMAIN=${RENDER_DOMAIN#https://}
RENDER_DOMAIN=${RENDER_DOMAIN%/}

echo "✓ 后端域名: https://$RENDER_DOMAIN"
echo ""

echo -e "${YELLOW}[4/5] 更新前端环境变量${NC}"
echo "----------------------------------------"
echo "现在需要回到 Vercel 配置前端："
echo ""
echo "1. 打开 https://vercel.com/dashboard"
echo "2. 进入你的项目 → Settings → Environment Variables"
echo "3. 添加变量："
echo "   --------------------------------------------------"
echo "   NEXT_PUBLIC_API_BASE_URL = https://$RENDER_DOMAIN"
echo "   NEXT_PUBLIC_POSTHOG_KEY  = 你的 PostHog Project API Key"
echo "   NEXT_PUBLIC_POSTHOG_HOST = https://us.i.posthog.com"
echo "   --------------------------------------------------"
echo "4. 点击 'Save'"
echo "5. 回到项目 → Deployments → 点击最新部署 → 'Redeploy'"
echo ""
read -p "完成后按 Enter 继续..."
echo ""

echo -e "${YELLOW}[5/5] 验证部署${NC}"
echo "----------------------------------------"

# 测试后端 health
echo "测试后端 health endpoint..."
if curl -s --max-time 10 "https://$RENDER_DOMAIN/health" | grep -q "ok"; then
    echo -e "${GREEN}✓ 后端运行正常${NC}"
else
    echo -e "${YELLOW}⚠ 后端可能还在启动（Render免费版冷启动约30秒），请稍后手动测试${NC}"
fi

echo ""
echo "测试前端访问..."
if curl -s --max-time 10 "https://$VERCEL_DOMAIN" | grep -q "<html"; then
    echo -e "${GREEN}✓ 前端运行正常${NC}"
else
    echo -e "${YELLOW}⚠ 前端可能还在部署，请稍后手动测试${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "前端地址: https://$VERCEL_DOMAIN"
echo "后端地址: https://$RENDER_DOMAIN"
echo ""
echo "注意事项："
echo "1. Render 免费版在15分钟无请求后会休眠"
echo "2. 冷启动时间约30秒，首次访问可能超时"
echo "3. 建议升级到付费版（7美元/月）避免休眠"
echo ""
echo "测试 API："
echo "curl -X POST https://$RENDER_DOMAIN/api/generate \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"input_text\": \"test\", \"scenario\": \"daily\", \"tone\": \"professional\", \"length\": \"short\"}'"
echo ""
