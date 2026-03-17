# Tài Liệu API - RAG System

## Mục Lục

- [Tài Liệu API - RAG System](#tài-liệu-api---rag-system)
  - [Mục Lục](#mục-lục)
  - [Tổng Quan](#tổng-quan)
  - [🚨 URGENT UPDATE FOR FE TEAM - Version 2.4.0](#-urgent-update-for-fe-team---version-240)
  - [Authentication](#authentication)
    - [1. Đăng Ký Tài Khoản](#1-đăng-ký-tài-khoản)
    - [2. Đăng Nhập](#2-đăng-nhập)
    - [3. Xác Thực Tài Khoản](#3-xác-thực-tài-khoản)
    - [4. Đăng Xuất](#4-đăng-xuất)
  - [Chat Module](#chat-module)
    - [1. Tạo Chat Session](#1-tạo-chat-session)
    - [2. Hỏi Câu Hỏi (Synchronous)](#2-hỏi-câu-hỏi-synchronous)
    - [3. Hỏi Câu Hỏi (Asynchronous) - NEW](#3-hỏi-câu-hỏi-asynchronous---new)
    - [4. Lấy Lịch Sử Chat](#4-lấy-lịch-sử-chat)
    - [5. Lấy Danh Sách Sessions](#5-lấy-danh-sách-sessions)
  - [Reports Module](#reports-module)
    - [1. Upload Báo Cáo (Synchronous)](#1-upload-báo-cáo-synchronous)
    - [2. Upload Báo Cáo (Asynchronous) - NEW](#2-upload-báo-cáo-asynchronous---new)
    - [3. Lấy Báo Cáo Của Tôi](#3-lấy-báo-cáo-của-tôi)
    - [4. Lấy Báo Cáo Công Khai](#4-lấy-báo-cáo-công-khai)
    - [5. Lấy Chi Tiết Báo Cáo](#5-lấy-chi-tiết-báo-cáo)
    - [6. Tải Xuống Báo Cáo PDF](#6-tải-xuống-báo-cáo-pdf)
    - [7. Cập Nhật Visibility](#7-cập-nhật-visibility)
    - [8. Xóa Báo Cáo](#8-xóa-báo-cáo)
    - [9. Tìm Kiếm Báo Cáo](#9-tìm-kiếm-báo-cáo)
    - [10. Lấy Metrics Báo Cáo (Not Developed)](#10-lấy-metrics-báo-cáo-not-developed)
  - [**Role**: Admin, Analyst](#role-admin-analyst)
  - [Jobs Module - NEW](#jobs-module---new)
    - [1. Lấy Trạng Thái Job](#1-lấy-trạng-thái-job)
    - [2. Lấy Kết Quả Job](#2-lấy-kết-quả-job)
    - [Polling Pattern cho FE](#polling-pattern-cho-fe)
    - [Job Management cho FE](#job-management-cho-fe)
  - [Companies Module](#companies-module)
    - [1. Lấy Danh Sách Công Ty](#1-lấy-danh-sách-công-ty)
    - [2. Lấy Chi Tiết Công Ty](#2-lấy-chi-tiết-công-ty)
    - [3. Tạo Công Ty Mới](#3-tạo-công-ty-mới)
    - [4. Cập Nhật Công Ty](#4-cập-nhật-công-ty)
    - [5. Xóa Công Ty](#5-xóa-công-ty)
  - [Analytics Module](#analytics-module)
    - [1. Lấy Loại Phân Tích](#1-lấy-loại-phân-tích)
    - [2. Tạo Báo Cáo Phân Tích](#2-tạo-báo-cáo-phân-tích)
    - [2.1. Tạo Báo Cáo Phân Tích (Async) - NEW](#21-tạo-báo-cáo-phân-tích-async---new)
    - [3. Lấy Danh Sách Báo Cáo Phân Tích](#3-lấy-danh-sách-báo-cáo-phân-tích)
    - [4. Lấy Chi Tiết Báo Cáo Phân Tích](#4-lấy-chi-tiết-báo-cáo-phân-tích)
    - [5. Tải Xuống Báo Cáo Phân Tích - NEW](#5-tải-xuống-báo-cáo-phân-tích---new)
  - [Metrics Module](#metrics-module)
    - [1. Lấy Nhóm Metrics](#1-lấy-nhóm-metrics)
    - [2. Lấy Định Nghĩa Metrics](#2-lấy-định-nghĩa-metrics)
    - [3. Lấy Giá Trị Metrics Theo Báo Cáo](#3-lấy-giá-trị-metrics-theo-báo-cáo)
    - [4. Tính Toán Metrics](#4-tính-toán-metrics)
  - [Admin Module](#admin-module)
    - [1. Lấy Danh Sách Users](#1-lấy-danh-sách-users)
    - [2. Lấy Chi Tiết User](#2-lấy-chi-tiết-user)
    - [3. Cập Nhật User](#3-cập-nhật-user)
    - [4. Xóa User](#4-xóa-user)
    - [5. Lấy Audit Logs (Not Developed)](#5-lấy-audit-logs-not-developed)
    - [6. Lấy Thống Kê Hệ Thống](#6-lấy-thống-kê-hệ-thống)
    - [7. Tạo Report Category](#7-tạo-report-category)
    - [8. Lấy Report Categories (Admin)](#8-lấy-report-categories-admin)
    - [9. Cập Nhật Report Category](#9-cập-nhật-report-category)
    - [10. Xóa Report Category](#10-xóa-report-category)
    - [11. Tạo Analytics Type](#11-tạo-analytics-type)
    - [12. Cập Nhật Analytics Type](#12-cập-nhật-analytics-type)
    - [13. Xóa Analytics Type](#13-xóa-analytics-type)
  - [**Role**: Admin only](#role-admin-only)
  - [Report Categories (Public)](#report-categories-public)
    - [1. Lấy Report Categories (Cho Analyst)](#1-lấy-report-categories-cho-analyst)
  - [Test Endpoints](#test-endpoints)
    - [1. Test OpenAI Connection](#1-test-openai-connection)
    - [2. Test S3 Upload](#2-test-s3-upload)
    - [3. Get S3 Info](#3-get-s3-info)
  - [Error Handling](#error-handling)
    - [HTTP Status Codes](#http-status-codes)
    - [Error Response Format](#error-response-format)
    - [Common Error Examples](#common-error-examples)
  - [Authentication Flow](#authentication-flow)
    - [1. Đăng Ký và Xác Thực](#1-đăng-ký-và-xác-thực)
    - [2. Sử Dụng API](#2-sử-dụng-api)
    - [3. Đăng Xuất](#3-đăng-xuất)
  - [cURL Examples](#curl-examples)
    - [Đăng Nhập](#đăng-nhập)
    - [Upload Báo Cáo (Synchronous)](#upload-báo-cáo-synchronous)
    - [Upload Báo Cáo (Asynchronous) - NEW](#upload-báo-cáo-asynchronous---new)
    - [Hỏi Câu Hỏi Chat (Synchronous)](#hỏi-câu-hỏi-chat-synchronous)
    - [Hỏi Câu Hỏi Chat (Asynchronous) - NEW](#hỏi-câu-hỏi-chat-asynchronous---new)
    - [Test S3 Upload](#test-s3-upload)
    - [Get S3 Info](#get-s3-info)
  - [Notes](#notes)
    - [NEW: Asynchronous Processing](#new-asynchronous-processing)
  - [API Changes Log](#api-changes-log)
    - [**Version 2.4.0 - March 17, 2026**](#version-240---march-17-2026)
    - [**Version 2.3.0 - March 16, 2026**](#version-230---march-16-2026)
    - [**Version 2.1.0 - March 16, 2026**](#version-210---march-16-2026)
      - [**🔧 Fixed APIs**](#-fixed-apis)
      - [**✨ New APIs**](#-new-apis)
      - [**🚀 Enhanced APIs**](#-enhanced-apis)
      - [**📋 Documentation Updates**](#-documentation-updates)

## Tổng Quan

**Base URL**: `https://api.rag-system.com`  
**Authentication**: Bearer Token (JWT)  
**Roles**: Admin, Analyst  

---

## 🚨 **URGENT UPDATE FOR FE TEAM - Version 2.4.0**

### **Analytics APIs - CRITICAL CHANGES**

#### **✅ FIXED: File Corruption Issue**
- **Problem**: Analytics files were corrupted and couldn't open
- **Solution**: Changed from fake PDF to proper HTML format
- **Impact**: Files now open correctly in browsers

#### **📋 API Changes Summary**

| API Endpoint                               | Change         | Old Format        | New Format         | Status  |
| ------------------------------------------ | -------------- | ----------------- | ------------------ | ------- |
| `POST /api/analytics/generate`             | File format    | PDF (corrupted)   | HTML (working)     | ✅ Fixed |
| `POST /api/analytics/generate-async`       | Implementation | Placeholder       | Full async support | ✅ New   |
| `GET /api/analytics/reports/{id}/download` | Content-Type   | `application/pdf` | `text/html`        | ✅ Fixed |

#### **🔧 FE Integration Updates Required**

1. **File Handling**:
   ```javascript
   // OLD - expecting PDF
   response.headers['content-type'] === 'application/pdf'
   filename.endsWith('.pdf')
   
   // NEW - expecting HTML
   response.headers['content-type'] === 'text/html'
   filename.endsWith('.html')
   ```

2. **Download Behavior**:
   ```javascript
   // OLD - PDF download
   window.open(downloadUrl); // Would show corruption error
   
   // NEW - HTML opens in browser
   window.open(downloadUrl); // Opens beautiful HTML report
   ```

3. **Async Analytics** (NEW):
   ```javascript
   // Step 1: Start async job
   const response = await fetch('/api/analytics/generate-async', {
     method: 'POST',
     body: JSON.stringify({ sessionId, title })
   });
   const { jobId } = await response.json();
   
   // Step 2: Poll for completion
   const result = await pollJobStatus(jobId);
   ```

#### **🎯 User Experience Improvements**
- ✅ Files open immediately without corruption
- ✅ Professional HTML styling with CSS
- ✅ Responsive design (mobile + desktop)
- ✅ Can print to PDF from browser if needed
- ✅ No more timeout issues with async processing

---

## Authentication

### 1. Đăng Ký Tài Khoản
**POST** `/api/Auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Nguyễn Văn A"
}
```

**Response (200 OK)**:
```json
{
  "message": "Đăng ký thành công! Nhớ vào AWS Console Confirm user nhé.",
  "userId": "12345678-1234-1234-1234-123456789012"
}
```

**Role**: Không yêu cầu authentication

### 2. Đăng Nhập
**POST** `/api/Auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "Analyst",
  "fullName": "Nguyễn Văn A"
}
```

**Role**: Không yêu cầu authentication

### 3. Xác Thực Tài Khoản
**POST** `/api/Auth/verify-account`

**Request Body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200 OK)**:
```json
{
  "message": "Xác thực tài khoản thành công! Bây giờ bạn có thể Login."
}
```

**Role**: Không yêu cầu authentication

### 4. Đăng Xuất
**POST** `/api/Auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "Logged out successfully from all devices"
}
```

**Role**: Admin, Analyst

---

## Chat Module

### 1. Tạo Chat Session
**POST** `/api/chat/sessions`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "analyticsTypeId": "12345678-1234-1234-1234-123456789012",
  "title": "Phân tích báo cáo tài chính Q1"
}
```

**Response (201 Created)**:
```json
{
  "sessionId": "87654321-4321-4321-4321-210987654321",
  "message": "Chat session created successfully"
}
```
**Response (400)**:
```json
{
  "message": "Analytics type not found."
}
```

**Role**: Admin, Analyst

### 2. Hỏi Câu Hỏi (Synchronous)
**POST** `/api/chat/ask`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sessionId": "87654321-4321-4321-4321-210987654321",
  "questionText": "Doanh thu của công ty ABC trong Q1 là bao nhiêu?"
}
```

**Response (200 OK)**:
```json
{
  "promptId": "7ce461da-97bf-4c9f-8027-1a35dcd46673",
  "responseText": "Xin lỗi, tôi không tìm thấy thông tin liên quan trong cơ sở dữ liệu.",
  "citations": [],
  "retrievalCount": 0
}
```

**Role**: Admin, Analyst

### 3. Hỏi Câu Hỏi (Asynchronous) - NEW
**POST** `/api/chat/ask-async`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sessionId": "87654321-4321-4321-4321-210987654321",
  "questionText": "Doanh thu của công ty ABC trong Q1 là bao nhiêu?"
}
```

**Response (200 OK)**:
```json
{
  "jobId": "12345678-1234-1234-1234-123456789012",
  "status": "pending",
  "message": "Chat processing started. Use jobId to check progress."
}
```

**Usage Flow**:
1. Call `/api/chat/ask-async` to start processing
2. Use returned `jobId` to poll `/api/jobs/{jobId}/status` for progress
3. When status is "completed", get result from the status response

**Role**: Admin, Analyst

### 4. Lấy Lịch Sử Chat
**GET** `/api/chat/sessions/{sessionId}/messages`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "sessionId": "ae572c18-e60d-4ff2-9d5c-1b5212687d2d",
  "messages": [
    {
      "id": "eaae4cc2-2f6f-46a4-aadb-66cf14088132",
      "questionText": "Doanh thu năm nay như thế nào",
      "responseText": "Xin lỗi, tôi không tìm thấy thông tin liên quan trong cơ sở dữ liệu.",
      "createdAt": "2026-03-10T17:06:25.545859"
    },
    {
      "id": "40db7b20-f4ff-4cc7-a284-ed9970313306",
      "questionText": "doanh thu năm này như thế nào",
      "responseText": "Xin lỗi, tôi không tìm thấy thông tin liên quan trong cơ sở dữ liệu.",
      "createdAt": "2026-03-10T17:06:56.193022"
    }
  ]
}
```

**Role**: Admin, Analyst

### 5. Lấy Danh Sách Sessions
**GET** `/api/chat/sessions`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "sessions": [
    {
      "id": "e34764c1-f393-4a72-9667-dc9334a70b0d",
      "title": "string",
      "analyticsTypeName": "Risk Analysis",
      "startTime": "2026-03-10T18:33:40.000787",
      "lastMessageAt": null,
      "messageCount": 0
    },
    {
      "id": "d6cd556d-31bf-4d91-8e7d-3e41838a74ed",
      "title": "string",
      "analyticsTypeName": "Risk Analysis",
      "startTime": "2026-03-09T21:33:31.768459",
      "lastMessageAt": null,
      "messageCount": 2
    }
  ]
}
```

**Role**: Admin, Analyst

---

## Reports Module

### 1. Upload Báo Cáo (Synchronous)
**POST** `/api/reports/upload`

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
- `file`: PDF file
- `companyId`: GUID
- `categoryId`: GUID  
- `year`: Integer (2000-2100)
- `period`: String (max 10 chars)
- `visibility`: String ("private" hoặc "public")

**Response (200 OK)**:
```json
{
  "reportId": "report-123",
  "message": "Report uploaded successfully",
  "metricsExtracted": 25,
  "pageCount": 45,
  "pdfType": "Annual Report",
  "metrics": [
    {
      "code": "REVENUE",
      "name": "Doanh thu",
      "value": 150000000000,
      "unit": "VND"
    }
  ]
}
```

**Role**: Admin, Analyst

### 2. Upload Báo Cáo (Asynchronous) - NEW
**POST** `/api/reports/upload-async`

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
- `file`: PDF file
- `companyId`: GUID
- `categoryId`: GUID  
- `year`: Integer (2000-2100)
- `period`: String (max 10 chars)
- `visibility`: String ("private" hoặc "public")

**Response (200 OK)**:
```json
{
  "jobId": "12345678-1234-1234-1234-123456789012",
  "status": "pending",
  "message": "Upload started. Use jobId to check progress."
}
```

**Usage Flow**:
1. Call `/api/reports/upload-async` to start upload processing
2. Use returned `jobId` to poll `/api/jobs/{jobId}/status` for progress
3. When status is "completed", get result from the status response

**Role**: Admin, Analyst

### 3. Lấy Báo Cáo Của Tôi
**GET** `/api/reports/my-reports?page=1&pageSize=10`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "total": 2,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "f493c6f0-14e2-4b21-9e0e-c47663ac8339",
      "companyName": "string",
      "ticker": "string",
      "categoryName": "string",
      "year": 2024,
      "period": "2024-2026",
      "visibility": "public",
      "fileName": "20251023 - FPT - BCTC cong ty me Quy 3 2025.pdf",
      "fileSizeKb": 1785,
      "createdAt": "2026-03-10T18:45:31.464724"
    },
    {
      "id": "c9bb0d15-7b8b-4ee7-84ba-e5b15dd664a9",
      "companyName": "string",
      "ticker": "string",
      "categoryName": "string",
      "year": 2019,
      "period": "string",
      "visibility": "string",
      "fileName": "20250422 - FPT - BCTC cong ty me Quy 1 nam 2025.pdf",
      "fileSizeKb": 2019,
      "createdAt": "2026-03-09T21:31:39.986036"
    }
  ]
}
```

**Role**: Admin, Analyst
### 4. Lấy Báo Cáo Công Khai
**GET** `/api/reports/public-reports?page=1&pageSize=10`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "f493c6f0-14e2-4b21-9e0e-c47663ac8339",
      "companyName": "string",
      "ticker": "string",
      "categoryName": "string",
      "year": 2024,
      "period": "2024-2026",
      "visibility": "public",
      "fileName": "20251023 - FPT - BCTC cong ty me Quy 3 2025.pdf",
      "fileSizeKb": 1785,
      "createdAt": "2026-03-10T18:45:31.464724"
    }
  ]
}
```

**Role**: Admin, Analyst

### 5. Lấy Chi Tiết Báo Cáo
**GET** `/api/reports/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "id": "f493c6f0-14e2-4b21-9e0e-c47663ac8339",
  "company": {
    "id": "dadc66f8-afaa-4c44-b7a3-5ad98ecb63f4",
    "ticker": "string",
    "name": "string"
  },
  "categoryName": "string",
  "year": 2024,
  "period": "2024-2026",
  "fileUrl": "/uploads/reports/5dcaa467-dd57-4da7-a0f5-39c4e1c8c299_20251023 - FPT - BCTC cong ty me Quy 3 2025.pdf",
  "fileName": "20251023 - FPT - BCTC cong ty me Quy 3 2025.pdf",
  "fileSizeKb": 1785,
  "visibility": "private",
  "uploadedBy": {
    "id": "443f3e2b-63fe-4268-8f9f-cb49ec501b67",
    "fullName": "System Admin"
  },
  "createdAt": "2026-03-10T18:45:31.464724",
  "metrics": []
}
```

**Role**: Admin, Analyst (chỉ owner hoặc admin mới xem được báo cáo private)

### 6. Tải Xuống Báo Cáo PDF
**GET** `/api/reports/{id}/download`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
- Content-Type: `application/pdf`
- File download

**Role**: Admin, Analyst (chỉ owner hoặc admin mới tải được báo cáo private)
### 7. Cập Nhật Visibility
**PATCH** `/api/reports/{id}/visibility`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "visibility": "public"
}
```

**Response (200 OK)**:
```json
{
  "message": "Visibility updated successfully"
}
```

**Role**: Admin, Analyst (chỉ owner hoặc admin)

### 8. Xóa Báo Cáo
**DELETE** `/api/reports/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "Report deleted successfully"
}
```

**Role**: Admin, Analyst (chỉ owner hoặc admin)

### 9. Tìm Kiếm Báo Cáo
**GET** `/api/reports/search?query=ABC&companyId={guid}&year=2024&period=Q1`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `query`: String (optional) - Từ khóa tìm kiếm (có thể để trống để lấy tất cả)
- `companyId`: GUID (optional) - ID công ty
- `year`: Integer (optional) - Năm
- `period`: String (optional) - Kỳ báo cáo

**Response (200 OK)**:
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "report-123",
      "ticker": "ABC",
      "companyName": "Công ty ABC",
      "year": 2024,
      "period": "Q1",
      "relevanceScore": 1.0
    }
  ]
}
```

**Usage Examples**:
- Tìm theo từ khóa: `/api/reports/search?query=FPT`
- Lấy tất cả báo cáo: `/api/reports/search`
- Lọc theo công ty: `/api/reports/search?companyId=12345678-1234-1234-1234-123456789012`
- Lọc theo năm: `/api/reports/search?year=2024`

**Role**: Admin, Analyst

### 10. Lấy Metrics Báo Cáo (Not Developed)
**GET** `/api/reports/{id}/metrics`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "reportId": "report-123",
  "metrics": [
    {
      "code": "REVENUE",
      "name": "Doanh thu",
      "value": 150000000000,
      "unit": "VND",
      "group": "Tài chính"
    },
    {
      "code": "PROFIT",
      "name": "Lợi nhuận",
      "value": 25000000000,
      "unit": "VND",
      "group": "Tài chính"
    }
  ]
}
```

**Role**: Admin, Analyst
---

## Jobs Module - NEW

### 1. Lấy Trạng Thái Job
**GET** `/api/jobs/{jobId}/status`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK) - Job đang xử lý**:
```json
{
  "jobId": "12345678-1234-1234-1234-123456789012",
  "status": "processing",
  "progress": 45,
  "errorMessage": null,
  "createdAt": "2026-03-16T10:00:00Z",
  "updatedAt": "2026-03-16T10:05:00Z",
  "result": null
}
```

**Response (200 OK) - Job hoàn thành**:
```json
{
  "jobId": "12345678-1234-1234-1234-123456789012",
  "status": "completed",
  "progress": 100,
  "errorMessage": null,
  "createdAt": "2026-03-16T10:00:00Z",
  "updatedAt": "2026-03-16T10:15:00Z",
  "result": {
    "reportId": "report-123",
    "message": "Report uploaded successfully",
    "metricsExtracted": 25,
    "pageCount": 45,
    "pdfType": "TextBased"
  }
}
```

**Response (200 OK) - Job thất bại**:
```json
{
  "jobId": "12345678-1234-1234-1234-123456789012",
  "status": "failed",
  "progress": 0,
  "errorMessage": "File format not supported",
  "createdAt": "2026-03-16T10:00:00Z",
  "updatedAt": "2026-03-16T10:02:00Z",
  "result": null
}
```

**Job Status Values**:
- `pending`: Job đang chờ xử lý
- `processing`: Job đang được xử lý
- `completed`: Job hoàn thành thành công
- `failed`: Job thất bại

**Role**: Admin, Analyst (chỉ owner của job)

### 2. Lấy Kết Quả Job
**GET** `/api/jobs/{jobId}/result`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "jobId": "12345678-1234-1234-1234-123456789012",
  "status": "completed",
  "result": {
    "reportId": "report-123",
    "message": "Report uploaded successfully",
    "metricsExtracted": 25,
    "pageCount": 45,
    "pdfType": "TextBased"
  }
}
```

**Response (400 Bad Request) - Job chưa hoàn thành**:
```json
{
  "message": "Job is not completed yet. Current status: processing",
  "progress": 45
}
```

**Role**: Admin, Analyst (chỉ owner của job)

### Polling Pattern cho FE

**Recommended polling logic**:
```javascript
async function pollJobStatus(jobId) {
  while (true) {
    const response = await fetch(`/api/jobs/${jobId}/status`);
    const job = await response.json();
    
    if (job.status === 'completed') {
      return job.result;
    }
    
    if (job.status === 'failed') {
      throw new Error(job.errorMessage);
    }
    
    // Update progress bar
    updateProgress(job.progress);
    
    // Wait 5 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
```

### Job Management cho FE

**QUAN TRỌNG**: FE cần quản lý lifecycle của jobs:

**1. Lưu trữ JobId:**
```javascript
// Sau khi gọi async API
const response = await uploadAsync(file);
const jobId = response.jobId;

// Lưu vào localStorage hoặc state management
localStorage.setItem(`job_${jobId}`, JSON.stringify({
  id: jobId,
  type: 'upload', // hoặc 'chat'
  createdAt: new Date().toISOString(),
  fileName: file.name // cho upload jobs
}));
```

**2. Polling và Cleanup:**
```javascript
async function handleAsyncJob(jobId) {
  try {
    const result = await pollJobStatus(jobId);
    
    // Job completed successfully
    console.log('Job completed:', result);
    
    // Cleanup: Remove from localStorage
    localStorage.removeItem(`job_${jobId}`);
    
    return result;
  } catch (error) {
    // Job failed
    console.error('Job failed:', error);
    
    // Cleanup: Remove from localStorage
    localStorage.removeItem(`job_${jobId}`);
    
    throw error;
  }
}
```

**3. Recovery khi FE restart:**
```javascript
// Khi app khởi động, check các jobs đang pending
function recoverPendingJobs() {
  const jobs = Object.keys(localStorage)
    .filter(key => key.startsWith('job_'))
    .map(key => JSON.parse(localStorage.getItem(key)));
    
  jobs.forEach(job => {
    // Continue polling for each pending job
    handleAsyncJob(job.id).catch(console.error);
  });
}
```

**4. Job Timeout Handling:**
```javascript
async function pollJobStatusWithTimeout(jobId, timeoutMinutes = 30) {
  const startTime = Date.now();
  const timeout = timeoutMinutes * 60 * 1000;
  
  while (true) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Job ${jobId} timed out after ${timeoutMinutes} minutes`);
    }
    
    const response = await fetch(`/api/jobs/${jobId}/status`);
    const job = await response.json();
    
    if (job.status === 'completed') {
      return job.result;
    }
    
    if (job.status === 'failed') {
      throw new Error(job.errorMessage);
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
```

**Job Lifecycle:**
- Jobs tự động cleanup sau 24 giờ trên server
- FE nên cleanup localStorage sau khi job hoàn thành
- Nếu FE crash/restart, có thể recover pending jobs từ localStorage

---

## Companies Module

### 1. Lấy Danh Sách Công Ty
**GET** `/api/Companies?page=1&pageSize=10&industry=Technology`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Integer (default: 1)
- `pageSize`: Integer (default: 10)
- `industry`: String (optional) - Lọc theo ngành

**Response (200 OK)**:
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "dadc66f8-afaa-4c44-b7a3-5ad98ecb63f4",
      "ticker": "string",
      "name": "string",
      "industry": "string",
      "description": "string",
      "website": "string",
      "createdAt": "2026-03-09T21:31:16.900552"
    }
  ]
}
```

**Role**: Admin, Analyst

### 2. Lấy Chi Tiết Công Ty
**GET** `/api/Companies/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "id": "dadc66f8-afaa-4c44-b7a3-5ad98ecb63f4",
  "ticker": "string",
  "name": "string",
  "industry": "string",
  "description": "string",
  "website": "string",
  "createdAt": "2026-03-09T21:31:16.900552"
}
```

**Role**: Admin, Analyst

### 3. Tạo Công Ty Mới
**POST** `/api/Companies`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "ticker": "XYZ",
  "name": "Công ty XYZ",
  "industry": "Finance",
  "description": "Công ty tài chính uy tín",
  "website": "https://xyz.com"
}
```

**Response (201 Created)**:
```json
{
  "id": "company-789",
  "message": "Company created successfully"
}
```

**Role**: Admin only

### 4. Cập Nhật Công Ty
**PUT** `/api/Companies/{id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "ticker": "XYZ",
  "name": "Công ty XYZ Updated",
  "industry": "Finance",
  "description": "Mô tả đã cập nhật",
  "website": "https://xyz-new.com"
}
```

**Response (200 OK)**:
```json
{
  "message": "Company updated successfully"
}
```

**Role**: Admin only
### 5. Xóa Công Ty
**DELETE** `/api/Companies/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "Company deleted successfully"
}
```

**Role**: Admin only

---

## Analytics Module

### 1. Lấy Loại Phân Tích
**GET** `/api/analytics/types`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "analyticTypes": [
    {
      "id": "00870d3b-ccf0-43fa-a41a-240a4662090e",
      "name": "Risk Analysis",
      "code": "RISK",
      "description": "Phân tích rủi ro tài chính"
    },
    {
      "id": "3356f2a6-48e0-4298-aed6-a171d9a6fd2e",
      "name": "Opportunity Analysis",
      "code": "OPPORTUNITY",
      "description": "Phân tích cơ hội đầu tư"
    },
    {
      "id": "422a0570-b4ce-48c8-9b8b-59789cf6272a",
      "name": "Trend Analysis",
      "code": "TREND",
      "description": "Phân tích xu hướng phát triển"
    },
    {
      "id": "c2af086f-ffa9-4722-b029-d858eebc48c2",
      "name": "Executive Summary",
      "code": "EXECUTIVE",
      "description": "Tóm tắt tổng quan"
    },
    {
      "id": "f01aec27-ae26-41e8-b4b4-5f7d73cc85ab",
      "name": "Comparative Analysis",
      "code": "COMPARISON",
      "description": "So sánh giữa các công ty"
    }
  ]
}
```

**Role**: Admin, Analyst

### 2. Tạo Báo Cáo Phân Tích
**POST** `/api/analytics/generate`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sessionId": "e34764c1-f393-4a72-9667-dc9334a70b0d",
  "title": "Phân tích session chat Q1 2024"
}
```

**Response (200 OK)**:
```json
{
  "reportId": "0e41b7d3-7a13-4e50-b41d-8db621f19ebd",
  "message": "AI analytics report generated successfully",
  "fileUrl": "https://rag-system-12345.s3.amazonaws.com/analytics/analytics_e34764c1-f393-4a72-9667-dc9334a70b0d_20260316_143022.pdf"
}
```

**Response (400 Bad Request)**:
```json
{
  "message": "Session not found or access denied."
}
```

**Response (400 Bad Request)**:
```json
{
  "message": "No chat messages found in this session to generate analytics from."
}
```

**New Features**: 
- **AI Integration**: Gửi conversation cho AI để phân tích thông minh
- **HTML Report Generation**: Tạo file HTML chuyên nghiệp với styling đẹp
- **Smart Analysis**: AI tạo insights, recommendations, và executive summary
- **Professional Format**: HTML với sections rõ ràng và responsive design

**Usage Flow**:
1. API lấy tất cả Q&A từ sessionId
2. Build AI prompt với conversation history
3. Call AI service để generate analytics content
4. Convert AI response thành HTML format với professional styling
5. Upload HTML lên S3 và return reportId

**Role**: Admin, Analyst

### 2.1. Tạo Báo Cáo Phân Tích (Async) - NEW
**POST** `/api/analytics/generate-async`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "sessionId": "e34764c1-f393-4a72-9667-dc9334a70b0d",
  "title": "Phân tích session chat Q1 2024"
}
```

**Response (200 OK)**:
```json
{
  "jobId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Response (400 Bad Request)**:
```json
{
  "message": "Session not found or access denied."
}
```

**Features**: 
- **Background Processing**: AI analysis chạy background, không block request
- **Job-based System**: Trả về jobId để polling status
- **Suitable for**: Complex analysis, large conversations, hoặc khi cần tránh timeout
- **Same AI Integration**: Sử dụng cùng AI engine và HTML generation như sync version

**Usage Flow**:
1. API tạo job và return jobId ngay lập tức
2. Background service process AI analysis và HTML generation
3. FE polling job status bằng `/api/jobs/{jobId}/status`
4. Khi complete, get result bằng `/api/jobs/{jobId}/result`

**Polling Pattern**: Sử dụng Jobs Module để track progress

**Role**: Admin, Analyst

### 3. Lấy Danh Sách Báo Cáo Phân Tích
**GET** `/api/analytics/reports?sessionId={guid}&page=1&pageSize=10`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `sessionId`: GUID (optional) - Lọc theo session
- `page`: Integer (default: 1)
- `pageSize`: Integer (default: 10)

**Response (200 OK)**:
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "0e41b7d3-7a13-4e50-b41d-8db621f19ebd",
      "title": "test",
      "sessionId": "e34764c1-f393-4a72-9667-dc9334a70b0d",
      "fileUrl": "https://rag-system-12345.s3.amazonaws.com/analytics/256033e5-f412-4961-b322-5af84c5b7a8c_report_f493c6f0-14e2-4b21-9e0e-c47663ac8339.json",
      "generationType": "auto",
      "createdAt": "2026-03-10T19:00:08.01591"
    }
  ]
}
```

**Role**: Admin, Analyst
### 4. Lấy Chi Tiết Báo Cáo Phân Tích
**GET** `/api/analytics/reports/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "id": "0e41b7d3-7a13-4e50-b41d-8db621f19ebd",
  "title": "test",
  "sessionId": "e34764c1-f393-4a72-9667-dc9334a70b0d",
  "reportFinancialId": "f493c6f0-14e2-4b21-9e0e-c47663ac8339",
  "generatedContent": "\r\n            {\r\n                \"summary\": \"This is an automatically generated analytics report.\",\r\n                \"session_id\": \"e34764c1-f393-4a72-9667-dc9334a70b0d\",\r\n                \"financial_id\": \"f493c6f0-14e2-4b21-9e0e-c47663ac8339\",\r\n                \"generated_at\": \"2026-03-10T12:00:07.5977802Z\"\r\n            }",
  "fileUrl": "https://rag-system-12345.s3.amazonaws.com/analytics/256033e5-f412-4961-b322-5af84c5b7a8c_report_f493c6f0-14e2-4b21-9e0e-c47663ac8339.json",
  "generationType": "auto",
  "generatedBy": {
    "id": "443f3e2b-63fe-4268-8f9f-cb49ec501b67",
    "fullName": "System Admin"
  },
  "createdAt": "2026-03-10T19:00:08.01591"
}
```

**Role**: Admin, Analyst

### 5. Tải Xuống Báo Cáo Phân Tích - NEW
**GET** `/api/analytics/reports/{id}/download`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
- **Content-Type**: `text/html`
- **Content-Disposition**: `attachment; filename="analytics_report_{id}.html"`
- **File Download**: Trả về file HTML trực tiếp để download

**Response (404 Not Found)**:
```json
{
  "message": "Report file not found"
}
```

**Usage**: 
- API trả về file HTML trực tiếp để browser tự động download/open
- File HTML chứa AI-generated analytics với professional styling
- Includes executive summary, insights, recommendations từ AI analysis
- Responsive design, có thể mở trên browser hoặc save as PDF từ browser

**Example cURL**:
```bash
curl -X GET "/api/analytics/reports/{id}/download" \
  -H "Authorization: Bearer <token>" \
  --output "analytics_report.html"
```

**HTML Content Structure**:
1. **Executive Summary** - AI-generated overview
2. **Key Insights** - Important findings from conversation
3. **Financial Analysis** - Relevant financial aspects (if applicable)
4. **Trends and Patterns** - Identified patterns in discussion
5. **Recommendations** - Actionable suggestions from AI
6. **Conclusion** - Summary and next steps

**Note**: File được tạo dưới dạng HTML với professional styling. Người dùng có thể:
- Mở trực tiếp trong browser để xem
- Print to PDF từ browser nếu cần file PDF
- Save as PDF using browser's print function

**Role**: Admin, Analyst

---

## Metrics Module

### 1. Lấy Nhóm Metrics
**GET** `/api/metrics/groups`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "groups": [
    {
      "id": "group-001",
      "name": "Tài chính",
      "description": "Các chỉ số tài chính cơ bản",
      "order": 1
    },
    {
      "id": "group-002",
      "name": "Hiệu quả hoạt động",
      "description": "Các chỉ số về hiệu quả hoạt động",
      "order": 2
    }
  ]
}
```

**Role**: Admin, Analyst

### 2. Lấy Định Nghĩa Metrics
**GET** `/api/metrics/definitions?groupId={guid}`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `groupId`: GUID (optional) - Lọc theo nhóm

**Response (200 OK)**:
```json
{
  "definitions": [
    {
      "id": "metric-001",
      "code": "REVENUE",
      "name": "Doanh thu",
      "description": "Tổng doanh thu trong kỳ",
      "unit": "VND",
      "groupId": "group-001",
      "formula": "Tổng doanh thu bán hàng và cung cấp dịch vụ"
    }
  ]
}
```

**Role**: Admin, Analyst

### 3. Lấy Giá Trị Metrics Theo Báo Cáo
**GET** `/api/metrics/values/{reportId}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "reportId": "report-123",
  "values": [
    {
      "metricId": "metric-001",
      "code": "REVENUE",
      "name": "Doanh thu",
      "value": 150000000000,
      "unit": "VND",
      "extractedAt": "2024-03-10T10:00:00Z"
    }
  ]
}
```

**Role**: Admin, Analyst
### 4. Tính Toán Metrics
**POST** `/api/metrics/calculate`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "reportId": "report-123",
  "metricIds": ["metric-001", "metric-002"],
  "parameters": {
    "recalculate": true,
    "useAI": true
  }
}
```

**Response (200 OK)**:
```json
{
  "reportId": "report-123",
  "calculatedMetrics": [
    {
      "metricId": "metric-001",
      "code": "REVENUE",
      "value": 150000000000,
      "confidence": 0.95,
      "source": "AI_EXTRACTION"
    }
  ],
  "status": "completed"
}
```

**Role**: Admin, Analyst

---

## Admin Module

### 1. Lấy Danh Sách Users
**GET** `/api/admin/users?page=1&pageSize=10&roleId={guid}`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Integer (default: 1)
- `pageSize`: Integer (default: 10)
- `roleId`: GUID (optional) - Lọc theo role

**Response (200 OK)**:
```json
{
  "total": 4,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "c47b70b5-8ad0-42a6-b3f5-4f4c5b77642e",
      "email": "baophi852@gmail.com",
      "fullName": "Phạm Bảo Phi",
      "role": "Analyst",
      "isActive": true,
      "createdAt": "2026-03-10T16:39:45.681851",
      "lastLoginAt": null
    },
    {
      "id": "8676dd5b-fe45-4fd9-909b-e074bb72f82e",
      "email": "phipbse185046@fpt.edu.vn",
      "fullName": "Phạm Bảo Phi",
      "role": "Analyst",
      "isActive": true,
      "createdAt": "2026-03-10T16:37:54.753678",
      "lastLoginAt": null
    },
    {
      "id": "39020922-17b0-4598-9fa8-b1b19d4da13a",
      "email": "analyst@rag.com",
      "fullName": "System Analyst",
      "role": "Analyst",
      "isActive": true,
      "createdAt": "2026-03-09T15:06:51.029659",
      "lastLoginAt": null
    },
    {
      "id": "443f3e2b-63fe-4268-8f9f-cb49ec501b67",
      "email": "admin@rag.com",
      "fullName": "System Admin",
      "role": "Admin",
      "isActive": true,
      "createdAt": "2026-03-09T15:06:49.882464",
      "lastLoginAt": null
    }
  ]
}
```

**Role**: Admin only

### 2. Lấy Chi Tiết User
**GET** `/api/admin/users/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "id": "c47b70b5-8ad0-42a6-b3f5-4f4c5b77642e",
  "email": "baophi852@gmail.com",
  "fullName": "Phạm Bảo Phi",
  "role": {
    "id": "6ca39188-1ee1-4574-b2da-74ff0c8325b2",
    "name": "Analyst"
  },
  "isActive": true,
  "createdAt": "2026-03-10T16:39:45.681851",
  "lastLoginAt": null,
  "statistics": {
    "reportsUploaded": 0,
    "chatSessions": 3
  }
}
```

**Role**: Admin only

### 3. Cập Nhật User
**PUT** `/api/admin/users/{id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "fullName": "Nguyễn Văn A Updated",
  "role": "Admin",// Admin or Analyst
  "isActive": true
}
```

**Response (200 OK)**:
```json
{
  "message": "User updated successfully"
}
```

**Response (404 Not Found)**:
```json
{
  "message": "User not found"
}
```

**Response (400 Bad Request)**:
```json
{
  "message": "Role 'InvalidRole' not found"
}
```

**Valid Roles**: "Admin", "Analyst"

**Role**: Admin only
### 4. Xóa User
**DELETE** `/api/admin/users/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "User deleted successfully"
}
```

**Role**: Admin only

### 5. Lấy Audit Logs (Not Developed)
**GET** `/api/admin/audit-logs?userId={guid}&action=LOGIN&startDate=2024-03-01&endDate=2024-03-10&page=1&pageSize=50`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `userId`: GUID (optional)
- `action`: String (optional) - Loại hành động
- `startDate`: DateTime (optional)
- `endDate`: DateTime (optional)
- `page`: Integer (default: 1)
- `pageSize`: Integer (default: 50)

**Response (200 OK)**:
```json
{
  "total": 0,
  "page": 1,
  "pageSize": 50,
  "data": []
}
```

**Note**: API endpoint đã được implement nhưng chức năng audit logging chưa được phát triển. Hiện tại sẽ luôn trả về empty array. Tính năng này sẽ được implement trong phiên bản tương lai.

**Role**: Admin only

### 6. Lấy Thống Kê Hệ Thống
**GET** `/api/admin/statistics`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "users": {
    "total": 4,
    "active": 4,
    "byRole": {
      "Analyst": 3,
      "Admin": 1
    }
  },
  "reports": {
    "total": 1,
    "public": 0,
    "private": 0
  },
  "chatSessions": {
    "total": 4,
    "activeToday": 3
  },
  "storage": {
    "totalSizeGB": 0,
    "filesCount": 1
  }
}
```

**Role**: Admin only

### 7. Tạo Report Category
**POST** `/api/admin/report-categories`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Báo cáo ESG",
  "description": "Báo cáo về môi trường, xã hội và quản trị"
}
```

**Response (201 Created)**:
```json
{
  "id": "category-001",
  "message": "Report category created successfully"
}
```

**Role**: Admin only
### 8. Lấy Report Categories (Admin)
**GET** `/api/admin/report-categories?page=1&pageSize=10`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "ae773511-0cdd-4d40-86f4-5897a8c9b293",
      "name": "string",
      "description": "string",
      "associatedReportsCount": 1,
      "associatedReports": [
        {
          "id": "c9bb0d15-7b8b-4ee7-84ba-e5b15dd664a9",
          "title": "20250422 - FPT - BCTC cong ty me Quy 1 nam 2025.pdf",
          "companyName": "string",
          "createdAt": "2026-03-09T21:31:39.986036"
        }
      ]
    }
  ]
}
```

**Role**: Admin only

### 9. Cập Nhật Report Category
**PUT** `/api/admin/report-categories/{id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Báo cáo ESG Updated",
  "description": "Mô tả đã cập nhật",
}
```

**Response (200 OK)**:
```json
{
  "message": "Report category updated successfully"
}
```

**Role**: Admin only

### 10. Xóa Report Category
**DELETE** `/api/admin/report-categories/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "Report category deleted successfully"
}
```

**Response (400 Bad Request)**:
```json
{
  "message": "Cannot delete category with associated reports"
}
```

**Role**: Admin only

### 11. Tạo Analytics Type
**POST** `/api/admin/analytics-types`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "code": "FINANCIAL_ANALYSIS",
  "name": "Phân tích tài chính",
  "description": "Phân tích các chỉ số tài chính cơ bản"
}
```

**Response (201 Created)**:
```json
{
  "id": "12345678-1234-1234-1234-123456789012",
  "message": "Analytics type created successfully"
}
```

**Role**: Admin only

### 12. Cập Nhật Analytics Type
**PUT** `/api/admin/analytics-types/{id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "code": "FINANCIAL_ANALYSIS_UPDATED",
  "name": "Phân tích tài chính nâng cao",
  "description": "Phân tích chi tiết các chỉ số tài chính"
}
```

**Response (200 OK)**:
```json
{
  "message": "Analytics type updated successfully"
}
```

**Role**: Admin only

### 13. Xóa Analytics Type
**DELETE** `/api/admin/analytics-types/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "Analytics type deleted successfully"
}
```

**Response (400 Bad Request)**:
```json
{
  "message": "Cannot delete analytics type with associated chat sessions"
}
```

**Role**: Admin only
---

## Report Categories (Public)

### 1. Lấy Report Categories (Cho Analyst)
**GET** `/api/report-categories`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "categories": [
    {
      "id": "ae773511-0cdd-4d40-86f4-5897a8c9b293",
      "name": "string",
      "description": "string"
    }
  ]
}
```

**Role**: Admin, Analyst

---

## Test Endpoints

### 1. Test OpenAI Connection
**GET** `/api/TestAI/openai`

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "OpenAI connection successful",
  "response": "Xin chào từ Việt Nam!"
}
```

**Role**: Không yêu cầu authentication

### 2. Test S3 Upload
**POST** `/api/test/s3-upload`

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body** (Form Data):
- `file`: File to upload (any file type for testing)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "S3 upload test completed successfully",
  "data": {
    "fileName": "test-upload.txt",
    "fileSize": 25,
    "uploadedAt": "2026-03-17T06:44:36.0924444Z",
    "s3Key": "test-files/test-upload-12345.txt"
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "No file provided or invalid file format"
}
```

**Role**: Admin, Analyst

### 3. Get S3 Info
**GET** `/api/test/s3-info`

**Headers**: `Authorization: Bearer <token>`

**Response (200 OK)**:
```json
{
  "message": "S3 service is available",
  "timestamp": "2026-03-17T06:44:36.0924444Z"
}
```

**Response (500 Internal Server Error)**:
```json
{
  "message": "S3 service is not available",
  "timestamp": "2026-03-17T06:44:36.0924444Z",
  "error": "Connection timeout"
}
```

**Role**: Admin, Analyst


---

## Error Handling

### HTTP Status Codes

- **200 OK**: Thành công
- **201 Created**: Tạo mới thành công
- **400 Bad Request**: Lỗi validation hoặc request không hợp lệ
- **401 Unauthorized**: Chưa đăng nhập hoặc token không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Không tìm thấy resource
- **409 Conflict**: Xung đột dữ liệu (ví dụ: email đã tồn tại)
- **500 Internal Server Error**: Lỗi server

### Error Response Format

```json
{
  "message": "Mô tả lỗi bằng tiếng Việt",
  "details": "Chi tiết kỹ thuật (optional)"
}
```

### Common Error Examples

**401 Unauthorized**:
```json
{
  "message": "User is not authenticated or Sub is missing."
}
```

**403 Forbidden**:
```json
{
  "message": "Bạn không có quyền truy cập resource này."
}
```

**400 Bad Request**:
```json
{
  "message": "Email đã tồn tại trong hệ thống."
}
```

**404 Not Found**:
```json
{
  "message": "Không tìm thấy báo cáo với ID này."
}
```

**500 Internal Server Error**:
```json
{
  "message": "An error occurred while processing your request.",
  "details": "Database connection timeout"
}
```

---

## Authentication Flow

### 1. Đăng Ký và Xác Thực
1. **POST** `/api/auth/register` - Đăng ký tài khoản
2. **POST** `/api/auth/verify-account` - Xác thực email với mã code
3. **POST** `/api/auth/login` - Đăng nhập lấy token

### 2. Sử Dụng API
- Thêm header: `Authorization: Bearer <access_token>`
- Token có thời hạn, cần refresh khi hết hạn
- Mỗi API có yêu cầu role khác nhau (Admin/Analyst)

### 3. Đăng Xuất
- **POST** `/api/auth/logout` - Đăng xuất khỏi tất cả thiết bị

---

## cURL Examples

### Đăng Nhập
```bash
curl -X POST "https://api.rag-system.com/api/Auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Upload Báo Cáo (Synchronous)
```bash
curl -X POST "https://api.rag-system.com/api/reports/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@report.pdf" \
  -F "companyId=12345678-1234-1234-1234-123456789012" \
  -F "categoryId=87654321-4321-4321-4321-210987654321" \
  -F "year=2024" \
  -F "period=Q1" \
  -F "visibility=private"
```

### Upload Báo Cáo (Asynchronous) - NEW
```bash
# Step 1: Start async upload
curl -X POST "https://api.rag-system.com/api/reports/upload-async" \
  -H "Authorization: Bearer <token>" \
  -F "file=@report.pdf" \
  -F "companyId=12345678-1234-1234-1234-123456789012" \
  -F "categoryId=87654321-4321-4321-4321-210987654321" \
  -F "year=2024" \
  -F "period=Q1" \
  -F "visibility=private"

# Response: {"jobId": "job-123", "status": "pending"}

# Step 2: Poll job status
curl -X GET "https://api.rag-system.com/api/jobs/job-123/status" \
  -H "Authorization: Bearer <token>"

# Step 3: Get result when completed
curl -X GET "https://api.rag-system.com/api/jobs/job-123/result" \
  -H "Authorization: Bearer <token>"
```

### Hỏi Câu Hỏi Chat (Synchronous)
```bash
curl -X POST "https://api.rag-system.com/api/chat/ask" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "87654321-4321-4321-4321-210987654321",
    "questionText": "Doanh thu của công ty ABC trong Q1 là bao nhiêu?"
  }'
```

### Hỏi Câu Hỏi Chat (Asynchronous) - NEW
```bash
# Step 1: Start async chat
curl -X POST "https://api.rag-system.com/api/chat/ask-async" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "87654321-4321-4321-4321-210987654321",
    "questionText": "Doanh thu của công ty ABC trong Q1 là bao nhiêu?"
  }'

# Response: {"jobId": "job-456", "status": "pending"}

# Step 2: Poll job status
curl -X GET "https://api.rag-system.com/api/jobs/job-456/status" \
  -H "Authorization: Bearer <token>"
```

### Test S3 Upload
```bash
curl -X POST "https://api.rag-system.com/api/test/s3-upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@test-file.txt"
```

### Get S3 Info
```bash
curl -X GET "https://api.rag-system.com/api/test/s3-info" \
  -H "Authorization: Bearer <token>"
```

---

## Notes

- Tất cả datetime đều sử dụng format ISO 8601 UTC
- File upload giới hạn 100MB (có thể config)
- API rate limiting: 1000 requests/hour per user
- Tất cả GUID đều sử dụng format standard UUID v4
- Response messages chính đều bằng tiếng Việt
- Technical terms giữ nguyên tiếng Anh (JSON, HTTP, Bearer Token, etc.)

### NEW: Asynchronous Processing

**Tại sao cần Async APIs?**
- Upload và Chat processing có thể mất 5-20 phút
- API Gateway có timeout limit (30 giây)
- Async APIs giải quyết timeout issues

**Khi nào dùng Async vs Sync?**
- **Sync APIs** (`/upload`, `/ask`): Dùng cho development/testing local
- **Async APIs** (`/upload-async`, `/ask-async`): Dùng cho production deployment

**Async Workflow:**
1. FE gọi async endpoint → nhận `jobId` ngay lập tức (< 2s)
2. FE polling `/jobs/{jobId}/status` mỗi 5 giây
3. Khi `status = "completed"` → lấy kết quả từ response
4. Nếu `status = "failed"` → hiển thị error message

**Job Lifecycle:**
- `pending` → `processing` → `completed`/`failed`
- Jobs tự động cleanup sau 24 giờ
- Progress từ 0-100% để hiển thị progress bar

---

## API Changes Log

### **Version 2.4.0 - March 17, 2026**

#### **🎯 CRITICAL FIX: Analytics File Format**
1. **POST /api/analytics/generate**
   - **FIXED**: File corruption issue resolved
   - **Format Change**: Now generates proper HTML files instead of corrupted PDF
   - **Content-Type**: `text/html` (was `application/pdf`)
   - **File Extension**: `.html` (was `.pdf`)
   - **Impact**: Files now open correctly in browsers without corruption errors

2. **POST /api/analytics/generate-async** ✨ **NEW - FULLY IMPLEMENTED**
   - **Status**: ✅ **COMPLETED** (was placeholder)
   - **Returns**: `{"jobId": "guid"}` for background processing
   - **Job System**: Full integration with async job processing
   - **Polling**: Use `/api/jobs/{jobId}/status` to track progress
   - **Impact**: No more timeout issues for complex AI analysis

3. **GET /api/analytics/reports/{id}/download**
   - **FIXED**: File format corruption resolved
   - **Content-Type**: `text/html` (was `application/pdf`)
   - **File Extension**: `.html` (was `.pdf`)
   - **Professional Styling**: CSS-styled HTML with responsive design
   - **Browser Compatible**: Opens directly in browser, can print to PDF if needed
   - **Impact**: Users can now view reports without file corruption errors

#### **🎨 HTML Report Features**
- **Professional Styling**: Clean CSS design with proper typography
- **Responsive Layout**: Works on desktop and mobile browsers
- **Interactive Content**: Searchable text, copyable content
- **Print-to-PDF**: Browser's print function can generate PDF if needed
- **Structured Sections**: Executive Summary, Key Insights, Recommendations
- **AI-Generated Content**: Real Gemini AI analysis with smart insights

#### **🔧 Backend Implementation**
- **Background Job Processing**: Full async analytics job support
- **HTML Generation**: Professional HTML templates with CSS styling
- **Content Processing**: Markdown-to-HTML conversion with proper formatting
- **Error Handling**: Graceful fallbacks for AI service failures
- **File Management**: Proper HTML file storage and retrieval

#### **📋 FE Integration Notes**
- **File Handling**: Expect `.html` files instead of `.pdf`
- **Content-Type**: Handle `text/html` response type
- **User Experience**: Files open immediately in browser
- **Print Option**: Users can print to PDF from browser if needed
- **Async Jobs**: Implement polling for `/api/analytics/generate-async`

#### **🧪 NEW: S3 Test Endpoints**
4. **POST /api/test/s3-upload** ✨ **NEW**
   - **Purpose**: Test S3 upload functionality for system diagnostics
   - **Request**: Multipart form data with file upload
   - **Response**: Success status with upload details and timestamp
   - **Role**: Admin, Analyst
   - **Usage**: System configuration testing and S3 connectivity verification

5. **GET /api/test/s3-info** ✨ **NEW**
   - **Purpose**: Check S3 service availability and configuration
   - **Response**: Service status message with timestamp
   - **Role**: Admin, Analyst
   - **Usage**: System health monitoring and S3 service diagnostics
   - **Integration**: Available in Admin System Config page
- **Async Jobs**: Implement polling for `/api/analytics/generate-async`

### **Version 2.3.0 - March 16, 2026**

#### **🤖 AI-Powered Analytics Generation**
1. **POST /api/analytics/generate**
   - **MAJOR UPGRADE**: Now uses real AI integration for intelligent analysis
   - **PDF Generation**: Creates professional PDF reports instead of JSON
   - **AI Analysis**: Sends conversation to AI for smart insights and recommendations
   - **Professional Format**: Structured PDF with executive summary, insights, and recommendations
   - **Impact**: Much more valuable analytics reports with AI-driven insights

2. **GET /api/analytics/reports/{id}/download**
   - **File Format Change**: Now returns PDF files instead of JSON
   - **Content-Type**: Changed from `application/json` to `application/pdf`
   - **Professional Output**: AI-generated content in readable PDF format
   - **Impact**: Users get professional reports they can share and present

3. **POST /api/analytics/generate-async**
   - **NEW ENDPOINT**: Placeholder for future async processing
   - **Job Integration**: Will support long AI processing times
   - **Status**: Coming soon - currently redirects to sync version

#### **🔧 Technical Improvements**
- **AI Prompt Engineering**: Smart conversation analysis prompts
- **PDF Generation**: Professional document formatting
- **Error Handling**: Better validation for AI processing
- **File Management**: Proper PDF file naming and storage

#### **📋 Content Enhancement**
- **Executive Summary**: AI-generated high-level overview
- **Key Insights**: Intelligent analysis of conversation patterns
- **Financial Analysis**: Relevant financial aspects identification
- **Recommendations**: Actionable suggestions based on discussion
- **Professional Structure**: Clear sections and formatting

### **Version 2.1.0 - March 16, 2026**

#### **🔧 Fixed APIs**
1. **GET /api/reports/search**
   - **Fixed**: Bỏ validation required cho parameter `query`
   - **Change**: `query` parameter giờ là optional, có thể để trống để lấy tất cả báo cáo
   - **Impact**: FE không cần bắt buộc nhập search term

2. **PUT /api/admin/users/{id}**
   - **Fixed**: Đổi request body từ `roleId` (GUID) sang `role` (string)
   - **Before**: `{"roleId": "guid-here"}`
   - **After**: `{"role": "Admin"}` 
   - **Valid roles**: "Admin", "Analyst"
   - **Impact**: Consistent với format trả về của các API khác

#### **✨ New APIs**
3. **GET /api/analytics/reports/{id}/download**
   - **New**: Endpoint tải xuống báo cáo analytics
   - **Returns**: Presigned URL với thời hạn 1 giờ
   - **Usage**: FE dùng downloadUrl để tải file JSON

#### **🚀 Enhanced APIs**
4. **GET /api/admin/audit-logs**
   - **Status**: Not Developed - API endpoint exists but audit logging functionality not implemented
   - **Returns**: Always empty array `[]`
   - **Note**: Planned for future development

#### **📋 Documentation Updates**
- Cập nhật tất cả request/response examples
- Thêm usage examples cho search API
- Làm rõ optional vs required parameters
- Thêm error responses chi tiết

