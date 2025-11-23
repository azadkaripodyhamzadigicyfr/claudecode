# -*- coding: utf-8 -*-
from odoo import models, fields, api


class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_camera_barcode = fields.Boolean(
        string='Enable Camera Barcode Scanning',
        default=True,
        help='Allow scanning barcodes using device camera in POS'
    )

    mobile_optimized = fields.Boolean(
        string='Mobile Optimized Interface',
        default=True,
        help='Enable mobile-friendly UI with larger buttons and touch optimization'
    )

    pwa_enabled = fields.Boolean(
        string='Enable PWA (Progressive Web App)',
        default=True,
        help='Allow installing POS as an app on mobile devices'
    )

    tablet_mode = fields.Selection([
        ('portrait', 'Portrait Mode'),
        ('landscape', 'Landscape Mode'),
        ('auto', 'Auto-Detect'),
    ], string='Tablet Orientation', default='auto',
    help='Optimize interface for specific tablet orientation')

    quick_cash_payments = fields.Boolean(
        string='Quick Cash Payments',
        default=True,
        help='Enable quick cash amount buttons for faster checkout'
    )

    customer_display_mode = fields.Selection([
        ('none', 'Disabled'),
        ('separate', 'Separate Browser Tab'),
        ('integrated', 'Integrated Display'),
    ], string='Customer Display', default='none',
    help='Customer-facing display configuration')

    @api.model
    def get_mobile_config(self):
        """Return mobile-specific configuration for current POS"""
        config = self.env['pos.config'].search([('id', '=', self.env.context.get('active_id'))], limit=1)
        return {
            'enable_camera_barcode': config.enable_camera_barcode,
            'mobile_optimized': config.mobile_optimized,
            'pwa_enabled': config.pwa_enabled,
            'tablet_mode': config.tablet_mode,
            'quick_cash_payments': config.quick_cash_payments,
        }
