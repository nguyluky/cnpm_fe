import { QrCode } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'

function InitPage({ onOk }: { onOk: () => void }) {
    // ... (Giữ nguyên InitPage)
    return <div className="h-full flex flex-col items-center justify-center space-y-6 bg-[#222222]">
        <div className="text-2xl font-bold mb-4 flex items-center justify-center h-4/5">
            <QrCode size={60} className="text-white h-40 w-40" />
        </div>


        <div className="h-1/5 text-center">
            <p className="text-white text-lg">
                Nhấn bắt đầu để quét mã QR điểm danh.
            </p>

            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded active:bg-blue-600" onClick={onOk}>
                Bắt đầu quét
            </button>
        </div>

    </div>
}

export const QRRollCall: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const highlightCanvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [barcodeValue, setBarcodeValue] = useState('Đang chờ...');
    const [readTime, setReadTime] = useState('N/A');
    const [apiStatus, setApiStatus] = useState({
        text: 'Đang kiểm tra...',
        isError: false,
    });

    // Hàm vẽ khung Highlight (Giữ nguyên)
    const drawHighlightBox = useCallback((box, highlightCtx) => {
        if (!highlightCtx) return;

        highlightCtx.clearRect(0, 0, highlightCtx.canvas.width, highlightCtx.canvas.height);

        highlightCtx.beginPath();
        highlightCtx.lineWidth = 4;
        highlightCtx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // màu vàng với độ trong suốt
        highlightCtx.fillStyle = 'rgba(255, 215, 0, 0.3)';

        // Vẽ hình chữ nhật xung quanh bounding box
        highlightCtx.fillRect(box.x, box.y, box.width, box.height);

        highlightCtx.stroke();
        highlightCtx.closePath();
    }, []);

    // Khởi tạo camera và detector
    useLayoutEffect(() => {

        const scanLoop = async (detector: BarcodeDetectorPolyfill) => {
            const video = videoRef.current;
            const offscreenCanvas = offscreenCanvasRef.current;
            const highlightCanvas = highlightCanvasRef.current;

            if (
                video &&
                offscreenCanvas &&
                highlightCanvas &&
                video.readyState === video.HAVE_ENOUGH_DATA
            ) {
                const offscreenCtx = offscreenCanvas.getContext('2d')!;
                const highlightCtx = highlightCanvas.getContext('2d')!;

                // 1. Clear Canvas hiển thị
                highlightCtx.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height);

                // 2. Vẽ khung hình hiện tại từ video sang canvas ẩn
                offscreenCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

                const startTime = performance.now();

                try {
                    // 3. Thực hiện quét trên Canvas ẩn
                    const barcodes = await detector.detect(offscreenCanvas);

                    const endTime = performance.now();
                    const timeTaken = (endTime - startTime).toFixed(2);

                    if (barcodes.length > 0) {
                        const firstBarcode = barcodes[0];

                        // Cập nhật kết quả & thời gian
                        setBarcodeValue(firstBarcode.rawValue);
                        setReadTime(`${timeTaken} ms`);

                        // 4. Vẽ khung Highlight lên Canvas hiển thị
                        drawHighlightBox(firstBarcode.boundingBox, highlightCtx);
                        console.log('Mã vạch phát hiện:', firstBarcode.rawValue);
                    } else {
                        setBarcodeValue('Không tìm thấy...');
                        setReadTime(`N/A (${timeTaken} ms)`);
                    }
                } catch (e) {
                    console.error('Lỗi khi phát hiện mã vạch:', e);
                }
            }

            // 5. Tiếp tục vòng lặp
            animationFrameRef.current = requestAnimationFrame(() => scanLoop(detector));
        }


        const initCameraAndDetector = async () => {
            const video = videoRef.current!;
            const highlightCanvas = highlightCanvasRef.current!;
            const offscreenCanvas = offscreenCanvasRef.current!;

            try {
                const detector = new BarcodeDetectorPolyfill({
                    formats: ['qr_code', 'ean_13', 'code_128', 'upc_a', 'code_39'],
                });

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false,
                });

                video.srcObject = stream;

                await new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        // Thiết lập kích thước Canvas hiển thị và Canvas ẩn khớp với kích thước video
                        highlightCanvas.width = video.videoWidth;
                        highlightCanvas.height = video.videoHeight;
                        offscreenCanvas.width = video.videoWidth;
                        offscreenCanvas.height = video.videoHeight;

                        // Quan trọng: Đặt kích thước hiển thị của canvas khớp với kích thước video
                        // Đây là nơi cần điều chỉnh để canvas highlight hiển thị đúng khi video full screen
                        // Chúng ta sẽ giải quyết việc này bằng CSS ở phần render.

                        resolve(void 0);
                    };
                });

                // Bắt đầu vòng lặp quét
                animationFrameRef.current = requestAnimationFrame(() => scanLoop(detector));
                setApiStatus({
                    text: 'Đang quét mã QR...',
                    isError: false,
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Lỗi khi truy cập camera hoặc khởi tạo detector:', err);
                setApiStatus({
                    text: 'Lỗi truy cập camera: ' + err.message,
                    isError: true,
                });
            }
        };

        initCameraAndDetector();

        const videoElemant = videoRef.current!;

        // Dọn dẹp: dừng camera và vòng lặp requestAnimationFrame khi component bị unmount (Giữ nguyên)
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoElemant.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop())
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        // Container cha: Lấp đầy màn hình (h-screen, w-screen hoặc h-full w-full trong body/root container)
        <div className="h-screen w-screen relative bg-black">
            {/* Container cho Video và Canvas. 
               Đặt:
                - h-full w-full: Lấp đầy container cha (toàn màn hình)
                - relative: Để các phần tử absolute bên trong hoạt động đúng
            */}
            <div className="h-full w-full relative overflow-hidden">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                ></video>

                <canvas
                    ref={highlightCanvasRef}
                    // Các class mới quan trọng:
                    // absolute inset-0: Phủ lên video
                    // w-full h-full: Đảm bảo Canvas hiển thị có cùng kích thước hiển thị với Video
                    // object-cover: Rất quan trọng để Canvas Highlight co giãn và cắt (crop) 
                    // theo cùng một cách với Video, giúp khung Highlight vẽ đúng vị trí.
                    className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                ></canvas>

                {/* Canvas ẩn không cần thay đổi, vì nó không hiển thị */}
                <canvas
                    ref={offscreenCanvasRef}
                    className="absolute top-0 left-0 hidden" // Thêm 'hidden' để ẩn hoàn toàn
                ></canvas>

                {
                    // mask 
                }
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <svg width="100%" height="100%">
                        <mask id="holeMask">
                            <rect width="100%" height="100%" fill="white" />
                            <rect
                                x="50%" y="50%"
                                width="390"
                                height="590"
                                rx="30" ry="30"
                                transform="translate(
                                    -195, -295
                                )"
                                fill="black"
                            />
                        </mask>
                    </svg>

                    <div
                        style={{
                            mask: "url(#holeMask)",
                            WebkitMask: "url(#holeMask)",
                        }}
                        className="absolute inset-0 bg-black/30"
                    ></div>
                </div>


            </div>
        </div >
    );
};
