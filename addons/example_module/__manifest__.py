# -*- coding: utf-8 -*-
{
    'name': 'Example Module',
    'version': '19.0.1.0.0',
    'category': 'Tools',
    'summary': 'A simple example module for Odoo 19',
    'description': """
        Example Module for Odoo 19
        ===========================

        This is a simple example module that demonstrates:
        * Creating a custom model
        * Adding views (form, tree, search)
        * Setting up security and access rights
        * Basic CRUD operations

        This module serves as a template for creating your own custom modules.
    """,
    'author': 'Your Name',
    'website': 'https://www.example.com',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'web',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/example_views.xml',
        'views/menu_views.xml',
    ],
    'demo': [],
    'installable': True,
    'application': True,
    'auto_install': False,
}
