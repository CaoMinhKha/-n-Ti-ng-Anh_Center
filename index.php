<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

function getRequestPath() {
    if (!empty($_GET['request'])) {
        return trim($_GET['request']);
    }

    $scriptName = $_SERVER['SCRIPT_NAME'];
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $basePath = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');

    if ($basePath !== '' && strpos($requestUri, $basePath) === 0) {
        $requestUri = substr($requestUri, strlen($basePath));
    }

    $requestUri = trim($requestUri, '/');
    if ($requestUri === 'index.php') {
        return '';
    }
    return $requestUri;
}

function authorizeRequest($route, $method, $user) {
    $permissions = [
        'admin' => ['*'],
        'teacher' => [
            'GET_hocvien', 'GET_giaovien', 'GET_khoahoc', 'GET_lophoc', 'GET_baihoc', 'GET_cauhoi', 'GET_dapan', 'GET_baikiemtra', 'GET_dangkylop', 'GET_chuyencan', 'GET_tiendohoc', 'GET_danhgia', 'GET_baocao',
            'POST_chuyencan', 'PUT_chuyencan', 'DELETE_chuyencan',
            'POST_tiendohoc', 'PUT_tiendohoc',
            'POST_danhgia', 'PUT_danhgia', 'DELETE_danhgia',
            'GET_quantrivien'
        ],
        'student' => [
            'GET_hocvien', 'PUT_hocvien', 'GET_khoahoc', 'GET_lophoc', 'GET_baihoc', 'GET_cauhoi', 'GET_dapan', 'GET_baikiemtra', 'GET_dangkylop', 'POST_dangkylop', 'DELETE_dangkylop', 'GET_tiendohoc', 'GET_danhgia'
        ],
    ];

    $role = $user['role'] ?? '';
    if (!isset($permissions[$role])) {
        return false;
    }
    if (in_array('*', $permissions[$role], true)) {
        return true;
    }
    return in_array("{$method}_{$route}", $permissions[$role], true);
}

$requestPath = getRequestPath();
$pathParts = explode('/', trim($requestPath, '/'));
$request = $pathParts[0] ?? '';
if (isset($pathParts[1]) && is_numeric($pathParts[1]) && !isset($_GET['id'])) {
    $_GET['id'] = $pathParts[1];
}
$method = $_SERVER['REQUEST_METHOD'];
$input = parseRequestBody();

$routes = [
    'dangnhap' => ['POST'],
    'quantrivien' => ['GET', 'POST', 'PUT', 'DELETE'],
    'hocvien' => ['GET', 'POST', 'PUT', 'DELETE'],
    'giaovien' => ['GET', 'POST', 'PUT', 'DELETE'],
    'khoahoc' => ['GET', 'POST', 'PUT', 'DELETE'],
    'lophoc' => ['GET', 'POST', 'PUT', 'DELETE'],
    'baihoc' => ['GET', 'POST', 'PUT', 'DELETE'],
    'cauhoi' => ['GET', 'POST', 'PUT', 'DELETE'],
    'dapan' => ['GET', 'POST', 'PUT', 'DELETE'],
    'baikiemtra' => ['GET', 'POST', 'PUT', 'DELETE'],
    'dangkylop' => ['GET', 'POST', 'PUT', 'DELETE'],
    'chuyencan' => ['GET', 'POST', 'PUT', 'DELETE'],
    'tiendohoc' => ['GET', 'POST', 'PUT'],
    'danhgia' => ['GET', 'POST', 'PUT', 'DELETE'],
    'ketquakiemtra' => ['GET', 'POST'],
    'baocao' => ['GET'],
    'elearning' => ['GET'],
    'dictionary' => ['GET'],
    'dictionary/quick' => ['GET'],
];

if ($request === '') {
    sendResponse(['status' => false, 'message' => 'Không tìm thấy endpoint API'], 404);
}

if (!array_key_exists($request, $routes)) {
    sendResponse(['status' => false, 'message' => 'Không tìm thấy endpoint API'], 404);
}
if (!in_array($method, $routes[$request])) {
    sendResponse(['status' => false, 'message' => 'Phương thức không được phép'], 405);
}

$user = getRequestUser();
if ($request !== 'dangnhap' && !($request === 'hocvien' && $method === 'POST') && !($request === 'hocvien' && $method === 'GET') && $request !== 'elearning' && $request !== 'dictionary' && $request !== 'dictionary/quick') {
    if (!$user) {
        sendResponse(['status' => false, 'message' => 'Token không hợp lệ hoặc đã hết hạn'], 401);
    }
    if (!authorizeRequest($request, $method, $user)) {
        sendResponse(['status' => false, 'message' => 'Không có quyền truy cập'], 403);
    }
}

switch ($request) {
    case 'dangnhap':
        $response = handleLogin($input);
        break;
    case 'hocvien':
        $response = handleStudents($method, $input);
        break;
    case 'giaovien':
        $response = handleTeachers($method, $input);
        break;
    case 'quantrivien':
        $response = handleAdmins($method, $input);
        break;
    case 'khoahoc':
        $response = handleCourses($method, $input);
        break;
    case 'lophoc':
        $response = handleClasses($method, $input);
        break;
    case 'baihoc':
        $response = handleLessons($method, $input);
        break;
    case 'cauhoi':
        $response = handleQuestions($method, $input);
        break;
    case 'dapan':
        $response = handleAnswers($method, $input);
        break;
    case 'baikiemtra':
        $response = handleExams($method, $input);
        break;
    case 'dangkylop':
        $response = handleEnrollments($method, $input);
        break;
    case 'chuyencan':
        $response = handleAttendance($method, $input);
        break;
    case 'tiendohoc':
        $response = handleProgress($method, $input);
        break;
    case 'danhgia':
        $response = handleReviews($method, $input);
        break;
    case 'ketquakiemtra':
        $response = handleExamResults($method, $input);
        break;
    case 'baocao':
        $response = handleReports();
        break;
    case 'elearning':
        $response = handleELearning($_GET);
        break;
    case 'dictionary':
        $response = handleDictionary($_GET);
        break;
    case 'dictionary/quick':
        $response = handleDictionaryQuick($_GET);
        break;
    default:
        $response = ['status' => false, 'message' => 'Yêu cầu không hợp lệ'];
        break;
}

sendResponse($response);

function handleLogin($input) {
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');
    if ($username === '' || $password === '') {
        return ['status' => false, 'message' => 'Tên đăng nhập và mật khẩu bắt buộc'];
    }

    $users = [
        ['table' => 'QuanTriVien', 'role' => 'admin'],
        ['table' => 'GiaoVien', 'role' => 'teacher'],
        ['table' => 'HocVien', 'role' => 'student'],
    ];

    $conn = getDbConnection();
    foreach ($users as $user) {
        $stmt = $conn->prepare("SELECT * FROM {$user['table']} WHERE TenDangNhap = ? AND MatKhau = ? LIMIT 1");
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            unset($row['MatKhau']);
            $row['role'] = $user['role'];
            $row['type'] = $user['table'];
            $payload = [
                'sub' => $row['MaQuanTriVien'] ?? $row['MaGiaoVien'] ?? $row['MaHocVien'] ?? 0,
                'role' => $user['role'],
                'type' => $user['table'],
                'exp' => time() + 3600,
                'username' => $row['TenDangNhap'] ?? ''
            ];
            $token = createJWT($payload);
            $stmt->close();
            $conn->close();
            return ['status' => true, 'message' => 'Đăng nhập thành công', 'token' => $token, 'data' => $row, 'user' => [
                'id' => $row['MaQuanTriVien'] ?? $row['MaGiaoVien'] ?? $row['MaHocVien'] ?? 0,
                'role' => $user['role'],
                'type' => $user['table'],
                'name' => $row['HoTen'] ?? $row['TenDangNhap'] ?? '',
            ]];
        }
        $stmt->close();
    }
    $conn->close();
    return ['status' => false, 'message' => 'Tên đăng nhập hoặc mật khẩu sai'];
}

function handleStudents($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM HocVien WHERE MaHocVien = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM HocVien');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO HocVien (TenDangNhap, MatKhau, HoTen, Email, NgaySinh, GioiTinh, TrangThai, SoDienThoai, DiaChi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssssiss',
            $input['TenDangNhap'] ?? '',
            $input['MatKhau'] ?? '',
            $input['HoTen'] ?? '',
            $input['Email'] ?? '',
            $input['NgaySinh'] ?? null,
            $input['GioiTinh'] ?? 0,
            $input['TrangThai'] ?? 1,
            $input['SoDienThoai'] ?? null,
            $input['DiaChi'] ?? null
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo học viên thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        if (!isset($input['MatKhau']) || trim((string)($input['MatKhau'] ?? '')) === '') {
            $stmt = $conn->prepare('UPDATE HocVien SET TenDangNhap = ?, HoTen = ?, Email = ?, NgaySinh = ?, GioiTinh = ?, TrangThai = ?, SoDienThoai = ?, DiaChi = ? WHERE MaHocVien = ?');
            $stmt->bind_param('ssssiissi',
                $input['TenDangNhap'] ?? '',
                $input['HoTen'] ?? '',
                $input['Email'] ?? '',
                $input['NgaySinh'] ?? null,
                $input['GioiTinh'] ?? 0,
                $input['TrangThai'] ?? 1,
                $input['SoDienThoai'] ?? null,
                $input['DiaChi'] ?? null,
                $id
            );
        } else {
            $stmt = $conn->prepare('UPDATE HocVien SET TenDangNhap = ?, MatKhau = ?, HoTen = ?, Email = ?, NgaySinh = ?, GioiTinh = ?, TrangThai = ?, SoDienThoai = ?, DiaChi = ? WHERE MaHocVien = ?');
            $stmt->bind_param('ssssssissi',
                $input['TenDangNhap'] ?? '',
                $input['MatKhau'] ?? '',
                $input['HoTen'] ?? '',
                $input['Email'] ?? '',
                $input['NgaySinh'] ?? null,
                $input['GioiTinh'] ?? 0,
                $input['TrangThai'] ?? 1,
                $input['SoDienThoai'] ?? null,
                $input['DiaChi'] ?? null,
                $id
            );
        }
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật học viên thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM HocVien WHERE MaHocVien = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa học viên thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu học viên không hợp lệ'];
}

function handleTeachers($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM GiaoVien WHERE MaGiaoVien = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM GiaoVien');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO GiaoVien (TenDangNhap, MatKhau, HoTen, Email, NgaySinh, GioiTinh, TrangThai, SoDienThoai, DiaChi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssssiss',
            $input['TenDangNhap'] ?? '',
            $input['MatKhau'] ?? '',
            $input['HoTen'] ?? '',
            $input['Email'] ?? '',
            $input['NgaySinh'] ?? null,
            $input['GioiTinh'] ?? 0,
            $input['TrangThai'] ?? 1,
            $input['SoDienThoai'] ?? null,
            $input['DiaChi'] ?? null
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo giáo viên thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        if (!isset($input['MatKhau']) || trim((string)($input['MatKhau'] ?? '')) === '') {
            $stmt = $conn->prepare('UPDATE GiaoVien SET TenDangNhap = ?, HoTen = ?, Email = ?, NgaySinh = ?, GioiTinh = ?, TrangThai = ?, SoDienThoai = ?, DiaChi = ? WHERE MaGiaoVien = ?');
            $stmt->bind_param('ssssiissi',
                $input['TenDangNhap'] ?? '',
                $input['HoTen'] ?? '',
                $input['Email'] ?? '',
                $input['NgaySinh'] ?? null,
                $input['GioiTinh'] ?? 0,
                $input['TrangThai'] ?? 1,
                $input['SoDienThoai'] ?? null,
                $input['DiaChi'] ?? null,
                $id
            );
        } else {
            $stmt = $conn->prepare('UPDATE GiaoVien SET TenDangNhap = ?, MatKhau = ?, HoTen = ?, Email = ?, NgaySinh = ?, GioiTinh = ?, TrangThai = ?, SoDienThoai = ?, DiaChi = ? WHERE MaGiaoVien = ?');
            $stmt->bind_param('ssssssissi',
                $input['TenDangNhap'] ?? '',
                $input['MatKhau'] ?? '',
                $input['HoTen'] ?? '',
                $input['Email'] ?? '',
                $input['NgaySinh'] ?? null,
                $input['GioiTinh'] ?? 0,
                $input['TrangThai'] ?? 1,
                $input['SoDienThoai'] ?? null,
                $input['DiaChi'] ?? null,
                $id
            );
        }
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật giáo viên thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM GiaoVien WHERE MaGiaoVien = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa giáo viên thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu giáo viên không hợp lệ'];
}

function handleAdmins($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM QuanTriVien WHERE MaQuanTriVien = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            if ($data) {
                unset($data['MatKhau']);
            }
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT MaQuanTriVien, TenDangNhap, HoTen, Email, PhanQuyen, TrangThai, NgayTao FROM QuanTriVien');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO QuanTriVien (TenDangNhap, MatKhau, HoTen, Email, PhanQuyen, TrangThai) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssss',
            $input['TenDangNhap'] ?? '',
            $input['MatKhau'] ?? '',
            $input['HoTen'] ?? '',
            $input['Email'] ?? null,
            $input['PhanQuyen'] ?? 'admin',
            $input['TrangThai'] ?? 1
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo quản trị viên thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        if (!isset($input['MatKhau']) || trim((string)($input['MatKhau'] ?? '')) === '') {
            $stmt = $conn->prepare('UPDATE QuanTriVien SET TenDangNhap = ?, HoTen = ?, Email = ?, PhanQuyen = ?, TrangThai = ? WHERE MaQuanTriVien = ?');
            $stmt->bind_param('sssssi',
                $input['TenDangNhap'] ?? '',
                $input['HoTen'] ?? '',
                $input['Email'] ?? null,
                $input['PhanQuyen'] ?? 'admin',
                $input['TrangThai'] ?? 1,
                $id
            );
        } else {
            $stmt = $conn->prepare('UPDATE QuanTriVien SET TenDangNhap = ?, MatKhau = ?, HoTen = ?, Email = ?, PhanQuyen = ?, TrangThai = ? WHERE MaQuanTriVien = ?');
            $stmt->bind_param('ssssssi',
                $input['TenDangNhap'] ?? '',
                $input['MatKhau'] ?? '',
                $input['HoTen'] ?? '',
                $input['Email'] ?? null,
                $input['PhanQuyen'] ?? 'admin',
                $input['TrangThai'] ?? 1,
                $id
            );
        }
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật quản trị viên thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM QuanTriVien WHERE MaQuanTriVien = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa quản trị viên thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu quản trị viên không hợp lệ'];
}

function handleCourses($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM KhoaHoc WHERE MaKhoaHoc = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM KhoaHoc');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO KhoaHoc (TenKhoaHoc, TrinhDo, MoTa, NgayBatDau, NgayKetThuc, TrangThai) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssss',
            $input['TenKhoaHoc'] ?? '',
            $input['TrinhDo'] ?? '',
            $input['MoTa'] ?? '',
            $input['NgayBatDau'] ?? null,
            $input['NgayKetThuc'] ?? null,
            $input['TrangThai'] ?? ''
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo khóa học thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE KhoaHoc SET TenKhoaHoc = ?, TrinhDo = ?, MoTa = ?, NgayBatDau = ?, NgayKetThuc = ?, TrangThai = ? WHERE MaKhoaHoc = ?');
        $stmt->bind_param('ssssssi',
            $input['TenKhoaHoc'] ?? '',
            $input['TrinhDo'] ?? '',
            $input['MoTa'] ?? '',
            $input['NgayBatDau'] ?? null,
            $input['NgayKetThuc'] ?? null,
            $input['TrangThai'] ?? '',
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật khóa học thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM KhoaHoc WHERE MaKhoaHoc = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa khóa học thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu khóa học không hợp lệ'];
}

function handleClasses($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM LopHoc WHERE MaLop = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            
            if ($data) {
                // Lấy lịch học
                $scheduleStmt = $conn->prepare('SELECT * FROM lichhoc WHERE MaLop = ? ORDER BY ThuHoc, Buoi');
                $scheduleStmt->bind_param('i', $id);
                $scheduleStmt->execute();
                $data['LichHoc'] = $scheduleStmt->get_result()->fetch_all(MYSQLI_ASSOC);
                $scheduleStmt->close();
                
                // Đếm số chỗ đã đăng ký
                $countStmt = $conn->prepare('SELECT COUNT(*) as SoLuongDaDangKy FROM dangkylop WHERE MaLop = ? AND TrangThai IN ("approved", "pending")');
                $countStmt->bind_param('i', $id);
                $countStmt->execute();
                $countResult = $countStmt->get_result()->fetch_assoc();
                $data['SoLuongDaDangKy'] = (int)($countResult['SoLuongDaDangKy'] ?? 0);
                $data['SoChoConLai'] = max(0, ($data['SoLuongToiDa'] ?? 0) - $data['SoLuongDaDangKy']);
                $countStmt->close();
            }
            
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT l.*, COUNT(d.MaDangKy) as SoLuongDaDangKy FROM LopHoc l LEFT JOIN dangkylop d ON l.MaLop = d.MaLop AND d.TrangThai IN ("approved", "pending") GROUP BY l.MaLop');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        
        // Lấy lịch học cho mỗi lớp và tính số chỗ còn lại
        foreach ($rows as &$row) {
            $maLop = $row['MaLop'];
            $scheduleStmt = $conn->prepare('SELECT * FROM lichhoc WHERE MaLop = ? ORDER BY ThuHoc, Buoi');
            $scheduleStmt->bind_param('i', $maLop);
            $scheduleStmt->execute();
            $row['LichHoc'] = $scheduleStmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $scheduleStmt->close();
            
            $row['SoLuongDaDangKy'] = (int)($row['SoLuongDaDangKy'] ?? 0);
            $row['SoChoConLai'] = max(0, ($row['SoLuongToiDa'] ?? 0) - $row['SoLuongDaDangKy']);
        }
        
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO LopHoc (TenLop, MaKhoaHoc, MaGiaoVien, SoLuongToiDa, TrangThai) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('siiii',
            $input['TenLop'] ?? '',
            $input['MaKhoaHoc'] ?? 0,
            $input['MaGiaoVien'] ?? 0,
            $input['SoLuongToiDa'] ?? 0,
            $input['TrangThai'] ?? 1
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo lớp học thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE LopHoc SET TenLop = ?, MaKhoaHoc = ?, MaGiaoVien = ?, SoLuongToiDa = ?, TrangThai = ? WHERE MaLop = ?');
        $stmt->bind_param('siiiii',
            $input['TenLop'] ?? '',
            $input['MaKhoaHoc'] ?? 0,
            $input['MaGiaoVien'] ?? 0,
            $input['SoLuongToiDa'] ?? 0,
            $input['TrangThai'] ?? 1,
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật lớp học thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM LopHoc WHERE MaLop = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa lớp học thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu lớp học không hợp lệ'];
}

function handleLessons($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        $includeFull = isset($_GET['include']) && $_GET['include'] === 'full';
        $slug = trim((string)($_GET['slug'] ?? ''));

        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM BaiHoc WHERE MaBaiHoc = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            if ($data && $includeFull) {
                $data['CauHoi'] = fetchLessonQuestions($conn, $id);
                $videoData = getLessonVideoData($id);
                if ($videoData) {
                    $data['VideoUrl'] = $videoData['VideoUrl'];
                    $data['VideoTitle'] = $videoData['VideoTitle'];
                    $data['VideoDescription'] = $videoData['VideoDescription'];
                }
            }
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM BaiHoc');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        foreach ($rows as &$row) {
            if ($includeFull || $slug === 'video') {
                $row['CauHoi'] = fetchLessonQuestions($conn, $row['MaBaiHoc']);
                $videoData = getLessonVideoData($row['MaBaiHoc']);
                if ($videoData) {
                    $row['VideoUrl'] = $videoData['VideoUrl'];
                    $row['VideoTitle'] = $videoData['VideoTitle'];
                    $row['VideoDescription'] = $videoData['VideoDescription'];
                }
            }
        }
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO BaiHoc (TieuDe, NoiDung, ThuTu, MaKhoaHoc) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssii',
            $input['TieuDe'] ?? '',
            $input['NoiDung'] ?? '',
            $input['ThuTu'] ?? 0,
            $input['MaKhoaHoc'] ?? 0
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo bài học thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE BaiHoc SET TieuDe = ?, NoiDung = ?, ThuTu = ?, MaKhoaHoc = ? WHERE MaBaiHoc = ?');
        $stmt->bind_param('ssiii',
            $input['TieuDe'] ?? '',
            $input['NoiDung'] ?? '',
            $input['ThuTu'] ?? 0,
            $input['MaKhoaHoc'] ?? 0,
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật bài học thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM BaiHoc WHERE MaBaiHoc = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa bài học thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu bài học không hợp lệ'];
}

function fetchLessonQuestions($conn, $lessonId) {
    $questions = [];
    $stmt = $conn->prepare('SELECT * FROM CauHoi WHERE MaBaiHoc = ? ORDER BY ThuTu');
    $stmt->bind_param('i', $lessonId);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($question = $result->fetch_assoc()) {
        $question['DapAn'] = fetchQuestionAnswers($conn, $question['MaCauHoi']);
        $questions[] = $question;
    }
    $stmt->close();
    return $questions;
}

function fetchQuestionAnswers($conn, $questionId) {
    $stmt = $conn->prepare('SELECT * FROM DapAn WHERE MaCauHoi = ?');
    $stmt->bind_param('i', $questionId);
    $stmt->execute();
    $answers = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $answers;
}

function enrichQuestionWithAnswers($conn, $question) {
    if (!$question) {
        return $question;
    }
    $question['DapAn'] = fetchQuestionAnswers($conn, $question['MaCauHoi']);
    return $question;
}

function saveQuestionAnswers($conn, $questionId, $answers) {
    $deleteStmt = $conn->prepare('DELETE FROM DapAn WHERE MaCauHoi = ?');
    $deleteStmt->bind_param('i', $questionId);
    $deleteStmt->execute();
    $deleteStmt->close();

    if (!is_array($answers)) {
        if (is_string($answers) && trim($answers) !== '') {
            $answers = [['NoiDung' => trim($answers), 'LaDapAnDung' => 1]];
        } else {
            return;
        }
    }

    foreach ($answers as $answer) {
        if (!is_array($answer)) {
            continue;
        }
        $text = trim((string)($answer['NoiDung'] ?? $answer['text'] ?? ''));
        if ($text === '') {
            continue;
        }
        $correct = isset($answer['LaDapAnDung']) ? (int)((bool)$answer['LaDapAnDung']) : (isset($answer['isCorrect']) ? (int)((bool)$answer['isCorrect']) : 0);
        $stmt = $conn->prepare('INSERT INTO DapAn (MaCauHoi, NoiDung, LaDapAnDung) VALUES (?, ?, ?)');
        $stmt->bind_param('isi', $questionId, $text, $correct);
        $stmt->execute();
        $stmt->close();
    }
}

function getLessonVideoData($lessonId) {
    $videos = [
        1 => [
            'VideoUrl' => 'https://englishcenter.caothang.edu.vn/videos/Gioi-thieu-khoa-hoc-OFFLINE-TAI-TRUONG-Anh-van-1-2-3.html',
            'VideoTitle' => 'Giới thiệu khóa học tiếng Anh cơ bản',
            'VideoDescription' => 'Video giới thiệu bài học và chương trình đào tạo.',
        ],
        2 => [
            'VideoUrl' => 'https://englishcenter.caothang.edu.vn/videos/English-Job-Interview-Tips-and-Tricks.html',
            'VideoTitle' => 'Tips phỏng vấn tiếng Anh',
            'VideoDescription' => 'Video luyện kỹ năng nói tiếng Anh qua phỏng vấn.',
        ],
        3 => [
            'VideoUrl' => 'https://englishcenter.caothang.edu.vn/videos/18-tu-ban-Viet-nao-cung-phat-am-sai.html',
            'VideoTitle' => 'Phát âm 18 từ tiếng Anh dễ sai',
            'VideoDescription' => 'Video hướng dẫn phát âm chuẩn tiếng Anh.',
        ]
    ];
    return $videos[$lessonId] ?? null;
}

function handleQuestions($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM CauHoi WHERE MaCauHoi = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            if ($data) {
                $data = enrichQuestionWithAnswers($conn, $data);
            }
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM CauHoi ORDER BY ThuTu, MaCauHoi');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        foreach ($rows as &$row) {
            $row = enrichQuestionWithAnswers($conn, $row);
        }
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO CauHoi (MaBaiHoc, NoiDung, LoaiCauHoi, ThuTu) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('issi',
            $input['MaBaiHoc'] ?? 0,
            $input['NoiDung'] ?? '',
            $input['LoaiCauHoi'] ?? $input['Loai'] ?? '',
            $input['ThuTu'] ?? 0
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        if (array_key_exists('DapAn', $input)) {
            saveQuestionAnswers($conn, $newId, $input['DapAn']);
        }
        $conn->close();
        return ['status' => true, 'message' => 'Tạo câu hỏi thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE CauHoi SET MaBaiHoc = ?, NoiDung = ?, LoaiCauHoi = ?, ThuTu = ? WHERE MaCauHoi = ?');
        $stmt->bind_param('issii',
            $input['MaBaiHoc'] ?? 0,
            $input['NoiDung'] ?? '',
            $input['LoaiCauHoi'] ?? $input['Loai'] ?? '',
            $input['ThuTu'] ?? 0,
            $id
        );
        $stmt->execute();
        $stmt->close();
        if (array_key_exists('DapAn', $input)) {
            saveQuestionAnswers($conn, $id, $input['DapAn']);
        }
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật câu hỏi thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $deleteAnswers = $conn->prepare('DELETE FROM DapAn WHERE MaCauHoi = ?');
        $deleteAnswers->bind_param('i', $id);
        $deleteAnswers->execute();
        $deleteAnswers->close();

        $stmt = $conn->prepare('DELETE FROM CauHoi WHERE MaCauHoi = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa câu hỏi thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu câu hỏi không hợp lệ'];
}

function handleAnswers($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM DapAn WHERE MaDapAn = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM DapAn');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO DapAn (MaCauHoi, NoiDung, LaDapAnDung) VALUES (?, ?, ?)');
        $stmt->bind_param('isi',
            $input['MaCauHoi'] ?? 0,
            $input['NoiDung'] ?? '',
            $input['LaDapAnDung'] ?? 0
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo đáp án thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE DapAn SET MaCauHoi = ?, NoiDung = ?, LaDapAnDung = ? WHERE MaDapAn = ?');
        $stmt->bind_param('isii',
            $input['MaCauHoi'] ?? 0,
            $input['NoiDung'] ?? '',
            $input['LaDapAnDung'] ?? 0,
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật đáp án thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM DapAn WHERE MaDapAn = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa đáp án thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu đáp án không hợp lệ'];
}

function handleExams($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM BaiKiemTra WHERE MaBaiKiemTra = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM BaiKiemTra');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO BaiKiemTra (MaLop, TenBaiKiemTra, ThoiGianLam, DiemDat) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('isis',
            $input['MaLop'] ?? 0,
            $input['TenBaiKiemTra'] ?? '',
            $input['ThoiGianLam'] ?? 0,
            $input['DiemDat'] ?? 0
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Tạo bài kiểm tra thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE BaiKiemTra SET MaLop = ?, TenBaiKiemTra = ?, ThoiGianLam = ?, DiemDat = ? WHERE MaBaiKiemTra = ?');
        $stmt->bind_param('isiii',
            $input['MaLop'] ?? 0,
            $input['TenBaiKiemTra'] ?? '',
            $input['ThoiGianLam'] ?? 0,
            $input['DiemDat'] ?? 0,
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật bài kiểm tra thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM BaiKiemTra WHERE MaBaiKiemTra = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa bài kiểm tra thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu bài kiểm tra không hợp lệ'];
}

function handleEnrollments($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM DangKyLop WHERE MaDangKy = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM DangKyLop');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO DangKyLop (MaHocVien, MaLop, NgayDangKy, TrangThai) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('iiss',
            $input['MaHocVien'] ?? 0,
            $input['MaLop'] ?? 0,
            $input['NgayDangKy'] ?? null,
            $input['TrangThai'] ?? ''
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Đăng ký lớp thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE DangKyLop SET MaHocVien = ?, MaLop = ?, NgayDangKy = ?, TrangThai = ? WHERE MaDangKy = ?');
        $stmt->bind_param('iissi',
            $input['MaHocVien'] ?? 0,
            $input['MaLop'] ?? 0,
            $input['NgayDangKy'] ?? null,
            $input['TrangThai'] ?? '',
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật đăng ký thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM DangKyLop WHERE MaDangKy = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Hủy đăng ký lớp thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu đăng ký lớp không hợp lệ'];
}

function handleAttendance($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM ChuyenCan WHERE MaChuyenCan = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM ChuyenCan');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO ChuyenCan (MaHocVien, MaLop, NgayDiem, TrangThai, GhiChu) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('iisss',
            $input['MaHocVien'] ?? 0,
            $input['MaLop'] ?? 0,
            $input['NgayDiem'] ?? null,
            $input['TrangThai'] ?? 'Có',
            $input['GhiChu'] ?? ''
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Thêm chuyên cần thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE ChuyenCan SET MaHocVien = ?, MaLop = ?, NgayDiem = ?, TrangThai = ?, GhiChu = ? WHERE MaChuyenCan = ?');
        $stmt->bind_param('iisssi',
            $input['MaHocVien'] ?? 0,
            $input['MaLop'] ?? 0,
            $input['NgayDiem'] ?? null,
            $input['TrangThai'] ?? 'Có',
            $input['GhiChu'] ?? '',
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật chuyên cần thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM ChuyenCan WHERE MaChuyenCan = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa chuyên cần thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu chuyên cần không hợp lệ'];
}

function handleProgress($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM TienDoHocTap WHERE MaTienDo = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM TienDoHocTap');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO TienDoHocTap (MaHocVien, MaBaiHoc, PhanTramHoanThanh, NgayCapNhat) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('iids',
            $input['MaHocVien'] ?? 0,
            $input['MaBaiHoc'] ?? 0,
            $input['PhanTramHoanThanh'] ?? 0,
            $input['NgayCapNhat'] ?? null
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Thêm tiến độ học tập thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE TienDoHocTap SET MaHocVien = ?, MaBaiHoc = ?, PhanTramHoanThanh = ?, NgayCapNhat = ? WHERE MaTienDo = ?');
        $stmt->bind_param('iidsi',
            $input['MaHocVien'] ?? 0,
            $input['MaBaiHoc'] ?? 0,
            $input['PhanTramHoanThanh'] ?? 0,
            $input['NgayCapNhat'] ?? null,
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật tiến độ học tập thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu tiến độ học tập không hợp lệ'];
}

function handleReviews($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM DanhGiaHocVien WHERE MaDanhGia = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $result = $conn->query('SELECT * FROM DanhGiaHocVien');
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO DanhGiaHocVien (MaHocVien, MaGiaoVien, DiemDanhGia, NhanXet, NgayDanhGia) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('iisss',
            $input['MaHocVien'] ?? 0,
            $input['MaGiaoVien'] ?? 0,
            $input['DiemDanhGia'] ?? 0,
            $input['NhanXet'] ?? '',
            $input['NgayDanhGia'] ?? null
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Thêm đánh giá thành công', 'id' => $newId];
    }
    if ($method === 'PUT' && $id) {
        $stmt = $conn->prepare('UPDATE DanhGiaHocVien SET MaHocVien = ?, MaGiaoVien = ?, DiemDanhGia = ?, NhanXet = ?, NgayDanhGia = ? WHERE MaDanhGia = ?');
        $stmt->bind_param('iisssi',
            $input['MaHocVien'] ?? 0,
            $input['MaGiaoVien'] ?? 0,
            $input['DiemDanhGia'] ?? 0,
            $input['NhanXet'] ?? '',
            $input['NgayDanhGia'] ?? null,
            $id
        );
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Cập nhật đánh giá thành công'];
    }
    if ($method === 'DELETE' && $id) {
        $stmt = $conn->prepare('DELETE FROM DanhGiaHocVien WHERE MaDanhGia = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Xóa đánh giá thành công'];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu đánh giá không hợp lệ'];
}

function handleExamResults($method, $input) {
    $conn = getDbConnection();
    $id = getIdParam();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare('SELECT * FROM KetQuaLamBai WHERE MaKetQua = ?');
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $data = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            $conn->close();
            return ['status' => true, 'data' => $data ?: null];
        }
        $query = 'SELECT * FROM KetQuaLamBai';
        if (isset($_GET['MaHocVien'])) {
            $stmt = $conn->prepare('SELECT * FROM KetQuaLamBai WHERE MaHocVien = ?');
            $stmt->bind_param('i', $_GET['MaHocVien']);
            $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
        } else {
            $result = $conn->query($query);
            $rows = $result->fetch_all(MYSQLI_ASSOC);
        }
        $conn->close();
        return ['status' => true, 'data' => $rows];
    }
    if ($method === 'POST') {
        $stmt = $conn->prepare('INSERT INTO KetQuaLamBai (MaHocVien, MaBaiHoc, Diem, SoCauDung, TongSoCau, NgayLam) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('iiidds',
            $input['MaHocVien'] ?? 0,
            $input['MaBaiHoc'] ?? 0,
            $input['Diem'] ?? 0,
            $input['SoCauDung'] ?? 0,
            $input['TongSoCau'] ?? 0,
            $input['NgayLam'] ?? date('Y-m-d')
        );
        $stmt->execute();
        $newId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        return ['status' => true, 'message' => 'Lưu kết quả làm bài thành công', 'id' => $newId];
    }
    $conn->close();
    return ['status' => false, 'message' => 'Yêu cầu kết quả kiểm tra không hợp lệ'];
}

function handleELearning($queryParams) {
    $slug = strtolower(trim($queryParams['slug'] ?? $queryParams['type'] ?? ''));
    $sourceUrl = 'https://englishcenter.caothang.edu.vn/e-learning/con-2055-1108';

    $skills = [
        'nghe' => [
            [
                'title' => 'Cấu trúc thi online TA1, TA2, TA3',
                'url' => 'https://englishcenter.caothang.edu.vn/E-Learning/Cau-truc-thi-online-TA1-TA2-TA3.html',
                'description' => 'Tài liệu tham khảo cho cấu trúc bài thi và luyện kỹ năng nghe.',
                'category' => 'nghe'
            ],
            [
                'title' => 'Hướng dẫn sinh viên làm bài kiểm tra online',
                'url' => 'https://englishcenter.caothang.edu.vn/E-Learning/Huong-dan-sinh-vien-lam-bai-kiem-tra-online.html',
                'description' => 'Hướng dẫn thao tác và luyện kỹ năng nghe qua bài kiểm tra trực tuyến.',
                'category' => 'nghe'
            ],
            [
                'title' => 'Hướng dẫn sinh viên làm bài kiểm tra Tiếng Anh đầu vào',
                'url' => 'https://englishcenter.caothang.edu.vn/E-Learning/hd-lam-bai-tieng-anh-dau-vao.html',
                'description' => 'Tài nguyên hỗ trợ luyện nghe và làm quen với bài thi đầu vào.',
                'category' => 'nghe'
            ]
        ],
        'noi' => [
            [
                'title' => 'English Job Interview Tips and Tricks',
                'url' => 'https://englishcenter.caothang.edu.vn/videos/English-Job-Interview-Tips-and-Tricks.html',
                'description' => 'Video và bài học giúp luyện kỹ năng nói trong phỏng vấn tiếng Anh.',
                'category' => 'noi'
            ],
            [
                'title' => 'Giới thiệu khóa học OFFLINE tại trường Anh văn 1, 2, 3',
                'url' => 'https://englishcenter.caothang.edu.vn/videos/Gioi-thieu-khoa-hoc-OFFLINE-TAI-TRUONG-Anh-van-1-2-3.html',
                'description' => 'Bài giới thiệu khóa học, phù hợp cho luyện nói và giao tiếp.',
                'category' => 'noi'
            ]
        ],
        'doc' => [
            [
                'title' => 'Thang Điểm TOEIC & Cách Tính Điểm TOEIC',
                'url' => 'https://englishcenter.caothang.edu.vn/toeic/Thang-Diem-TOEIC-Cach-Tinh-Diem-TOEIC.html',
                'description' => 'Tài liệu hỗ trợ luyện đọc hiểu và hiểu cấu trúc bài thi TOEIC.',
                'category' => 'doc'
            ],
            [
                'title' => 'Cách điền mẫu phiếu trả lời Answer Sheet TOEIC',
                'url' => 'https://englishcenter.caothang.edu.vn/toeic/Cach-dien-mau-phieu-tra-loi-Answer-Sheet-Toeic.html',
                'description' => 'Hướng dẫn đọc và điền đáp án đúng trong bài thi.',
                'category' => 'doc'
            ]
        ],
        'viet' => [
            [
                'title' => 'Cách điền mẫu phiếu trả lời Answer Sheet TOEIC',
                'url' => 'https://englishcenter.caothang.edu.vn/toeic/Cach-dien-mau-phieu-tra-loi-Answer-Sheet-Toeic.html',
                'description' => 'Bài học hỗ trợ kỹ năng viết đáp án và trình bày logic trong bài thi.',
                'category' => 'viet'
            ],
            [
                'title' => 'Hướng dẫn sinh viên làm bài kiểm tra online',
                'url' => 'https://englishcenter.caothang.edu.vn/E-Learning/Huong-dan-sinh-vien-lam-bai-kiem-tra-online.html',
                'description' => 'Mẫu quy trình làm bài giúp rèn kỹ năng viết và trình bày câu trả lời.',
                'category' => 'viet'
            ]
        ],
        'video' => [
            [
                'title' => 'Giới thiệu khóa học OFFLINE tại trường Anh văn 1, 2, 3',
                'url' => 'https://englishcenter.caothang.edu.vn/videos/Gioi-thieu-khoa-hoc-OFFLINE-TAI-TRUONG-Anh-van-1-2-3.html',
                'description' => 'Video giới thiệu bài học và chương trình đào tạo.',
                'category' => 'video'
            ],
            [
                'title' => 'English Job Interview Tips and Tricks',
                'url' => 'https://englishcenter.caothang.edu.vn/videos/English-Job-Interview-Tips-and-Tricks.html',
                'description' => 'Video thực hành kỹ năng nói và giao tiếp trong môi trường làm việc.',
                'category' => 'video'
            ]
        ],
        'phatam' => [
            [
                'title' => '18 từ bạn Việt nào cũng phát âm sai',
                'url' => 'https://englishcenter.caothang.edu.vn/videos/18-tu-ban-Viet-nao-cung-phat-am-sai.html',
                'description' => 'Video và tài liệu hướng dẫn phát âm chuẩn tiếng Anh.',
                'category' => 'phatam'
            ]
        ]
    ];

    if ($slug !== '') {
        if (!isset($skills[$slug])) {
            return ['status' => false, 'message' => 'Không tìm thấy nhóm kỹ năng', 'available_skills' => array_keys($skills)];
        }
        return ['status' => true, 'source_url' => $sourceUrl, 'skill' => $slug, 'data' => $skills[$slug]];
    }

    return ['status' => true, 'source_url' => $sourceUrl, 'data' => $skills];
}

function handleDictionary($queryParams) {
    $word = trim($queryParams['word'] ?? '');
    $lang = strtolower(trim($queryParams['lang'] ?? 'en'));
    $sourceUrl = 'https://dictionaryapi.dev/';
    $references = [
        'cambridge' => 'https://dictionary.cambridge.org/dictionary/english/',
        'deepl' => 'https://www.deepl.com/en',
        'tophonetics' => 'https://tophonetics.com/vi/'
    ];

    if ($word === '') {
        return [
            'status' => true,
            'message' => 'Gọi với ?request=dictionary&word=<từ>&lang=<en|vi> để tra từ.',
            'source_url' => $sourceUrl,
            'references' => $references,
            'supported_langs' => ['en', 'vi']
        ];
    }

    if ($lang === 'vi') {
        return [
            'status' => true,
            'word' => $word,
            'lang' => 'vi',
            'message' => 'Từ tiếng Việt được trả về đường dẫn dịch và tham khảo. Không có định nghĩa trực tiếp từ dictionaryapi.dev.',
            'references' => $references,
            'search_urls' => [
                'deepl_vi_en' => 'https://www.deepl.com/translator#vi/en/' . rawurlencode($word),
                'google_translate_vi_en' => 'https://translate.google.com/?sl=vi&tl=en&text=' . rawurlencode($word) . '&op=translate',
                'top_honetics' => 'https://tophonetics.com/vi/'
            ]
        ];
    }

    $apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' . rawurlencode($word);
    $responseJson = fetchExternalJson($apiUrl);
    if ($responseJson === null) {
        return ['status' => false, 'message' => 'Không thể kết nối tới dictionaryapi.dev'];
    }

    return [
        'status' => true,
        'word' => $word,
        'lang' => 'en',
        'source_url' => $sourceUrl,
        'references' => $references,
        'data' => $responseJson
    ];
}

function handleDictionaryQuick($queryParams) {
    $word = trim($queryParams['word'] ?? '');
    $lang = strtolower(trim($queryParams['lang'] ?? 'en'));
    $references = [
        'cambridge' => 'https://dictionary.cambridge.org/dictionary/english/',
        'deepl' => 'https://www.deepl.com/en',
        'tophonetics' => 'https://tophonetics.com/vi/'
    ];

    if ($word === '') {
        return [
            'status' => true,
            'message' => 'Gọi với ?request=dictionary/quick&word=<từ>&lang=<en|vi> để lấy link nhanh và định nghĩa ngắn.',
            'references' => $references,
            'supported_langs' => ['en', 'vi']
        ];
    }

    if ($lang === 'vi') {
        return [
            'status' => true,
            'word' => $word,
            'lang' => 'vi',
            'short_definition' => 'Từ tiếng Việt. Dùng các đường dẫn dịch để tra nghĩa sang tiếng Anh.',
            'search_urls' => [
                'deepl_vi_en' => 'https://www.deepl.com/translator#vi/en/' . rawurlencode($word),
                'google_translate_vi_en' => 'https://translate.google.com/?sl=vi&tl=en&text=' . rawurlencode($word) . '&op=translate',
                'top_honetics' => 'https://tophonetics.com/vi/'
            ],
            'references' => $references
        ];
    }

    $apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' . rawurlencode($word);
    $responseJson = fetchExternalJson($apiUrl);

    if ($responseJson === null) {
        return ['status' => false, 'message' => 'Không thể kết nối tới dictionaryapi.dev'];
    }

    $shortDefinition = '';
    $partOfSpeech = '';
    if (is_array($responseJson) && isset($responseJson[0]['meanings'][0]['definitions'][0]['definition'])) {
        $shortDefinition = $responseJson[0]['meanings'][0]['definitions'][0]['definition'];
        $partOfSpeech = $responseJson[0]['meanings'][0]['partOfSpeech'] ?? '';
    }

    return [
        'status' => true,
        'word' => $word,
        'lang' => 'en',
        'short_definition' => $shortDefinition,
        'part_of_speech' => $partOfSpeech,
        'search_urls' => [
            'cambridge' => 'https://dictionary.cambridge.org/dictionary/english/' . rawurlencode($word),
            'deepl_en_vi' => 'https://www.deepl.com/translator#en/vi/' . rawurlencode($word),
            'tophonetics' => 'https://tophonetics.com/vi/'
        ],
        'references' => $references
    ];
}

function fetchExternalJson($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($result === false || $httpCode >= 400) {
            return null;
        }
        $json = json_decode($result, true);
        return json_last_error() === JSON_ERROR_NONE ? $json : null;
    }
    $context = stream_context_create(['http' => ['timeout' => 10]]);
    $result = @file_get_contents($url, false, $context);
    if ($result === false) {
        return null;
    }
    $json = json_decode($result, true);
    return json_last_error() === JSON_ERROR_NONE ? $json : null;
}

function handleReports() {
    $conn = getDbConnection();
    $data = [];
    $data['total_students'] = (int) $conn->query('SELECT COUNT(*) AS total FROM HocVien')->fetch_assoc()['total'];
    $data['total_teachers'] = (int) $conn->query('SELECT COUNT(*) AS total FROM GiaoVien')->fetch_assoc()['total'];
    $data['total_courses'] = (int) $conn->query('SELECT COUNT(*) AS total FROM KhoaHoc')->fetch_assoc()['total'];
    $data['total_classes'] = (int) $conn->query('SELECT COUNT(*) AS total FROM LopHoc')->fetch_assoc()['total'];
    $data['total_registrations'] = (int) $conn->query('SELECT COUNT(*) AS total FROM DangKyLop')->fetch_assoc()['total'];
    $data['total_attendance'] = (int) $conn->query('SELECT COUNT(*) AS total FROM ChuyenCan')->fetch_assoc()['total'];
    $conn->close();
    return ['status' => true, 'data' => $data];
}
