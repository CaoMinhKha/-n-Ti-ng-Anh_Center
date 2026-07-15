// prisma/seeds/module3_khoahoc.seed.ts

import {
  PrismaClient,
  khoahoc_TrangThai,
  baihoc_TrangThai,
  phanbaihoc_TrangThai,
  baikiemtra_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule3KhoaHoc(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 3 - Khóa Học...");

  // ==================================================
  // 1. Lấy danh mục Trình độ và Nội dung học
  // ==================================================

  const trinhDo = await db.danhmuc.findFirst({
    where: { TenDanhMuc: "Trình độ" },
  });

  if (!trinhDo) {
    throw new Error("❌ Không tìm thấy danh mục Trình độ. Vui lòng chạy Module 1 trước!");
  }

  const trinhDoList = await db.danhmuc.findMany({
    where: { DanhMucChaID: trinhDo.DanhMucID },
    orderBy: { ThuTuHienThi: "asc" },
  });

  const noiDungHoc = await db.danhmuc.findFirst({
    where: { TenDanhMuc: "Nội dung học" },
  });

  if (!noiDungHoc) {
    throw new Error("❌ Không tìm thấy danh mục Nội dung học. Vui lòng chạy Module 1 trước!");
  }

  const noiDungHocList = await db.danhmuc.findMany({
    where: { DanhMucChaID: noiDungHoc.DanhMucID },
    orderBy: { ThuTuHienThi: "asc" },
  });

  console.log(` Tìm thấy ${trinhDoList.length} trình độ và ${noiDungHocList.length} loại nội dung`);

  // Tạo map để dễ tra cứu DanhMucID theo tên
  const danhMucMap: Record<string, number> = {};
  for (const dm of noiDungHocList) {
    danhMucMap[dm.TenDanhMuc] = dm.DanhMucID;
  }

  // Lấy danh mục "Bài kiểm tra"
  const baiKiemTraDanhMucID = danhMucMap["Bài kiểm tra"];

  // ==================================================
  // 2. Tạo 3 Khóa học
  // ==================================================

  const khoaHocData = [
    {
      tenKhoaHoc: "Tiếng Anh Cơ Bản A1",
      trinhDo: "A1",
      hocPhi: 1500000,
      moTa: "Khóa học tiếng Anh dành cho người mới bắt đầu, trình độ A1",
      trangThai: khoahoc_TrangThai.DANG_MO,
    },
    {
      tenKhoaHoc: "Tiếng Anh Giao Tiếp A2",
      trinhDo: "A2",
      hocPhi: 2000000,
      moTa: "Khóa học tiếng Anh giao tiếp cơ bản, trình độ A2",
      trangThai: khoahoc_TrangThai.DANG_MO,
    },
    {
      tenKhoaHoc: "Tiếng Anh Nâng Cao A3",
      trinhDo: "A3",
      hocPhi: 2500000,
      moTa: "Khóa học tiếng Anh nâng cao, trình độ A3",
      trangThai: khoahoc_TrangThai.SAP_MO,
    },
  ];

  const createdKhoaHocs = [];

  for (const khData of khoaHocData) {
    const trinhDoItem = trinhDoList.find((td) => td.TenDanhMuc === khData.trinhDo);

    if (!trinhDoItem) {
      console.warn(
        `⚠️ Không tìm thấy trình độ ${khData.trinhDo}, bỏ qua khóa học ${khData.tenKhoaHoc}`
      );
      continue;
    }

    // Kiểm tra khóa học đã tồn tại chưa
    const existingKhoaHoc = await db.khoahoc.findFirst({
      where: { TenKhoaHoc: khData.tenKhoaHoc },
    });

    let khoaHoc;
    if (existingKhoaHoc) {
      khoaHoc = await db.khoahoc.update({
        where: { KhoaHocID: existingKhoaHoc.KhoaHocID },
        data: {
          TrinhDoID: trinhDoItem.DanhMucID,
          HocPhi: khData.hocPhi,
          MoTa: khData.moTa,
          TrangThai: khData.trangThai,
        },
      });
      console.log(` Đã cập nhật khóa học: ${khData.tenKhoaHoc}`);
    } else {
      khoaHoc = await db.khoahoc.create({
        data: {
          TenKhoaHoc: khData.tenKhoaHoc,
          TrinhDoID: trinhDoItem.DanhMucID,
          HocPhi: khData.hocPhi,
          MoTa: khData.moTa,
          TrangThai: khData.trangThai,
          IsDeleted: false,
        },
      });
      console.log(` Đã tạo khóa học: ${khData.tenKhoaHoc}`);
    }

    createdKhoaHocs.push(khoaHoc);
  }

  // ==================================================
  // 3. Định nghĩa cấu trúc Bài học và Phần bài học
  // ==================================================

  const topicsByCourse = [
    // ===== KHÓA A1 =====
    {
      courseName: "Tiếng Anh Cơ Bản A1",
      topics: [
        {
          topicName: "Topic 1: Giới Thiệu Bản Thân",
          lessons: [
            { content: "Listening", title: "Nghe giới thiệu bản thân" },
            { content: "Speaking", title: "Nói về bản thân" },
            { content: "Reading", title: "Đọc đoạn văn giới thiệu" },
            { content: "Writing", title: "Viết đoạn giới thiệu" },
            { content: "Vocabulary", title: "Từ vựng chủ đề gia đình" },
            { content: "Grammar", title: "Ngữ pháp: To be" },
          ],
        },
        {
          topicName: "Topic 2: Gia Đình và Bạn Bè",
          lessons: [
            { content: "Listening", title: "Nghe về gia đình" },
            { content: "Speaking", title: "Nói về gia đình" },
            { content: "Reading", title: "Đọc về bạn bè" },
            { content: "Writing", title: "Viết về gia đình" },
            { content: "Vocabulary", title: "Từ vựng chủ đề gia đình" },
            { content: "Grammar", title: "Ngữ pháp: Sở hữu cách" },
          ],
        },
        {
          topicName: "Topic 3: Sở Thích",
          lessons: [
            { content: "Listening", title: "Nghe về sở thích" },
            { content: "Speaking", title: "Nói về sở thích" },
            { content: "Reading", title: "Đọc về sở thích" },
            { content: "Vocabulary", title: "Từ vựng chủ đề sở thích" },
            { content: "Grammar", title: "Ngữ pháp: Thì hiện tại đơn" },
          ],
        },
        {
          topicName: "Topic 4: Ăn Uống",
          lessons: [
            { content: "Listening", title: "Nghe về đồ ăn" },
            { content: "Speaking", title: "Nói về món ăn yêu thích" },
            { content: "Reading", title: "Đọc về ẩm thực" },
            { content: "Vocabulary", title: "Từ vựng chủ đề đồ ăn" },
            { content: "Grammar", title: "Ngữ pháp: Some/Any" },
          ],
        },
        {
          topicName: "Topic 5: Thời Gian",
          lessons: [
            { content: "Listening", title: "Nghe về thời gian" },
            { content: "Speaking", title: "Nói về lịch trình" },
            { content: "Reading", title: "Đọc về thời gian" },
            { content: "Vocabulary", title: "Từ vựng chủ đề thời gian" },
            { content: "Grammar", title: "Ngữ pháp: Giới từ chỉ thời gian" },
          ],
        },
        {
          topicName: "Topic 6: Công Việc và Học Tập",
          lessons: [
            { content: "Listening", title: "Nghe về công việc" },
            { content: "Speaking", title: "Nói về nghề nghiệp" },
            { content: "Reading", title: "Đọc về học tập" },
            { content: "Vocabulary", title: "Từ vựng chủ đề công việc" },
            { content: "Grammar", title: "Ngữ pháp: Thì hiện tại tiếp diễn" },
          ],
        },
        {
          topicName: "Topic 7: Mua Sắm",
          lessons: [
            { content: "Listening", title: "Nghe về mua sắm" },
            { content: "Speaking", title: "Nói về mua sắm" },
            { content: "Reading", title: "Đọc về cửa hàng" },
            { content: "Vocabulary", title: "Từ vựng chủ đề mua sắm" },
            { content: "Grammar", title: "Ngữ pháp: Tính từ chỉ số lượng" },
          ],
        },
        {
          topicName: "Topic 8: Ôn Tập",
          lessons: [
            { content: "Language focus", title: "Ôn tập từ vựng" },
            { content: "Language focus", title: "Ôn tập ngữ pháp" },
            { content: "Listening", title: "Ôn tập kỹ năng nghe" },
            { content: "Speaking", title: "Ôn tập kỹ năng nói" },
          ],
        },
        {
          topicName: "Topic 9: Bài Kiểm Tra Cuối Khóa",
          lessons: [
            { content: "Bài kiểm tra", title: "Kiểm tra từ vựng" },
            { content: "Bài kiểm tra", title: "Kiểm tra ngữ pháp" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng nghe" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng đọc" },
          ],
        },
      ],
    },

    // ===== KHÓA A2 =====
    {
      courseName: "Tiếng Anh Giao Tiếp A2",
      topics: [
        {
          topicName: "Topic 1: Du Lịch",
          lessons: [
            { content: "Listening", title: "Nghe về du lịch" },
            { content: "Speaking", title: "Nói về chuyến du lịch" },
            { content: "Reading", title: "Đọc về địa điểm du lịch" },
            { content: "Writing", title: "Viết về chuyến đi" },
            { content: "Vocabulary", title: "Từ vựng chủ đề du lịch" },
            { content: "Grammar", title: "Ngữ pháp: Thì quá khứ đơn" },
          ],
        },
        {
          topicName: "Topic 2: Sức Khỏe",
          lessons: [
            { content: "Listening", title: "Nghe về sức khỏe" },
            { content: "Speaking", title: "Nói về bệnh tật" },
            { content: "Reading", title: "Đọc về sức khỏe" },
            { content: "Vocabulary", title: "Từ vựng chủ đề sức khỏe" },
            { content: "Grammar", title: "Ngữ pháp: Should/Shouldn't" },
          ],
        },
        {
          topicName: "Topic 3: Công Nghệ",
          lessons: [
            { content: "Listening", title: "Nghe về công nghệ" },
            { content: "Speaking", title: "Nói về công nghệ" },
            { content: "Reading", title: "Đọc về công nghệ" },
            { content: "Vocabulary", title: "Từ vựng chủ đề công nghệ" },
            { content: "Grammar", title: "Ngữ pháp: So sánh hơn" },
          ],
        },
        {
          topicName: "Topic 4: Giao Tiếp Hàng Ngày",
          lessons: [
            { content: "Listening", title: "Nghe hội thoại hàng ngày" },
            { content: "Speaking", title: "Nói về cuộc sống hàng ngày" },
            { content: "Reading", title: "Đọc về thói quen" },
            { content: "Vocabulary", title: "Từ vựng chủ đề hàng ngày" },
            { content: "Grammar", title: "Ngữ pháp: Thì hiện tại hoàn thành" },
          ],
        },
        {
          topicName: "Topic 5: Văn Hóa",
          lessons: [
            { content: "Listening", title: "Nghe về văn hóa" },
            { content: "Speaking", title: "Nói về văn hóa" },
            { content: "Reading", title: "Đọc về văn hóa" },
            { content: "Vocabulary", title: "Từ vựng chủ đề văn hóa" },
            { content: "Grammar", title: "Ngữ pháp: Câu bị động" },
          ],
        },
        {
          topicName: "Topic 6: Ôn Tập",
          lessons: [
            { content: "Language focus", title: "Ôn tập từ vựng" },
            { content: "Language focus", title: "Ôn tập ngữ pháp" },
            { content: "Listening", title: "Ôn tập kỹ năng nghe" },
            { content: "Speaking", title: "Ôn tập kỹ năng nói" },
          ],
        },
        {
          topicName: "Topic 7: Bài Kiểm Tra Giữa Khóa",
          lessons: [
            { content: "Bài kiểm tra", title: "Kiểm tra từ vựng" },
            { content: "Bài kiểm tra", title: "Kiểm tra ngữ pháp" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng nghe" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng đọc" },
          ],
        },
      ],
    },

    // ===== KHÓA A3 =====
    {
      courseName: "Tiếng Anh Nâng Cao A3",
      topics: [
        {
          topicName: "Topic 1: Môi Trường",
          lessons: [
            { content: "Listening", title: "Nghe về môi trường" },
            { content: "Speaking", title: "Nói về vấn đề môi trường" },
            { content: "Reading", title: "Đọc về biến đổi khí hậu" },
            { content: "Writing", title: "Viết về bảo vệ môi trường" },
            { content: "Vocabulary", title: "Từ vựng chủ đề môi trường" },
            { content: "Grammar", title: "Ngữ pháp: Câu điều kiện" },
          ],
        },
        {
          topicName: "Topic 2: Kinh Doanh và Kinh Tế",
          lessons: [
            { content: "Listening", title: "Nghe về kinh doanh" },
            { content: "Speaking", title: "Nói về kinh tế" },
            { content: "Reading", title: "Đọc về kinh tế" },
            { content: "Vocabulary", title: "Từ vựng chủ đề kinh doanh" },
            { content: "Grammar", title: "Ngữ pháp: Mệnh đề quan hệ" },
          ],
        },
        {
          topicName: "Topic 3: Khoa Học và Công Nghệ",
          lessons: [
            { content: "Listening", title: "Nghe về khoa học" },
            { content: "Speaking", title: "Nói về công nghệ" },
            { content: "Reading", title: "Đọc về khoa học" },
            { content: "Vocabulary", title: "Từ vựng chủ đề khoa học" },
            { content: "Grammar", title: "Ngữ pháp: Câu tường thuật" },
          ],
        },
        {
          topicName: "Topic 4: Toàn Cầu Hóa",
          lessons: [
            { content: "Listening", title: "Nghe về toàn cầu hóa" },
            { content: "Speaking", title: "Nói về toàn cầu hóa" },
            { content: "Reading", title: "Đọc về toàn cầu hóa" },
            { content: "Vocabulary", title: "Từ vựng chủ đề toàn cầu hóa" },
            { content: "Grammar", title: "Ngữ pháp: Câu giả định" },
          ],
        },
        {
          topicName: "Topic 5: Nghệ Thuật và Giải Trí",
          lessons: [
            { content: "Listening", title: "Nghe về nghệ thuật" },
            { content: "Speaking", title: "Nói về phim ảnh" },
            { content: "Reading", title: "Đọc về nghệ thuật" },
            { content: "Vocabulary", title: "Từ vựng chủ đề nghệ thuật" },
            { content: "Grammar", title: "Ngữ pháp: Đảo ngữ" },
          ],
        },
        {
          topicName: "Topic 6: Ôn Tập",
          lessons: [
            { content: "Language focus", title: "Ôn tập từ vựng" },
            { content: "Language focus", title: "Ôn tập ngữ pháp" },
            { content: "Listening", title: "Ôn tập kỹ năng nghe" },
            { content: "Speaking", title: "Ôn tập kỹ năng nói" },
          ],
        },
        {
          topicName: "Topic 7: Bài Kiểm Tra Cuối Khóa",
          lessons: [
            { content: "Bài kiểm tra", title: "Kiểm tra từ vựng" },
            { content: "Bài kiểm tra", title: "Kiểm tra ngữ pháp" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng nghe" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng đọc" },
            { content: "Bài kiểm tra", title: "Kiểm tra kỹ năng viết" },
          ],
        },
      ],
    },
  ];

  // ==================================================
  // 4. Tạo Bài học và Phần bài học
  // ==================================================

  let totalBaiHoc = 0;
  let totalPhanBaiHoc = 0;
  let totalBaiKiemTra = 0;

  for (const courseData of topicsByCourse) {
    const khoaHoc = await db.khoahoc.findFirst({
      where: { TenKhoaHoc: courseData.courseName },
    });

    if (!khoaHoc) {
      console.warn(`⚠️ Không tìm thấy khóa học ${courseData.courseName}, bỏ qua`);
      continue;
    }

    console.log(`\n📚 Đang xử lý: ${courseData.courseName}`);

    for (let topicIndex = 0; topicIndex < courseData.topics.length; topicIndex++) {
      const topic = courseData.topics[topicIndex];

      // Tìm hoặc tạo Bài học (Topic)
      let baiHoc = await db.baihoc.findFirst({
        where: {
          KhoaHocID: khoaHoc.KhoaHocID,
          TenBaiHoc: topic.topicName,
        },
      });

      if (!baiHoc) {
        baiHoc = await db.baihoc.create({
          data: {
            KhoaHocID: khoaHoc.KhoaHocID,
            TenBaiHoc: topic.topicName,
            MoTa: `Bài học ${topicIndex + 1} của khóa học ${courseData.courseName}`,
            ThuTuHienThi: topicIndex + 1,
            TrangThai: baihoc_TrangThai.HIEN,
          },
        });
        console.log(`   Đã tạo Topic ${topicIndex + 1}/${courseData.topics.length}: ${topic.topicName}`);
      } else {
        // Cập nhật nếu đã tồn tại
        baiHoc = await db.baihoc.update({
          where: { BaiHocID: baiHoc.BaiHocID },
          data: {
            MoTa: `Bài học ${topicIndex + 1} của khóa học ${courseData.courseName}`,
            ThuTuHienThi: topicIndex + 1,
            TrangThai: baihoc_TrangThai.HIEN,
          },
        });
        console.log(`   Đã cập nhật Topic ${topicIndex + 1}: ${topic.topicName}`);
      }

      totalBaiHoc++;

      // Tạo các Phần bài học (Lessons)
      for (let lessonIndex = 0; lessonIndex < topic.lessons.length; lessonIndex++) {
        const lesson = topic.lessons[lessonIndex];

        // Lấy DanhMucID từ tên danh mục
        const loaiPhanBaiHocID = danhMucMap[lesson.content];

        if (!loaiPhanBaiHocID) {
          console.warn(`    ⚠️ Không tìm thấy danh mục ${lesson.content}, bỏ qua`);
          continue;
        }

        // Tạo Phần bài học với LoaiPhanBaiHocID
        const phanBaiHoc = await db.phanbaihoc.create({
          data: {
            BaiHocID: baiHoc.BaiHocID,
            LoaiPhanBaiHocID: loaiPhanBaiHocID, //  Gán danh mục
            TenPhanBaiHoc: lesson.title,
            TieuDe: `${lesson.content} - ${lesson.title}`,
            VideoUrl: `https://example.com/videos/${courseData.courseName
              .replace(/\s/g, "_")
              .replace(/[^a-zA-Z0-9_]/g, "")}_${topic.topicName
              .replace(/\s/g, "_")
              .replace(/[^a-zA-Z0-9_]/g, "")}_${lessonIndex + 1}.mp4`,
            ThuTuHienThi: lessonIndex + 1,
            TrangThai: phanbaihoc_TrangThai.HIEN,
          },
        });

        totalPhanBaiHoc++;

        // Nếu là danh mục "Bài kiểm tra", tạo bài kiểm tra
        if (lesson.content === "Bài kiểm tra" && baiKiemTraDanhMucID) {
          await db.baikiemtra.create({
            data: {
              PhanBaiHocID: phanBaiHoc.PhanBaiHocID,
              TenBaiKiemTra: lesson.title,
              ThoiGianBatDau: new Date(),
              ThoiGianLamBai: 60,
              DiemDat: 50,
              DiemMax: 100,
              TrangThai: baikiemtra_TrangThai.HIEN,
            },
          });
          totalBaiKiemTra++;
          console.log(`     Đã tạo Bài kiểm tra: ${lesson.title}`);
        } else {
          console.log(`     Đã tạo Lesson: ${lesson.title}`);
        }
      }
    }
  }

  // ==================================================
  // 5. Tổng kết
  // ==================================================

  console.log("\n Hoàn thành: Module 3 - Khóa Học.");
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${khoaHocData.length} khóa học`);
  console.log(`   - ${totalBaiHoc} bài học (Topics)`);
  console.log(`   - ${totalPhanBaiHoc} phần bài học (Lessons)`);
  console.log(`   - ${totalBaiKiemTra} bài kiểm tra`);

  // Hiển thị chi tiết từng khóa học
  console.log(`\n📋 Chi tiết các khóa học:`);
  for (const courseData of topicsByCourse) {
    const khoaHoc = await db.khoahoc.findFirst({
      where: { TenKhoaHoc: courseData.courseName },
    });

    if (khoaHoc) {
      const baiHocs = await db.baihoc.findMany({
        where: { KhoaHocID: khoaHoc.KhoaHocID },
        include: {
          phanbaihoc: {
            include: {
              loaiPhanBaiHoc: true, //  Lấy cả thông tin danh mục
              baikiemtra: true,
            },
          },
        },
        orderBy: { ThuTuHienThi: "asc" },
      });

      console.log(`\n  📚 ${khoaHoc.TenKhoaHoc}:`);
      console.log(`     - ${baiHocs.length} Topics`);
      for (const bh of baiHocs) {
        const lessonCount = bh.phanbaihoc.length;
        const testCount = bh.phanbaihoc.filter(p => p.baikiemtra).length;
        console.log(`       • ${bh.TenBaiHoc} (${lessonCount} lessons, ${testCount} tests)`);
        
        // Hiển thị chi tiết từng phần bài học
        for (const pb of bh.phanbaihoc) {
          const loai = pb.loaiPhanBaiHoc?.TenDanhMuc || "Không xác định";
          const isTest = pb.baikiemtra ? "📝" : "📚";
          console.log(`         ${isTest} ${pb.TenPhanBaiHoc} (${loai})`);
        }
      }
    }
  }
}