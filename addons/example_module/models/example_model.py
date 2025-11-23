# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class ExampleModel(models.Model):
    """
    Example model demonstrating basic Odoo model structure.

    This model includes common field types and basic validation.
    """
    _name = 'example.model'
    _description = 'Example Model'
    _order = 'name'

    # Basic fields
    name = fields.Char(
        string='Name',
        required=True,
        help='Name of the example record'
    )

    description = fields.Text(
        string='Description',
        help='Detailed description'
    )

    # Selection field
    state = fields.Selection(
        selection=[
            ('draft', 'Draft'),
            ('confirmed', 'Confirmed'),
            ('done', 'Done'),
            ('cancelled', 'Cancelled'),
        ],
        string='Status',
        default='draft',
        required=True,
        help='Current state of the record'
    )

    # Numeric fields
    priority = fields.Integer(
        string='Priority',
        default=1,
        help='Priority level (1-10)'
    )

    progress = fields.Float(
        string='Progress (%)',
        default=0.0,
        help='Completion percentage'
    )

    # Date fields
    date_created = fields.Date(
        string='Creation Date',
        default=fields.Date.context_today,
        readonly=True
    )

    date_deadline = fields.Datetime(
        string='Deadline',
        help='Deadline for completion'
    )

    # Boolean field
    is_active = fields.Boolean(
        string='Active',
        default=True,
        help='Is this record active?'
    )

    # Relational field (Many2one to res.users)
    user_id = fields.Many2one(
        comodel_name='res.users',
        string='Responsible User',
        default=lambda self: self.env.user,
        help='User responsible for this record'
    )

    # Computed field
    display_name_custom = fields.Char(
        string='Display Name',
        compute='_compute_display_name_custom',
        store=True
    )

    @api.depends('name', 'state')
    def _compute_display_name_custom(self):
        """Compute a custom display name combining name and state."""
        for record in self:
            record.display_name_custom = f"{record.name} [{record.state.upper()}]"

    @api.constrains('priority')
    def _check_priority(self):
        """Validate that priority is between 1 and 10."""
        for record in self:
            if record.priority < 1 or record.priority > 10:
                raise ValidationError("Priority must be between 1 and 10.")

    @api.constrains('progress')
    def _check_progress(self):
        """Validate that progress is between 0 and 100."""
        for record in self:
            if record.progress < 0 or record.progress > 100:
                raise ValidationError("Progress must be between 0 and 100.")

    def action_confirm(self):
        """Set state to confirmed."""
        self.write({'state': 'confirmed'})
        return True

    def action_done(self):
        """Set state to done and progress to 100."""
        self.write({
            'state': 'done',
            'progress': 100.0
        })
        return True

    def action_cancel(self):
        """Set state to cancelled."""
        self.write({'state': 'cancelled'})
        return True

    def action_reset_to_draft(self):
        """Reset state to draft."""
        self.write({'state': 'draft'})
        return True
