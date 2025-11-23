# Custom Addons Directory

This directory contains custom Odoo modules/addons for your Odoo 19 instance.

## Directory Structure

Each addon should follow this structure:

```
addons/
├── your_module_name/
│   ├── __init__.py
│   ├── __manifest__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── your_model.py
│   ├── views/
│   │   └── your_views.xml
│   ├── controllers/
│   │   ├── __init__.py
│   │   └── your_controller.py
│   ├── security/
│   │   ├── ir.model.access.csv
│   │   └── security.xml
│   ├── data/
│   │   └── data.xml
│   ├── static/
│   │   ├── description/
│   │   │   ├── icon.png
│   │   │   └── index.html
│   │   └── src/
│   │       ├── css/
│   │       ├── js/
│   │       └── xml/
│   └── tests/
│       ├── __init__.py
│       └── test_your_module.py
```

## Creating a New Module

To create a new module, you can use the Odoo scaffold command:

```bash
docker-compose exec odoo odoo scaffold module_name /mnt/extra-addons
```

Or create manually following the structure above.

## Essential Files

### `__manifest__.py`

This file contains metadata about your module:

```python
{
    'name': 'Your Module Name',
    'version': '19.0.1.0.0',
    'category': 'Tools',
    'summary': 'Short description',
    'description': """
        Long description of your module
    """,
    'author': 'Your Name',
    'website': 'https://www.yourwebsite.com',
    'license': 'LGPL-3',
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/your_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'your_module/static/src/css/your_styles.css',
            'your_module/static/src/js/your_script.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
```

### `__init__.py`

Import your Python packages:

```python
from . import models
from . import controllers
```

## Installing Your Module

1. Place your module in this `addons/` directory
2. Restart Odoo: `docker-compose restart odoo`
3. Update the apps list in Odoo:
   - Go to Apps menu
   - Click "Update Apps List"
   - Search for your module
   - Click Install

## Development Tips

- Always restart Odoo after making changes to Python code
- XML/CSV changes can be updated by upgrading the module in Apps menu
- Use `--dev=all` mode for automatic reloading during development
- Check logs in `logs/odoo.log` for debugging

## Example Module

See the `example_module/` directory for a simple example of a custom Odoo module.
