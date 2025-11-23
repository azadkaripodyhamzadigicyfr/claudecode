# -*- coding: utf-8 -*-
from odoo import models, fields, api


class PosSession(models.Model):
    _inherit = 'pos.session'

    mobile_session = fields.Boolean(
        string='Mobile Session',
        compute='_compute_mobile_session',
        store=True,
        help='Session was started from mobile device'
    )

    @api.depends('config_id.mobile_optimized')
    def _compute_mobile_session(self):
        for session in self:
            session.mobile_session = session.config_id.mobile_optimized

    def _pos_ui_models_to_load(self):
        """Add mobile config to POS UI"""
        result = super()._pos_ui_models_to_load()
        return result

    def _loader_params_pos_config(self):
        """Include mobile settings in POS config"""
        result = super()._loader_params_pos_config()
        result['search_params']['fields'].extend([
            'enable_camera_barcode',
            'mobile_optimized',
            'pwa_enabled',
            'tablet_mode',
            'quick_cash_payments',
            'customer_display_mode',
        ])
        return result
