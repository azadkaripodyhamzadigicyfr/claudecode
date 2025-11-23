/** @odoo-module **/
/* PWA Installation Handler */

(function() {
    'use strict';

    let deferredPrompt;
    const installPromptShown = localStorage.getItem('pwa_prompt_shown');

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] Install prompt available');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;

        // Don't show prompt if user previously dismissed it
        if (!installPromptShown) {
            showInstallPromotion();
        }
    });

    // Handle PWA installation
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App was installed');
        hideInstallPromotion();
        deferredPrompt = null;

        // Show success message
        showNotification('POS installed successfully! You can now launch it from your home screen.', 'success');
    });

    // Check if running as PWA
    function isRunningStandalone() {
        return (window.matchMedia('(display-mode: standalone)').matches) ||
               (window.navigator.standalone) ||
               document.referrer.includes('android-app://');
    }

    // Show install promotion banner
    function showInstallPromotion() {
        if (isRunningStandalone()) {
            return; // Already installed
        }

        // Create promotion banner
        const banner = document.createElement('div');
        banner.className = 'pwa-install-prompt show';
        banner.innerHTML = `
            <div>
                <strong>📱 Install Odoo POS</strong>
                <p style="margin: 5px 0;">Add to your home screen for a better experience!</p>
                <button class="pwa-install-btn primary" id="pwa-install-yes">Install</button>
                <button class="pwa-install-btn secondary" id="pwa-install-no">Maybe Later</button>
            </div>
        `;

        document.body.appendChild(banner);

        // Handle install button
        document.getElementById('pwa-install-yes').addEventListener('click', async () => {
            if (!deferredPrompt) {
                // Fallback for browsers that don't support install prompt
                showManualInstallInstructions();
                return;
            }

            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[PWA] User response: ${outcome}`);

            if (outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }

            hideInstallPromotion();
            deferredPrompt = null;
        });

        // Handle dismiss button
        document.getElementById('pwa-install-no').addEventListener('click', () => {
            hideInstallPromotion();
            localStorage.setItem('pwa_prompt_shown', 'true');
            // Reset after 7 days
            setTimeout(() => {
                localStorage.removeItem('pwa_prompt_shown');
            }, 7 * 24 * 60 * 60 * 1000);
        });
    }

    function hideInstallPromotion() {
        const banner = document.querySelector('.pwa-install-prompt');
        if (banner) {
            banner.remove();
        }
    }

    function showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let instructions = '';

        if (isIOS) {
            instructions = `
                <h3>Install on iOS:</h3>
                <ol style="text-align: left;">
                    <li>Tap the Share button <span style="font-size: 24px;">⎋</span></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right corner</li>
                </ol>
            `;
        } else if (isAndroid) {
            instructions = `
                <h3>Install on Android:</h3>
                <ol style="text-align: left;">
                    <li>Tap the menu button (⋮) in your browser</li>
                    <li>Tap "Add to Home screen" or "Install app"</li>
                    <li>Follow the on-screen instructions</li>
                </ol>
            `;
        } else {
            instructions = `
                <h3>Install on Desktop:</h3>
                <ol style="text-align: left;">
                    <li>Click the install icon in your browser's address bar</li>
                    <li>Or use browser menu → "Install Odoo POS"</li>
                </ol>
            `;
        }

        const modal = document.createElement('div');
        modal.className = 'pwa-install-prompt show';
        modal.innerHTML = `
            <div style="background: white; color: #333; padding: 20px; border-radius: 8px; max-width: 400px;">
                ${instructions}
                <button class="pwa-install-btn primary" style="width: 100%; margin-top: 15px;" onclick="this.closest('.pwa-install-prompt').remove()">
                    Got it!
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#714B67'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Note: Service worker would need to be created separately
            // navigator.serviceWorker.register('/retail_pos_mobile/static/src/js/service-worker.js')
            //     .then((registration) => {
            //         console.log('[PWA] Service Worker registered:', registration);
            //     })
            //     .catch((error) => {
            //         console.log('[PWA] Service Worker registration failed:', error);
            //     });
        });
    }

    // Detect online/offline status
    window.addEventListener('online', () => {
        showNotification('Connection restored', 'success');
        document.querySelector('.offline-indicator')?.classList.remove('show');
    });

    window.addEventListener('offline', () => {
        showNotification('No internet connection', 'warning');
        const indicator = document.querySelector('.offline-indicator');
        if (indicator) {
            indicator.classList.add('show');
        }
    });

    // Log PWA status on load
    console.log('[PWA] Running as standalone:', isRunningStandalone());
    console.log('[PWA] Service Worker supported:', 'serviceWorker' in navigator);
    console.log('[PWA] Online status:', navigator.onLine);

})();
