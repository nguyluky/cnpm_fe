import { QrCode } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

function preprocessFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // tăng contrast nhẹ
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const factor = 1.2; // contrast

    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] - 128) * factor + 128;
        data[i + 1] = (data[i + 1] - 128) * factor + 128;
        data[i + 2] = (data[i + 2] - 128) * factor + 128;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

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

function sortPointsClockwise(points: { x: number; y: number; }[]) {
    // Tính tâm polygon
    const cx = (points[0].x + points[1].x + points[2].x + points[3].x) / 4;
    const cy = (points[0].y + points[1].y + points[2].y + points[3].y) / 4;

    return points
        .map(p => ({
            ...p,
            angle: Math.atan2(p.y - cy, p.x - cx)
        }))
        .sort((a, b) => a.angle - b.angle);
}


export const QRRollCall: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const highlightCanvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastDetectedRef = useRef<string | null>(null);

    const [barcodeValue, setBarcodeValue] = useState('Đang chờ...');
    const [readTime, setReadTime] = useState('N/A');
    const [apiStatus, setApiStatus] = useState({
        text: 'Đang kiểm tra...',
        isError: false,
    });

    // Hàm vẽ khung Highlight (Giữ nguyên)
    const drawHighlightBox = useCallback((points: { x: number; y: number; }[], highlightCtx: CanvasRenderingContext2D) => {
        if (!highlightCtx) return;

        points = sortPointsClockwise(points);
        console.log('Drawing highlight box with points:', points);

        const ctx = highlightCtx;

        ctx.clearRect(0, 0, highlightCanvasRef.current!.width, highlightCanvasRef.current!.height);

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        ctx.lineWidth = 4;
        ctx.strokeStyle = "#00ff99";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ff99";
        ctx.stroke();
    }, []);

    // Khởi tạo camera và detector
    useLayoutEffect(() => {

        const initCameraAndDetector = async () => {
            const video = videoRef.current!;
            const highlightCanvas = highlightCanvasRef.current!;
            const offscreenCanvas = offscreenCanvasRef.current!;

            try {
                const detector = new BrowserMultiFormatReader();

                setApiStatus({
                    text: 'Đang quét mã QR...',
                    isError: false,
                });

                const hints = new Map();
                hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39, BarcodeFormat.CODE_128, BarcodeFormat.QR_CODE]);
                hints.set(DecodeHintType.TRY_HARDER, true);
                hints.set(DecodeHintType.ASSUME_CODE_39_CHECK_DIGIT, false);
                hints.set(DecodeHintType.ENABLE_CODE_39_EXTENDED_MODE, true);

                detector.setHints(hints);

                detector.decodeFromConstraints(
                    { video: { facingMode: 'environment' }, audio: false },
                    video,
                    (result, error) => {
                        console.log('Scan callback:', { result, error });
                        const highlightCtx = highlightCanvas.getContext('2d')!;

                        if (result) {
                            setBarcodeValue(result.getText());
                            setReadTime('N/A');

                            // Vẽ khung Highlight
                            const resultPoints = result.getResultPoints();
                            drawHighlightBox(resultPoints.map(pt => ({ x: pt.getX(), y: pt.getY() })), highlightCtx);

                            console.log('Mã vạch phát hiện:', result.getText());
                            lastDetectedRef.current = result.getText();
                        } else if (error) {
                            // console.error('Lỗi khi quét mã vạch:', error);
                        }
                    }
                );

                setApiStatus({
                    text: 'Quét mã QR...',
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
                    className="pointer-events-none absolute inset-0 w-full h-full object-cover"
                ></canvas>

                {/* Canvas ẩn không cần thay đổi, vì nó không hiển thị */}
                <canvas
                    ref={offscreenCanvasRef}
                    className="absolute top-0 left-0" // Thêm 'hidden' để ẩn hoàn toàn
                ></canvas>

                {
                    // mask 
                }
                <div className="hidden absolute top-0 left-0 w-full h-full pointer-events-none">
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
