import React, { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  medicines: any[]; // Replace with your Medicine type
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeDetected, medicines }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let barcodeDetector: any;

    const startScanner = async () => {
      try {
        // Check if BarcodeDetector is supported
        if (!('BarcodeDetector' in window)) {
          console.error('BarcodeDetector is not supported in this browser');
          return;
        }

        // Initialize barcode detector
        barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
        });

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Start scanning
        const scanBarcode = async () => {
          if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (!context) return;

            // Set canvas size to match video
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            // Draw video frame to canvas
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            try {
              // Detect barcodes
              const barcodes = await barcodeDetector.detect(canvas);
              
              if (barcodes.length > 0) {
                const barcode = barcodes[0].rawValue;
                onBarcodeDetected(barcode);
              }
            } catch (error) {
              console.error('Barcode detection error:', error);
            }
          }

          animationFrameId = requestAnimationFrame(scanBarcode);
        };

        scanBarcode();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startScanner();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onBarcodeDetected]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-32 object-cover rounded-lg"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 border-4 border-blue-500 rounded-lg" />
      </div>
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-2 py-0.5 rounded text-xs">
        <Camera className="inline-block w-3 h-3 mr-1" />
        Scanning...
      </div>
    </div>
  );
};

export default BarcodeScanner; 