# Super App Showcase (Tiếng Việt)

Tài liệu tóm tắt kiến trúc và hướng dẫn chạy dự án super app này.

## Tổng quan kiến trúc
- Monorepo dùng pnpm workspaces, React Native + Re.Pack (Rspack) + Module Federation.
- `host` là super app, load các mini-app từ xa bằng Module Federation.
- Mini-app nội bộ: `booking` (9000), `shopping` (9001), `dashboard` (9002), `auth` (9003). Mini-app ngoài repo: `news` (9004). Các mini-app nội bộ chỉ chạy dạng remote, không kèm project native/standalone.
- `sdk` căn chỉnh shared deps cho tất cả mini-apps.
- Các mini-app có thư mục iOS/Android riêng; bundling do Re.Pack đảm nhiệm.

## Cấu trúc thư mục chính
- `packages/host`: shell điều hướng, danh sách dịch vụ, lazy-load remotes.
- `packages/booking`, `packages/shopping`, `packages/dashboard`: mini-apps, mỗi app expose navigator qua Module Federation (không còn native runner).
- `packages/auth`: module auth dùng chung, expose qua Module Federation (không chạy độc lập).
- `packages/sdk`: scripts/ cấu hình align dependencies.
- `mprocs/host.yaml`: orchestrator chạy dev server cho host + mini-apps.

## Yêu cầu môi trường
- Node >= 22 (project đặt engineStrict).
- pnpm 9.x (cài bằng corepack hoặc hướng dẫn pnpm).
- Ruby (rbenv) cho iOS pods; trong repo đang dùng 2.7.6 cho các dự án RN.

## Cách chạy nhanh
1) Cài deps: `pnpm install`
2) Chạy dev servers nội bộ: `pnpm start` (dùng mprocs: host+auth+booking+dashboard+shopping).
3) Chạy News (ngoài repo): clone https://github.com/callstack/news-mini-app-showcase, `pnpm install`, `pnpm start` (cổng 9004, cần Node >=22, nên chạy song song với Auth 9003).
4) Chạy app native:
   - iOS: `pnpm run:host:ios`
   - Android: `pnpm run:host:android`

> Nếu chạy trên thiết bị/emulator và không truy cập được `localhost`, đổi URL remotes trong `packages/host/rspack.config.mjs` từ `localhost` sang IP máy.

## Module Federation trong Host
- Cấu hình tại `packages/host/rspack.config.mjs`.
- Remotes:
  - booking: `http://localhost:9000/${platform}/mf-manifest.json`
  - shopping: `http://localhost:9001/${platform}/mf-manifest.json`
  - dashboard: `http://localhost:9002/${platform}/mf-manifest.json`
  - auth: `http://localhost:9003/${platform}/mf-manifest.json`
  - news: `http://localhost:9004/${platform}/mf-manifest.json` (ngoài repo)
- Shared deps lấy từ `getSharedDependencies` trong `packages/sdk`.

## Điều hướng & UI chính (Host)
- `src/navigation/MainNavigator.tsx`: stack chứa Tabs và các màn Booking/Shopping/News/Dashboard.
- `src/screens/ServicesScreen.tsx`: đọc `src/data/services.json` để hiển thị danh sách dịch vụ và điều hướng.
- `src/screens/NewsScreen.tsx`: `React.lazy(() => import('news/App'))` + Suspense + ErrorBoundary; cần news remote đang chạy.

## Scripts hữu ích
- `pnpm start`: chạy mprocs cho host + mini-apps nội bộ.
- Mini-apps nội bộ chạy như remote phục vụ cho Host; nếu cần News độc lập, dùng repo ngoài `news-mini-app-showcase`.
- `pnpm pods`: cài CocoaPods cho tất cả iOS projects.
- `pnpm -r lint|test|typecheck`: lint/test/typecheck toàn bộ workspaces.

## Troubleshooting nhanh
- Lỗi RUNTIME-003 khi vào News: chưa có server news trên 9004 hoặc thiết bị không truy cập được `localhost`; hãy chạy news repo và đảm bảo URL đúng IP.
- Cảnh báo engine Node: nâng Node lên >=22 để tránh cảnh báo và lỗi tiềm ẩn.
- Trên thiết bị thật/emulator: thay `localhost` bằng IP trong remote URLs.

## Khi cần chỉnh sửa/đổi remotes
1) Sửa URL trong `packages/host/rspack.config.mjs`.
2) Nếu không dùng News, xóa mục `news` khỏi `services.json` và route `News` trong `MainNavigator`.
3) Thêm mini-app mới: thêm remote vào config, tạo screen để lazy-load module (e.g. `React.lazy(() => import('<remote>/<exposed>'))`), cập nhật navigation + services list.

## Học sâu hơn
- Xem `packages/sdk` để hiểu cách align deps (rnx-kit/align-deps).
- Mỗi mini-app có `rspack.config.mjs` riêng để expose navigator.
- `packages/host/jest.setup.js` cho thấy cách mock remotes khi test.
