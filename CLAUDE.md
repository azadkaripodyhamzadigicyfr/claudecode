# CLAUDE.md - AI Assistant Guide for Odoo 19

This document provides comprehensive guidance for AI assistants (like Claude) working with this Odoo 19 codebase. It outlines the project structure, development workflows, conventions, and best practices specific to Odoo development.

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Odoo Conventions](#odoo-conventions)
5. [AI Assistant Guidelines](#ai-assistant-guidelines)
6. [Common Patterns](#common-patterns)
7. [Testing Strategy](#testing-strategy)
8. [Tools and Scripts](#tools-and-scripts)
9. [Troubleshooting](#troubleshooting)

---

## Repository Overview

### Purpose
This repository contains an Odoo 19 development environment with Docker support and custom module development capabilities. It provides a complete setup for building, testing, and deploying custom Odoo applications and modules.

### Tech Stack
- **Language**: Python 3.10+
- **Framework**: Odoo 19.0 (Open Source ERP)
- **Database**: PostgreSQL 15
- **Container Platform**: Docker & Docker Compose
- **Testing**: Odoo Test Framework (unittest-based)
- **ORM**: Odoo ORM
- **Frontend**: QWeb (XML templates), JavaScript, CSS

### Key Dependencies
- **Odoo 19**: Core ERP framework with built-in modules
- **PostgreSQL 15**: Primary relational database
- **Docker**: Containerization for consistent development environment
- **pgAdmin**: Optional database management GUI
- **Python packages**: As defined by Odoo 19 requirements (psycopg2, werkzeug, etc.)

---

## Codebase Structure

### Directory Layout

```
.
├── docker-compose.yml      # Docker services configuration
├── config/                 # Odoo configuration
│   └── odoo.conf          # Main configuration file
├── addons/                # Custom Odoo modules/addons
│   ├── README.md          # Module development guide
│   └── example_module/    # Example custom module
│       ├── __init__.py
│       ├── __manifest__.py
│       ├── models/
│       ├── views/
│       ├── security/
│       └── static/
├── scripts/               # Management scripts
│   ├── start.sh          # Start services
│   ├── stop.sh           # Stop services
│   ├── restart.sh        # Restart Odoo
│   ├── logs.sh           # View logs
│   ├── scaffold.sh       # Create new module
│   ├── backup.sh         # Database backup
│   ├── restore.sh        # Database restore
│   ├── shell.sh          # Python shell
│   └── update-modules.sh # Update modules
├── logs/                  # Application logs
├── .env                   # Local environment config
├── .env.example          # Environment template
└── README.md             # User documentation
```

### Odoo Module Structure

Each custom module follows this standard structure:

```
addons/module_name/
├── __init__.py           # Package initialization
├── __manifest__.py       # Module metadata
├── models/               # Business logic
│   ├── __init__.py
│   └── model_name.py
├── views/                # UI definitions
│   ├── views.xml
│   └── menu.xml
├── security/             # Access control
│   ├── ir.model.access.csv
│   └── security.xml
├── data/                 # Initial/demo data
│   └── data.xml
├── static/               # Frontend assets
│   ├── description/
│   │   ├── icon.png
│   │   └── index.html
│   └── src/
│       ├── css/
│       ├── js/
│       └── xml/
├── controllers/          # HTTP controllers
│   ├── __init__.py
│   └── main.py
├── wizard/              # Transient models
│   ├── __init__.py
│   └── wizard_name.py
└── tests/               # Unit tests
    ├── __init__.py
    └── test_module.py
```

---

## Development Workflow

### Getting Started

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   cp .env.example .env
   ```

2. **Environment Configuration**:
   - Edit `.env` with your settings
   - Configure database credentials
   - Set ports if defaults conflict
   - **Never commit `.env` with real passwords**

3. **Start Odoo**:
   ```bash
   ./scripts/start.sh
   # Wait ~30-60 seconds for initialization
   ```

4. **Access and Initialize**:
   - Open http://localhost:8069
   - Create first database via web UI
   - Install base modules as needed

### Daily Development Cycle

1. **Make Code Changes**: Edit files in `addons/your_module/`

2. **Python Changes**: Restart Odoo
   ```bash
   ./scripts/restart.sh
   ```

3. **XML/CSV Changes**: Upgrade module
   - Go to Apps menu
   - Find module → Click "Upgrade"
   - Or use: `./scripts/update-modules.sh odoo your_module`

4. **Test Changes**: Verify in Odoo UI

5. **Check Logs**: If issues occur
   ```bash
   ./scripts/logs.sh odoo
   ```

### Creating a New Module

```bash
# Using scaffold script
./scripts/scaffold.sh my_custom_module

# Or manually with docker
docker-compose exec odoo odoo scaffold my_module /mnt/extra-addons
```

### Installing/Updating Modules

1. **First Installation**:
   - Restart Odoo
   - Apps → Update Apps List
   - Search module → Install

2. **Updating Existing**:
   - Apps → Find module → Upgrade
   - Or: `./scripts/update-modules.sh odoo module_name`

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: New features (`feature/invoice-customization`)
- **bugfix/***: Bug fixes (`bugfix/partner-validation`)
- **claude/***: AI-assisted development

### Commit Conventions

Follow Conventional Commits:

```
feat(module_name): add custom invoice report
fix(sale): correct discount calculation
docs(readme): update installation steps
refactor(models): simplify partner validation logic
```

---

## Odoo Conventions

### Naming Conventions

**Python**:
- Variables/functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_method_name`
- Computed methods: `_compute_field_name`
- Onchange methods: `_onchange_field_name`

**Models**:
- Model names: `model.name` (dot notation)
  - Good: `sale.order`, `res.partner`, `account.move`
  - Bad: `SaleOrder`, `sale_order`

**XML**:
- View IDs: `view_model_name_type`
  - Example: `view_sale_order_form`, `view_res_partner_tree`
- Action IDs: `action_model_name`
  - Example: `action_sale_order`, `action_res_partner`
- Menu IDs: `menu_model_name`
  - Example: `menu_sale_orders`, `menu_configuration`

**Files**:
- Python files: `snake_case.py`
- XML files: `snake_case.xml`
- Module directories: `snake_case`

### Code Style

**General Principles**:
- Follow PEP 8 for Python code
- Use 4 spaces for indentation
- Maximum line length: 79-100 characters
- Odoo uses 4-space indents for Python and 2-space for XML
- Write clear docstrings for classes and complex methods
- Keep methods focused and under 50 lines when possible

**Model Definition**:
```python
class ExampleModel(models.Model):
    """Brief description of the model."""
    _name = 'example.model'
    _description = 'Example Model'
    _order = 'name'
    _inherit = ['mail.thread', 'mail.activity.mixin']  # If needed

    # Fields (group by type)
    # Basic fields first
    name = fields.Char(string='Name', required=True)
    description = fields.Text('Description')

    # Selection fields
    state = fields.Selection([...], default='draft')

    # Relational fields
    partner_id = fields.Many2one('res.partner', string='Partner')
    line_ids = fields.One2many('example.line', 'example_id', 'Lines')

    # Computed fields
    total = fields.Float(compute='_compute_total', store=True)

    # Compute methods
    @api.depends('line_ids.amount')
    def _compute_total(self):
        for record in self:
            record.total = sum(record.line_ids.mapped('amount'))

    # Constraints
    @api.constrains('amount')
    def _check_amount(self):
        for record in self:
            if record.amount < 0:
                raise ValidationError("Amount must be positive")

    # Business logic methods
    def action_confirm(self):
        self.write({'state': 'confirmed'})
```

### View Conventions

**XML Structure**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Form View -->
    <record id="view_model_form" model="ir.ui.view">
        <field name="name">model.name.form</field>
        <field name="model">model.name</field>
        <field name="arch" type="xml">
            <form string="Title">
                <header>
                    <!-- Buttons and statusbar -->
                </header>
                <sheet>
                    <!-- Form content -->
                </sheet>
                <div class="oe_chatter">
                    <!-- Chatter for tracking -->
                </div>
            </form>
        </field>
    </record>
</odoo>
```

### Security Best Practices

**Access Rights** (`ir.model.access.csv`):
```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_model_user,model.user,model_model,base.group_user,1,1,1,0
access_model_manager,model.manager,model_model,base.group_system,1,1,1,1
```

**Record Rules** (`security.xml`):
```xml
<record id="rule_model_user" model="ir.rule">
    <field name="name">User can only see own records</field>
    <field name="model_id" ref="model_model_name"/>
    <field name="domain_force">[('user_id', '=', user.id)]</field>
    <field name="groups" eval="[(4, ref('base.group_user'))]"/>
</record>
```

---

## AI Assistant Guidelines

### Code Analysis Approach

When working with this Odoo codebase:

1. **Understand Odoo Context**: This is an ERP system with specific patterns
2. **Check Manifest**: Look at `__manifest__.py` for dependencies
3. **Review Models**: Start with model definitions in `models/`
4. **Examine Views**: Check XML views for UI structure
5. **Security Check**: Always verify access rights are defined
6. **Test Data**: Look for demo data to understand use cases

### Making Changes

**Before Modifying**:
- ✅ Read the module's `__manifest__.py` for dependencies
- ✅ Understand the model inheritance chain
- ✅ Check existing views and their inheritance
- ✅ Review security rules
- ✅ Look for similar patterns in other modules

**While Making Changes**:
- ✅ Follow Odoo naming conventions
- ✅ Add security rules for new models
- ✅ Update `__manifest__.py` data files list
- ✅ Keep models simple and focused
- ✅ Use proper field types and attributes
- ✅ Add help text for fields
- ❌ Don't modify Odoo core files
- ❌ Don't skip security definitions
- ❌ Don't create circular dependencies

**After Making Changes**:
- ✅ Restart Odoo for Python changes
- ✅ Upgrade module for XML/CSV changes
- ✅ Test in the UI
- ✅ Check logs for errors
- ✅ Verify security works as expected

### Common Tasks

**Adding a New Model**:
1. Create model file in `models/`
2. Import in `models/__init__.py`
3. Add view definitions in `views/`
4. Create security rules in `security/`
5. Update `__manifest__.py` data list
6. Restart and upgrade module

**Extending Existing Model**:
```python
class ResPartner(models.Model):
    _inherit = 'res.partner'

    custom_field = fields.Char('Custom Field')
```

**Adding Views**:
1. Create XML file in `views/`
2. Define view record with proper ID
3. Add to `__manifest__.py` data list
4. Upgrade module

**Debugging Issues**:
1. Check logs: `./scripts/logs.sh`
2. Use Odoo shell: `./scripts/shell.sh`
3. Enable debug mode in browser: `?debug=1`
4. Check database directly if needed

---

## Common Patterns

### Design Patterns in Odoo

**Model Inheritance**:
- **Classical**: `_inherit = 'model.name'` (extend existing)
- **Prototype**: `_name` + `_inherit` (copy and extend)
- **Delegation**: `_inherits = {'model.name': 'field_name'}`

**Mixins**:
- `mail.thread`: Add chatter/messaging
- `mail.activity.mixin`: Add activity management
- `portal.mixin`: Add portal access
- `rating.mixin`: Add rating system

**State Management**:
```python
state = fields.Selection([
    ('draft', 'Draft'),
    ('confirmed', 'Confirmed'),
    ('done', 'Done'),
    ('cancelled', 'Cancelled')
], default='draft')

def action_confirm(self):
    self.write({'state': 'confirmed'})
```

**Computed Fields**:
```python
@api.depends('line_ids.price_total')
def _compute_amount_total(self):
    for record in self:
        record.amount_total = sum(record.line_ids.mapped('price_total'))
```

**Onchange Methods**:
```python
@api.onchange('partner_id')
def _onchange_partner_id(self):
    if self.partner_id:
        self.email = self.partner_id.email
```

---

## Testing Strategy

### Odoo Testing Framework

Odoo uses Python's unittest framework with additional helpers.

**Test File Structure**:
```python
from odoo.tests.common import TransactionCase

class TestExampleModel(TransactionCase):

    def setUp(self):
        super().setUp()
        self.Model = self.env['example.model']
        self.test_record = self.Model.create({
            'name': 'Test Record'
        })

    def test_create_record(self):
        """Test record creation"""
        record = self.Model.create({'name': 'New Record'})
        self.assertEqual(record.name, 'New Record')

    def test_compute_field(self):
        """Test computed field"""
        self.assertEqual(self.test_record.computed_field, expected_value)
```

**Running Tests**:
```bash
# Run all tests for a module
docker-compose exec odoo odoo -d test_db -i module_name --test-enable --stop-after-init

# Run specific test
docker-compose exec odoo odoo -d test_db -i module_name --test-enable --test-tags=/module_name --stop-after-init
```

---

## Tools and Scripts

### Available Scripts

- **`./scripts/start.sh`**: Start all services
- **`./scripts/stop.sh`**: Stop all services
- **`./scripts/restart.sh`**: Restart Odoo
- **`./scripts/logs.sh [service]`**: View logs
- **`./scripts/scaffold.sh <name>`**: Create new module
- **`./scripts/backup.sh [db]`**: Backup database
- **`./scripts/restore.sh <file> [db]`**: Restore from backup
- **`./scripts/shell.sh [db]`**: Open Odoo Python shell
- **`./scripts/update-modules.sh <db> <modules>`**: Update modules

### Docker Commands

```bash
# View running containers
docker-compose ps

# Access Odoo container shell
docker-compose exec odoo bash

# Access database
docker-compose exec db psql -U odoo -d odoo

# View logs
docker-compose logs -f odoo

# Restart specific service
docker-compose restart odoo
```

---

## Troubleshooting

### Common Issues

**Module doesn't appear**:
- Restart Odoo: `./scripts/restart.sh`
- Update apps list: Apps → Update Apps List
- Check logs for errors

**Database connection error**:
- Check if database is running: `docker-compose ps`
- Verify credentials in `.env`
- Check `config/odoo.conf`

**Permission errors**:
```bash
sudo chown -R $USER:$USER addons/ logs/
chmod +x scripts/*.sh
```

**Import errors**:
- Check `__init__.py` imports
- Verify `__manifest__.py` dependencies
- Restart Odoo after Python changes

**View not updating**:
- Upgrade module (not just restart)
- Clear browser cache
- Check XML syntax

### Debug Mode

Enable in browser: Append `?debug=1` to URL

Features:
- View metadata
- Edit views in UI
- See field technical info
- Access developer menu

---

## Quick Reference for AI Assistants

### ⚡ Quick Checklist

Before making changes:
- [ ] Read `__manifest__.py` for dependencies
- [ ] Understand model relationships
- [ ] Check existing security rules
- [ ] Review similar implementations

When implementing:
- [ ] Follow Odoo naming conventions
- [ ] Add security for new models
- [ ] Update `__manifest__.py` data list
- [ ] Use proper field types
- [ ] Add help text

Before committing:
- [ ] Test in Odoo UI
- [ ] Check logs for errors
- [ ] Verify security works
- [ ] Update documentation

### 🎯 Key Principles

1. **Follow Odoo Patterns**: Use Odoo's built-in features and patterns
2. **Security First**: Always define access rights
3. **Test Thoroughly**: Test in UI and with different users
4. **Document Well**: Add docstrings and field help text
5. **Keep It Simple**: Use Odoo's built-in features before custom code
6. **Inherit, Don't Modify**: Extend models, don't change core
7. **Version Compatibility**: Write code compatible with Odoo 19

---

**Odoo Official Resources**:
- [Odoo 19 Documentation](https://www.odoo.com/documentation/19.0/)
- [Developer Documentation](https://www.odoo.com/documentation/19.0/developer.html)
- [ORM API Reference](https://www.odoo.com/documentation/19.0/developer/reference/backend/orm.html)

---

*This guide is specific to Odoo 19 development. Update as project evolves.*
