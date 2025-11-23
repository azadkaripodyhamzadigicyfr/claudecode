/** @odoo-module **/
/* Camera Barcode Scanner for POS */

import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class BarcodeCameraScanner {
    constructor(posModel) {
        this.pos = posModel;
        this.stream = null;
        this.scanning = false;
    }

    async startScanning() {
        if (this.scanning) {
            return;
        }

        try {
            // Request camera permission
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            this.scanning = true;
            this.showCameraOverlay();
            this.startBarcodeDetection();

        } catch (error) {
            console.error('[Barcode] Camera access denied:', error);
            this.showFallbackInput();
        }
    }

    showCameraOverlay() {
        // Create camera overlay
        const overlay = document.createElement('div');
        overlay.className = 'barcode-camera-container active';
        overlay.innerHTML = `
            <video class="barcode-camera-video" autoplay playsinline></video>
            <div class="barcode-camera-controls">
                <button class="barcode-camera-btn" id="cancel-scan">Cancel</button>
                <button class="barcode-camera-btn" id="manual-entry">Enter Manually</button>
            </div>
            <p style="color: white; margin-top: 10px;">Point camera at barcode</p>
        `;

        document.body.appendChild(overlay);

        // Attach stream to video element
        const video = overlay.querySelector('video');
        video.srcObject = this.stream;

        // Add event listeners
        document.getElementById('cancel-scan').addEventListener('click', () => {
            this.stopScanning();
        });

        document.getElementById('manual-entry').addEventListener('click', () => {
            this.stopScanning();
            this.showManualEntry();
        });
    }

    async startBarcodeDetection() {
        // Check if Barcode Detection API is available
        if ('BarcodeDetector' in window) {
            this.useBarcodeDetectionAPI();
        } else {
            // Fallback: Use ZXing library or manual input
            console.warn('[Barcode] BarcodeDetector API not available, using fallback');
            this.useZXingLibrary();
        }
    }

    async useBarcodeDetectionAPI() {
        try {
            const barcodeDetector = new window.BarcodeDetector({
                formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']
            });

            const video = document.querySelector('.barcode-camera-video');
            const detectBarcodes = async () => {
                if (!this.scanning) return;

                try {
                    const barcodes = await barcodeDetector.detect(video);
                    if (barcodes.length > 0) {
                        const barcode = barcodes[0].rawValue;
                        console.log('[Barcode] Detected:', barcode);
                        this.onBarcodeDetected(barcode);
                        return;
                    }
                } catch (e) {
                    console.error('[Barcode] Detection error:', e);
                }

                requestAnimationFrame(detectBarcodes);
            };

            detectBarcodes();

        } catch (error) {
            console.error('[Barcode] BarcodeDetector error:', error);
            this.showFallbackInput();
        }
    }

    useZXingLibrary() {
        // This would require including ZXing library
        // For now, show manual entry after a timeout
        console.log('[Barcode] ZXing library would be loaded here');

        setTimeout(() => {
            const message = document.createElement('div');
            message.style.cssText = `
                color: white;
                background: rgba(0,0,0,0.8);
                padding: 15px;
                border-radius: 5px;
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
            `;
            message.textContent = 'Barcode scanning not supported on this browser. Use manual entry.';
            document.querySelector('.barcode-camera-container').appendChild(message);
        }, 2000);
    }

    onBarcodeDetected(barcode) {
        console.log('[Barcode] Processing:', barcode);

        // Stop scanning
        this.stopScanning();

        // Send barcode to POS
        if (this.pos && this.pos.barcode_reader) {
            this.pos.barcode_reader.scan(barcode);
        } else {
            // Fallback: trigger barcode event
            this.triggerBarcodeEvent(barcode);
        }

        // Show success feedback
        this.showSuccessFeedback(barcode);
    }

    triggerBarcodeEvent(barcode) {
        // Create and dispatch a custom barcode event
        const event = new CustomEvent('barcode_scanned', {
            detail: { barcode: barcode }
        });
        document.dispatchEvent(event);

        // Also try the traditional way
        if (window.odoo && window.odoo.__DEBUG__) {
            console.log('[Barcode] Would process barcode:', barcode);
        }
    }

    stopScanning() {
        this.scanning = false;

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        const overlay = document.querySelector('.barcode-camera-container');
        if (overlay) {
            overlay.remove();
        }
    }

    showSuccessFeedback(barcode) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 30px;
            border-radius: 10px;
            font-size: 24px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        feedback.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
                <div>Barcode Scanned</div>
                <div style="font-size: 18px; margin-top: 10px; opacity: 0.9;">${barcode}</div>
            </div>
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.transition = 'opacity 0.3s';
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }, 1500);
    }

    showFallbackInput() {
        this.stopScanning();
        this.showManualEntry();
    }

    showManualEntry() {
        const modal = document.createElement('div');
        modal.className = 'barcode-camera-container active';
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px;">
                <h3 style="margin-top: 0; color: #333;">Enter Barcode</h3>
                <input type="text" id="manual-barcode-input"
                       placeholder="Scan or type barcode"
                       style="width: 100%; padding: 15px; font-size: 18px; border: 2px solid #714B67; border-radius: 5px; margin-bottom: 15px;"
                       autofocus>
                <div style="display: flex; gap: 10px;">
                    <button class="barcode-camera-btn" id="submit-manual-barcode" style="flex: 1;">Submit</button>
                    <button class="barcode-camera-btn" id="cancel-manual-barcode" style="flex: 1; background: #6c757d;">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const input = document.getElementById('manual-barcode-input');
        const submit = document.getElementById('submit-manual-barcode');
        const cancel = document.getElementById('cancel-manual-barcode');

        const submitBarcode = () => {
            const barcode = input.value.trim();
            if (barcode) {
                this.onBarcodeDetected(barcode);
                modal.remove();
            }
        };

        submit.addEventListener('click', submitBarcode);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBarcode();
            }
        });

        cancel.addEventListener('click', () => {
            modal.remove();
        });
    }

    static isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
}

// Initialize barcode scanner button in POS
document.addEventListener('DOMContentLoaded', () => {
    // Add camera scan button to POS interface
    const addCameraScanButton = () => {
        const searchBox = document.querySelector('.searchbox');
        if (searchBox && !document.querySelector('.camera-scan-btn')) {
            const button = document.createElement('button');
            button.className = 'camera-scan-btn';
            button.innerHTML = '📷 Scan';
            button.style.cssText = `
                margin-left: 10px;
                padding: 8px 16px;
                background: #714B67;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            `;

            button.addEventListener('click', () => {
                const scanner = new BarcodeCameraScanner();
                scanner.startScanning();
            });

            searchBox.parentElement.appendChild(button);
        }
    };

    // Try to add button when POS loads
    setTimeout(addCameraScanButton, 2000);
    setTimeout(addCameraScanButton, 5000);
});

console.log('[Barcode] Camera scanner module loaded');
console.log('[Barcode] Camera supported:', BarcodeCameraScanner.isSupported());
