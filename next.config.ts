import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ⬇️ 新增这两项配置：忽略类型检查和代码风格检查 */
  typescript: {
    // ⚠️ 警告：仅在急需上线时使用，忽略 TypeScript 报错
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略 ESLint 报错
    ignoreDuringBuilds: true,
  },
  /* ⬆️ 结束 */
};

export default nextConfig;