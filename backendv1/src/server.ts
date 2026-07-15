// src/server.ts

import app from "./app.js";
import env from "./config/env.js";
import { prisma } from "./config/prisma.js";

const startServer = async () => {
  try {
    console.log('🔄 Đang kết nối cơ sở dữ liệu...');
    
    // 1. Kiểm tra kết nối CSDL
    await prisma.$queryRaw`SELECT 1`;
    console.log(" Kết nối cơ sở dữ liệu thành công!");

    // 2. Nếu thành công thì mới mở cổng lắng nghe
    app.listen(env.PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${env.PORT}`);
      console.log(`📚 Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${env.PORT}/api/auth`);
    });
  } catch (error) {
    console.error("❌ Không thể kết nối cơ sở dữ liệu:", error);
    
    // Đảm bảo đóng kết nối Prisma khi app bị lỗi
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Xử lý tắt server an toàn
process.on('SIGINT', async () => {
  console.log('\n🛑 Đang tắt server...');
  await prisma.$disconnect();
  console.log(' Đã ngắt kết nối cơ sở dữ liệu');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Đang tắt server...');
  await prisma.$disconnect();
  console.log(' Đã ngắt kết nối cơ sở dữ liệu');
  process.exit(0);
});

startServer();