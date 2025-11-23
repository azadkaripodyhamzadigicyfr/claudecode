# -*- coding: utf-8 -*-
{
    'name': 'Retail POS Mobile Enhancements',
    'version': '19.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Mobile-optimized POS for tablets and smartphones (Community Edition)',
    'description': """
Retail POS Mobile Enhancements
===============================

This module provides mobile and tablet optimizations for Odoo Community POS:

Features:
---------
* **Progressive Web App (PWA)**: Install POS as an app on tablets/phones
* **Mobile-Optimized Interface**: Responsive design for small screens
* **Camera Barcode Scanning**: Scan barcodes using device camera
* **Touch-Friendly Controls**: Large buttons optimized for touch
* **Offline-Ready Assets**: Faster loading on tablets
* **Receipt Customization**: Mobile-friendly receipt formats
* **Retail Workflows**: Common retail scenarios pre-configured

Hardware Support:
----------------
* Web-based barcode scanning via camera
* Bluetooth receipt printers (browser-supported)
* Touch screen optimizations
* Landscape/Portrait mode support

Limitations (Community Edition):
--------------------------------
* No native mobile apps (browser-based only)
* No IoT Box integration (Enterprise only)
* Requires internet connection (no full offline mode)
* Limited hardware integration vs Enterprise

Perfect for:
-----------
* Small retail shops with <5 users
* Pop-up shops and market stalls
* Tablet-based POS systems
* Budget-conscious retailers
* Testing before Enterprise purchase

Legal Notice:
------------
This module uses only Community-licensed features and open-source libraries.
It does NOT replicate Enterprise functionality.
For full mobile POS with native apps, consider Odoo Enterprise.

    """,
    'author': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'license': 'LGPL-3',
    'depends': [
        'point_of_sale',
        'stock',
        'web',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/pos_config_views.xml',
        'views/pwa_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'retail_pos_mobile/static/src/js/pwa_install.js',
            'retail_pos_mobile/static/src/css/pwa.css',
        ],
        'point_of_sale._assets_pos': [
            'retail_pos_mobile/static/src/css/pos_mobile.css',
            'retail_pos_mobile/static/src/js/barcode_camera.js',
            'retail_pos_mobile/static/src/xml/pos_mobile.xml',
        ],
    },
    'images': ['static/description/banner.png'],
    'installable': True,
    'auto_install': False,
    'application': False,
}
