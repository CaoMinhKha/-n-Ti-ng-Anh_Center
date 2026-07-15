// prisma/seeds/module4_cauhoi.seed.ts

import {
  PrismaClient,
  cauhoi_LoaiCauHoi,
  cauhoi_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule4CauHoi(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 4 - Câu Hỏi và Đáp Án...");

  // ==================================================
  // 1. Lấy danh sách các phần bài học đã tạo
  // ==================================================
  const phanBaiHocs = await db.phanbaihoc.findMany({
    include: {
      baihoc: {
        include: {
          khoahoc: true,
        },
      },
      loaiPhanBaiHoc: true,
      baikiemtra: true, //  Lấy danh sách bài kiểm tra (có thể nhiều)
    },
    orderBy: {
      ThuTuHienThi: "asc",
    },
  });

  if (phanBaiHocs.length === 0) {
    throw new Error("❌ Không tìm thấy phần bài học nào. Vui lòng chạy Module 3 trước!");
  }

  console.log(` Tìm thấy ${phanBaiHocs.length} phần bài học`);

  // Lấy danh mục Nội dung học
  const noiDungHoc = await db.danhmuc.findFirst({
    where: { TenDanhMuc: "Nội dung học" },
  });

  if (!noiDungHoc) {
    throw new Error("❌ Không tìm thấy danh mục Nội dung học!");
  }

  const noiDungHocList = await db.danhmuc.findMany({
    where: { DanhMucChaID: noiDungHoc.DanhMucID },
  });

  // Tạo map để tra cứu
  const danhMucMap: Record<string, number> = {};
  for (const dm of noiDungHocList) {
    danhMucMap[dm.TenDanhMuc] = dm.DanhMucID;
  }

  // Lấy ID của danh mục "Bài kiểm tra"
  const baiKiemTraDanhMucID = danhMucMap["Bài kiểm tra"];

  // ==================================================
  // 2. Tạo Câu hỏi cho từng phần bài học
  // ==================================================

  let totalCauHoi = 0;
  let totalDapAn = 0;
  let totalCauHoiChoBaiKiemTra = 0;

  for (const phanBai of phanBaiHocs) {
    const tenPhanBai = phanBai.TenPhanBaiHoc.toLowerCase();
    const tieuDe = phanBai.TieuDe || "";
    const loaiDanhMuc = phanBai.loaiPhanBaiHoc?.TenDanhMuc || "";
    const isBaiKiemTra = phanBai.LoaiPhanBaiHocID === baiKiemTraDanhMucID;

    console.log(`\n📝 Đang tạo câu hỏi cho: ${phanBai.TenPhanBaiHoc} (${loaiDanhMuc})`);

    // ==================================================
    // 2.1. Nếu là Bài kiểm tra - Tạo câu hỏi trắc nghiệm tổng hợp
    // ==================================================
    if (isBaiKiemTra) {
      console.log(`  📝 Đây là bài kiểm tra, tạo câu hỏi đánh giá...`);

      const cauHoiData = [
        {
          noiDung: `Câu 1: Trong bài học, từ vựng nào được nhắc đến nhiều nhất?`,
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Từ vựng A", isCorrect: true },
            { text: "Từ vựng B", isCorrect: false },
            { text: "Từ vựng C", isCorrect: false },
            { text: "Từ vựng D", isCorrect: false },
          ],
        },
        {
          noiDung: `Câu 2: Chọn đáp án đúng về nội dung bài học.`,
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Nội dung A", isCorrect: true },
            { text: "Nội dung B", isCorrect: false },
            { text: "Nội dung C", isCorrect: false },
            { text: "Nội dung D", isCorrect: false },
          ],
        },
        {
          noiDung: `Câu 3: Điền từ còn thiếu vào chỗ trống.`,
          loai: cauhoi_LoaiCauHoi.DIEN_VAO_CHO_TRONG,
          dapAn: [
            { text: "Đáp án đúng", isCorrect: true },
          ],
        },
        {
          noiDung: `Câu 4: Nhận định nào sau đây là ĐÚNG về bài học?`,
          loai: cauhoi_LoaiCauHoi.DUNG_SAI,
          dapAn: [
            { text: "Đúng", isCorrect: true },
            { text: "Sai", isCorrect: false },
          ],
        },
        {
          noiDung: `Câu 5: Chọn tất cả các đáp án đúng.`,
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_NHIEU_DAP_AN,
          dapAn: [
            { text: "Đáp án A", isCorrect: true },
            { text: "Đáp án B", isCorrect: false },
            { text: "Đáp án C", isCorrect: true },
            { text: "Đáp án D", isCorrect: false },
          ],
        },
      ];

      // Tạo các câu hỏi cho bài kiểm tra
      for (const q of cauHoiData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;
        totalCauHoiChoBaiKiemTra++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        // Liên kết câu hỏi với phần bài học (bài kiểm tra)
        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi cho bài kiểm tra`);

      //  Sửa: Kiểm tra xem có bài kiểm tra nào không (baikiemtra là mảng)
      if (phanBai.baikiemtra && phanBai.baikiemtra.length > 0) {
        // Lấy tất cả câu hỏi vừa tạo của phần bài học này
        const cauHoiPhanBai = await db.phanbaihoc_cauhoi.findMany({
          where: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
          },
          include: {
            cauhoi: true,
          },
        });

        //  Lặp qua từng bài kiểm tra trong mảng
        for (const baiKiemTra of phanBai.baikiemtra) {
          for (const ch of cauHoiPhanBai) {
            await db.baikiemtra_cauhoi.create({
              data: {
                BaiKiemTraID: baiKiemTra.BaiKiemTraID,
                CauHoiID: ch.CauHoiID,
                ThuTuHienThi: 1,
              },
            });
          }
          console.log(`   Đã liên kết ${cauHoiPhanBai.length} câu hỏi với bài kiểm tra: ${baiKiemTra.TenBaiKiemTra}`);
        }
      }

      continue; // Bỏ qua các phần xử lý khác
    }

    // ==================================================
    // 2.2. Listening - Tạo câu hỏi nghe hiểu
    // ==================================================
    if (loaiDanhMuc === "Listening" || tieuDe.includes("Listening") || tenPhanBai.includes("nghe")) {
      // Tạo câu hỏi cha
      const cauHoiCha = await db.cauhoi.create({
        data: {
          LoaiCauHoi: cauhoi_LoaiCauHoi.NGHE_HIEU,
          TieuDe: "🎧 Bài tập nghe hiểu",
          NoiDungText:
            "Nghe đoạn hội thoại sau và trả lời các câu hỏi bên dưới:\n\n" +
            "A: 'Hi, how are you doing today?'\n" +
            "B: 'I'm doing great, thanks! How about you?'\n" +
            "A: 'I'm good too. Are you free this weekend?'\n" +
            "B: 'Yes, I am. What do you have in mind?'\n" +
            "A: 'I was thinking we could go to the cinema.'\n" +
            "B: 'That sounds like a great idea!'",
          NoiDungUrl: "https://example.com/audio/listening_sample.mp3",
          ThuTuHienThi: 1,
          TrangThai: cauhoi_TrangThai.HIEN,
        },
      });
      totalCauHoi++;
      console.log(`   Đã tạo câu hỏi cha: Nghe hiểu`);

      // Tạo các câu hỏi con
      const cauHoiConData = [
        {
          noiDung: "How is person B feeling?",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Great", isCorrect: true },
            { text: "Tired", isCorrect: false },
            { text: "Sad", isCorrect: false },
            { text: "Busy", isCorrect: false },
          ],
        },
        {
          noiDung: "What does person A want to do this weekend?",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Go to the cinema", isCorrect: true },
            { text: "Go shopping", isCorrect: false },
            { text: "Stay at home", isCorrect: false },
            { text: "Go to the beach", isCorrect: false },
          ],
        },
        {
          noiDung: "Person B thinks the idea is...",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Great", isCorrect: true },
            { text: "Boring", isCorrect: false },
            { text: "Expensive", isCorrect: false },
            { text: "Strange", isCorrect: false },
          ],
        },
        {
          noiDung: "The conversation is about making plans.",
          loai: cauhoi_LoaiCauHoi.DUNG_SAI,
          dapAn: [
            { text: "Đúng", isCorrect: true },
            { text: "Sai", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiConData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            CauHoiChaID: cauHoiCha.CauHoiID,
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiConData.length} câu hỏi con`);
    }

    // ==================================================
    // 2.3. Reading - Tạo câu hỏi đọc hiểu
    // ==================================================
    else if (loaiDanhMuc === "Reading" || tieuDe.includes("Reading") || tenPhanBai.includes("đọc")) {
      const cauHoiCha = await db.cauhoi.create({
        data: {
          LoaiCauHoi: cauhoi_LoaiCauHoi.DOC_HIEU,
          TieuDe: "📖 Bài tập đọc hiểu",
          NoiDungText:
            "Đọc đoạn văn sau và trả lời các câu hỏi bên dưới:\n\n" +
            "Giáo dục là chìa khóa của thành công. Nhiều nghiên cứu đã chỉ ra rằng " +
            "những người có trình độ học vấn cao thường có thu nhập tốt hơn và " +
            "cuộc sống hạnh phúc hơn. Tuy nhiên, không phải ai cũng có cơ hội " +
            "tiếp cận với giáo dục chất lượng. Vì vậy, các chính phủ cần đầu tư " +
            "nhiều hơn vào hệ thống giáo dục để đảm bảo mọi người đều có cơ hội " +
            "học tập và phát triển bản thân.",
          ThuTuHienThi: 1,
          TrangThai: cauhoi_TrangThai.HIEN,
        },
      });
      totalCauHoi++;
      console.log(`   Đã tạo câu hỏi cha: Đọc hiểu`);

      const cauHoiConData = [
        {
          noiDung: "Giáo dục được ví như gì trong đoạn văn?",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Chìa khóa của thành công", isCorrect: true },
            { text: "Gánh nặng của xã hội", isCorrect: false },
            { text: "Lãng phí thời gian", isCorrect: false },
            { text: "Không quan trọng", isCorrect: false },
          ],
        },
        {
          noiDung: "Theo đoạn văn, người có trình độ học vấn cao thường như thế nào?",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Có thu nhập tốt và cuộc sống hạnh phúc", isCorrect: true },
            { text: "Có thu nhập thấp", isCorrect: false },
            { text: "Không hạnh phúc", isCorrect: false },
            { text: "Thất nghiệp", isCorrect: false },
          ],
        },
        {
          noiDung: "Các chính phủ cần làm gì để giải quyết vấn đề?",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Đầu tư nhiều hơn vào giáo dục", isCorrect: true },
            { text: "Cắt giảm ngân sách giáo dục", isCorrect: false },
            { text: "Bỏ qua hệ thống giáo dục", isCorrect: false },
            { text: "Không quan tâm đến giáo dục", isCorrect: false },
          ],
        },
        {
          noiDung: "Mọi người đều có cơ hội tiếp cận với giáo dục chất lượng.",
          loai: cauhoi_LoaiCauHoi.DUNG_SAI,
          dapAn: [
            { text: "Đúng", isCorrect: false },
            { text: "Sai", isCorrect: true },
          ],
        },
        {
          noiDung: "Chọn tất cả các lợi ích của giáo dục được đề cập trong đoạn văn:",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_NHIEU_DAP_AN,
          dapAn: [
            { text: "Thu nhập tốt hơn", isCorrect: true },
            { text: "Cuộc sống hạnh phúc hơn", isCorrect: true },
            { text: "Nổi tiếng", isCorrect: false },
            { text: "Được tôn trọng", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiConData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            CauHoiChaID: cauHoiCha.CauHoiID,
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiConData.length} câu hỏi con`);
    }

    // ==================================================
    // 2.4. Speaking - Câu hỏi nói
    // ==================================================
    else if (loaiDanhMuc === "Speaking" || tieuDe.includes("Speaking") || tenPhanBai.includes("nói")) {
      const cauHoiData = [
        {
          noiDung: "Hãy mô tả về bản thân bạn trong 3 câu (tên, tuổi, sở thích).",
          loai: cauhoi_LoaiCauHoi.DIEN_VAO_CHO_TRONG,
          dapAn: [
            { text: "My name is John. I am 20 years old. I like reading books.", isCorrect: true },
          ],
        },
        {
          noiDung: "Bạn thích môn học nào nhất và tại sao?",
          loai: cauhoi_LoaiCauHoi.DIEN_VAO_CHO_TRONG,
          dapAn: [
            { text: "I like English because it's interesting and useful.", isCorrect: true },
          ],
        },
        {
          noiDung: "Sắp xếp các câu sau thành một đoạn hội thoại hoàn chỉnh:",
          loai: cauhoi_LoaiCauHoi.SAP_XEP,
          dapAn: [
            { text: "Hi, how are you?", isCorrect: false },
            { text: "I'm fine, thank you.", isCorrect: false },
            { text: "What's your name?", isCorrect: false },
            { text: "My name is John.", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect || false,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi`);
    }

    // ==================================================
    // 2.5. Writing - Câu hỏi viết
    // ==================================================
    else if (loaiDanhMuc === "Writing" || tieuDe.includes("Writing") || tenPhanBai.includes("viết")) {
      const cauHoiData = [
        {
          noiDung: "Viết một đoạn văn ngắn (50-80 từ) về gia đình của bạn.",
          loai: cauhoi_LoaiCauHoi.DIEN_VAO_CHO_TRONG,
          dapAn: [
            {
              text: "My family has four members: my parents, my sister and me. We live in Hanoi. My father is a teacher and my mother is a nurse. I love my family very much.",
              isCorrect: true,
            },
          ],
        },
        {
          noiDung: "Hoàn thành câu sau: 'I _____ to school every day.'",
          loai: cauhoi_LoaiCauHoi.DIEN_VAO_CHO_TRONG,
          dapAn: [{ text: "go", isCorrect: true }],
        },
      ];

      for (const q of cauHoiData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi`);
    }

    // ==================================================
    // 2.6. Vocabulary - Câu hỏi từ vựng
    // ==================================================
    else if (loaiDanhMuc === "Vocabulary" || tieuDe.includes("Vocabulary") || tenPhanBai.includes("từ vựng")) {
      const cauHoiData = [
        {
          noiDung: 'Từ đồng nghĩa với "happy" là gì?',
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Joyful", isCorrect: true },
            { text: "Sad", isCorrect: false },
            { text: "Angry", isCorrect: false },
            { text: "Tired", isCorrect: false },
          ],
        },
        {
          noiDung: 'Nối từ với nghĩa tương ứng:',
          loai: cauhoi_LoaiCauHoi.NOI_CAP,
          dapAn: [
            { text: "Big", isCorrect: false, GiaTriKhop: "A" },
            { text: "Small", isCorrect: false, GiaTriKhop: "B" },
            { text: "Fast", isCorrect: false, GiaTriKhop: "C" },
            { text: "Lớn", isCorrect: false, GiaTriKhop: null },
            { text: "Nhỏ", isCorrect: false, GiaTriKhop: null },
            { text: "Nhanh", isCorrect: false, GiaTriKhop: null },
          ],
        },
        {
          noiDung: "Chọn tất cả các từ liên quan đến trường học:",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_NHIEU_DAP_AN,
          dapAn: [
            { text: "Teacher", isCorrect: true },
            { text: "Student", isCorrect: true },
            { text: "Hospital", isCorrect: false },
            { text: "Classroom", isCorrect: true },
          ],
        },
      ];

      for (const q of cauHoiData) {
        if (q.loai === cauhoi_LoaiCauHoi.NOI_CAP) {
          const cauHoi = await db.cauhoi.create({
            data: {
              LoaiCauHoi: q.loai,
              NoiDungText: q.noiDung,
              DuLieuPhu: JSON.stringify(["Từ vựng", "Nghĩa"]),
              ThuTuHienThi: 1,
              TrangThai: cauhoi_TrangThai.HIEN,
            },
          });
          totalCauHoi++;

          for (let i = 0; i < q.dapAn.length; i++) {
            const da = q.dapAn[i];
            await db.dapan.create({
              data: {
                CauHoiID: cauHoi.CauHoiID,
                NoiDungText: da.text,
                LaDapAnDung: da.isCorrect || false,
                ThuTuHienThi: i + 1,
                GiaTriKhop: da.GiaTriKhop || null,
              },
            });
            totalDapAn++;
          }

          await db.phanbaihoc_cauhoi.create({
            data: {
              PhanBaiHocID: phanBai.PhanBaiHocID,
              CauHoiID: cauHoi.CauHoiID,
              ThuTuHienThi: 1,
            },
          });
        } else {
          const cauHoi = await db.cauhoi.create({
            data: {
              LoaiCauHoi: q.loai,
              NoiDungText: q.noiDung,
              ThuTuHienThi: 1,
              TrangThai: cauhoi_TrangThai.HIEN,
            },
          });
          totalCauHoi++;

          for (let i = 0; i < q.dapAn.length; i++) {
            const da = q.dapAn[i];
            await db.dapan.create({
              data: {
                CauHoiID: cauHoi.CauHoiID,
                NoiDungText: da.text,
                LaDapAnDung: da.isCorrect || false,
                ThuTuHienThi: i + 1,
              },
            });
            totalDapAn++;
          }

          await db.phanbaihoc_cauhoi.create({
            data: {
              PhanBaiHocID: phanBai.PhanBaiHocID,
              CauHoiID: cauHoi.CauHoiID,
              ThuTuHienThi: 1,
            },
          });
        }
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi từ vựng`);
    }

    // ==================================================
    // 2.7. Grammar - Câu hỏi ngữ pháp
    // ==================================================
    else if (loaiDanhMuc === "Grammar" || tieuDe.includes("Grammar") || tenPhanBai.includes("ngữ pháp")) {
      const cauHoiData = [
        {
          noiDung: 'Chọn động từ đúng: "She _____ to school every day."',
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "go", isCorrect: false },
            { text: "goes", isCorrect: true },
            { text: "going", isCorrect: false },
            { text: "went", isCorrect: false },
          ],
        },
        {
          noiDung: 'Câu nào đúng ngữ pháp?',
          loai: cauhoi_LoaiCauHoi.DUNG_SAI,
          dapAn: [
            { text: "'I am a student.' - Đúng", isCorrect: true },
            { text: "'I is a student.' - Sai", isCorrect: false },
          ],
        },
        {
          noiDung: 'Hoàn thành câu: "She _____ (read) a book now."',
          loai: cauhoi_LoaiCauHoi.DIEN_VAO_CHO_TRONG,
          dapAn: [{ text: "is reading", isCorrect: true }],
        },
        {
          noiDung: 'Sắp xếp các từ thành câu hoàn chỉnh:',
          loai: cauhoi_LoaiCauHoi.SAP_XEP,
          dapAn: [
            { text: "I", isCorrect: false },
            { text: "to", isCorrect: false },
            { text: "school", isCorrect: false },
            { text: "go", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect || false,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi ngữ pháp`);
    }

    // ==================================================
    // 2.8. Pronunciation - Câu hỏi phát âm
    // ==================================================
    else if (loaiDanhMuc === "Pronunciation" || tieuDe.includes("Pronunciation") || tenPhanBai.includes("phát âm")) {
      const cauHoiData = [
        {
          noiDung: 'Từ nào có phát âm khác với các từ còn lại?',
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Cat", isCorrect: false },
            { text: "Hat", isCorrect: false },
            { text: "Fat", isCorrect: false },
            { text: "Car", isCorrect: true },
          ],
        },
        {
          noiDung: 'Chọn từ có trọng âm rơi vào âm tiết thứ nhất:',
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Teacher", isCorrect: true },
            { text: "Student", isCorrect: false },
            { text: "Computer", isCorrect: false },
            { text: "Example", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect || false,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi phát âm`);
    }

    // ==================================================
    // 2.9. Language focus / Review - Câu hỏi ôn tập
    // ==================================================
    else if (
      loaiDanhMuc === "Language focus" ||
      tieuDe.includes("Language focus") ||
      tieuDe.includes("Review") ||
      tenPhanBai.includes("ôn tập")
    ) {
      const cauHoiData = [
        {
          noiDung: 'Ôn tập: "What is the past tense of go?"',
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "go", isCorrect: false },
            { text: "went", isCorrect: true },
            { text: "gone", isCorrect: false },
            { text: "going", isCorrect: false },
          ],
        },
        {
          noiDung: 'Phân loại các từ sau vào nhóm:',
          loai: cauhoi_LoaiCauHoi.PHAN_LOAI,
          dapAn: [
            { text: "Apple", isCorrect: false, GiaTriKhop: "Fruit" },
            { text: "Banana", isCorrect: false, GiaTriKhop: "Fruit" },
            { text: "Cat", isCorrect: false, GiaTriKhop: "Animal" },
            { text: "Dog", isCorrect: false, GiaTriKhop: "Animal" },
            { text: "Car", isCorrect: false, GiaTriKhop: "Vehicle" },
            { text: "Bus", isCorrect: false, GiaTriKhop: "Vehicle" },
          ],
        },
        {
          noiDung: "Chọn tất cả các danh từ trong danh sách:",
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_NHIEU_DAP_AN,
          dapAn: [
            { text: "Book", isCorrect: true },
            { text: "Run", isCorrect: false },
            { text: "Table", isCorrect: true },
            { text: "Beautiful", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiData) {
        if (q.loai === cauhoi_LoaiCauHoi.PHAN_LOAI) {
          const cauHoi = await db.cauhoi.create({
            data: {
              LoaiCauHoi: q.loai,
              NoiDungText: q.noiDung,
              DuLieuPhu: JSON.stringify(["Fruit", "Animal", "Vehicle"]),
              ThuTuHienThi: 1,
              TrangThai: cauhoi_TrangThai.HIEN,
            },
          });
          totalCauHoi++;

          for (let i = 0; i < q.dapAn.length; i++) {
            const da = q.dapAn[i];
            await db.dapan.create({
              data: {
                CauHoiID: cauHoi.CauHoiID,
                NoiDungText: da.text,
                LaDapAnDung: da.isCorrect || false,
                ThuTuHienThi: i + 1,
                GiaTriKhop: da.GiaTriKhop || null,
              },
            });
            totalDapAn++;
          }

          await db.phanbaihoc_cauhoi.create({
            data: {
              PhanBaiHocID: phanBai.PhanBaiHocID,
              CauHoiID: cauHoi.CauHoiID,
              ThuTuHienThi: 1,
            },
          });
        } else {
          const cauHoi = await db.cauhoi.create({
            data: {
              LoaiCauHoi: q.loai,
              NoiDungText: q.noiDung,
              ThuTuHienThi: 1,
              TrangThai: cauhoi_TrangThai.HIEN,
            },
          });
          totalCauHoi++;

          for (let i = 0; i < q.dapAn.length; i++) {
            const da = q.dapAn[i];
            await db.dapan.create({
              data: {
                CauHoiID: cauHoi.CauHoiID,
                NoiDungText: da.text,
                LaDapAnDung: da.isCorrect || false,
                ThuTuHienThi: i + 1,
              },
            });
            totalDapAn++;
          }

          await db.phanbaihoc_cauhoi.create({
            data: {
              PhanBaiHocID: phanBai.PhanBaiHocID,
              CauHoiID: cauHoi.CauHoiID,
              ThuTuHienThi: 1,
            },
          });
        }
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi ôn tập`);
    }

    // ==================================================
    // 2.10. Default - Câu hỏi mặc định
    // ==================================================
    else {
      const cauHoiData = [
        {
          noiDung: `Câu hỏi 1: ${phanBai.TenPhanBaiHoc}`,
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Đáp án đúng", isCorrect: true },
            { text: "Đáp án sai 1", isCorrect: false },
            { text: "Đáp án sai 2", isCorrect: false },
            { text: "Đáp án sai 3", isCorrect: false },
          ],
        },
        {
          noiDung: `Câu hỏi 2: ${phanBai.TenPhanBaiHoc}`,
          loai: cauhoi_LoaiCauHoi.TRAC_NGHIEM_MOT_DAP_AN,
          dapAn: [
            { text: "Lựa chọn A", isCorrect: false },
            { text: "Lựa chọn B", isCorrect: true },
            { text: "Lựa chọn C", isCorrect: false },
            { text: "Lựa chọn D", isCorrect: false },
          ],
        },
      ];

      for (const q of cauHoiData) {
        const cauHoi = await db.cauhoi.create({
          data: {
            LoaiCauHoi: q.loai,
            NoiDungText: q.noiDung,
            ThuTuHienThi: 1,
            TrangThai: cauhoi_TrangThai.HIEN,
          },
        });
        totalCauHoi++;

        for (let i = 0; i < q.dapAn.length; i++) {
          const da = q.dapAn[i];
          await db.dapan.create({
            data: {
              CauHoiID: cauHoi.CauHoiID,
              NoiDungText: da.text,
              LaDapAnDung: da.isCorrect,
              ThuTuHienThi: i + 1,
            },
          });
          totalDapAn++;
        }

        await db.phanbaihoc_cauhoi.create({
          data: {
            PhanBaiHocID: phanBai.PhanBaiHocID,
            CauHoiID: cauHoi.CauHoiID,
            ThuTuHienThi: 1,
          },
        });
      }

      console.log(`   Đã tạo ${cauHoiData.length} câu hỏi mặc định`);
    }
  }

  // ==================================================
  // 3. Tổng kết
  // ==================================================

  console.log("\n Hoàn thành: Module 4 - Câu Hỏi và Đáp Án.");
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${totalCauHoi} câu hỏi`);
  console.log(`   - ${totalDapAn} đáp án`);
  console.log(`   - ${totalCauHoiChoBaiKiemTra} câu hỏi cho bài kiểm tra`);
  console.log(`   - ${await db.phanbaihoc_cauhoi.count()} liên kết PhanBaiHoc-CauHoi`);
  console.log(`   - ${await db.baikiemtra_cauhoi.count()} liên kết BaiKiemTra-CauHoi`);
}