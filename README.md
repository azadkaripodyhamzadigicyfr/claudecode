# Odoo 19 Development Environment

A complete Docker-based development environment for Odoo 19 with custom addons support.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [GitHub Deployment](#github-deployment)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Custom Modules](#custom-modules)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## 🎯 Overview

This project provides a ready-to-use Odoo 19 development environment with:

- **Docker Compose** setup for easy deployment
- **PostgreSQL 15** database
- **Custom addons** directory structure
- **pgAdmin** for database management (optional)
- **Example module** to get started quickly
- **Volume persistence** for data and addons
- **Development-friendly** configuration

## 📦 Prerequisites

Before you begin, ensure you have installed:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)
- At least 4GB of free RAM
- At least 10GB of free disk space

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Copy environment file
cp .env.example .env

# (Optional) Edit .env file with your preferred settings
nano .env
```

### 2. Start Odoo

```bash
# Start all services
docker-compose up -d

# Or use the startup script
./scripts/start.sh
```

## ☁️ GitHub Deployment

**Run Odoo in the cloud without local Docker installation!**

### Option 1: GitHub Codespaces (Recommended for Development)

1. Click the **Code** button on GitHub
2. Select **Codespaces** tab
3. Click **Create codespace on main**
4. Wait for environment to start (~2 minutes)
5. Access Odoo at the forwarded port 8069

✅ No local setup required
✅ Pre-configured development environment
✅ VS Code in the browser
✅ Free tier: 120 hours/month

### Option 2: Deploy to Cloud Platform

Choose your platform:

| Platform | Setup Time | Cost | Best For |
|----------|------------|------|----------|
| [Render](https://render.com) | 5 min | Free tier available | Quick deployments |
| [Railway](https://railway.app) | 5 min | $5 credit/month | Startups |
| [DigitalOcean](https://www.digitalocean.com) | 10 min | ~$12/month | Production |

**Quick Deploy to Render:**
1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render auto-detects `render.yaml`
6. Click "Apply" and wait for deployment

### Option 3: Automated Builds with GitHub Actions

Every push to `main` or `develop` automatically:
- ✅ Builds and tests Odoo
- ✅ Creates Docker image
- ✅ Pushes to GitHub Container Registry

**Use the built image:**
```bash
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO/odoo:latest
```

📚 **Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

---

### 3. Access Odoo

- **Odoo Web Interface**: http://localhost:8069
- **pgAdmin** (optional): http://localhost:5050

### 4. Initial Setup

1. Open http://localhost:8069 in your browser
2. Create your first database:
   - **Database Name**: `odoo` (or your preferred name)
   - **Email**: Your admin email
   - **Password**: Your admin password
   - **Language**: Select your language
   - **Country**: Select your country

3. Click "Create Database"

## 📁 Project Structure

```
.
├── docker-compose.yml          # Docker Compose configuration
├── config/
│   └── odoo.conf              # Odoo configuration file
├── addons/                    # Custom Odoo modules
│   ├── README.md              # Addons documentation
│   └── example_module/        # Example custom module
├── logs/                      # Odoo log files
├── scripts/                   # Utility scripts
│   ├── start.sh              # Start Odoo
│   ├── stop.sh               # Stop Odoo
│   ├── restart.sh            # Restart Odoo
│   ├── logs.sh               # View logs
│   └── scaffold.sh           # Create new module
├── .env                       # Environment variables (local)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── CLAUDE.md                 # AI assistant guide
└── README.md                 # This file
```

## ⚙️ Configuration

### Environment Variables

Edit `.env` file to customize your installation:

```env
# Database
POSTGRES_DB=odoo
POSTGRES_USER=odoo
POSTGRES_PASSWORD=odoo

# Ports
ODOO_PORT=8069
ODOO_CHAT_PORT=8072
PGADMIN_PORT=5050

# Admin Password
ODOO_ADMIN_PASSWORD=admin  # Change this!
```

### Odoo Configuration

Edit `config/odoo.conf` for advanced settings:

- Database connection
- Server workers
- Memory limits
- Logging levels
- Email configuration
- And more...

## 💻 Development Workflow

### Starting and Stopping

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart Odoo (after code changes)
docker-compose restart odoo

# View logs
docker-compose logs -f odoo
```

### Updating Module Code

When you make changes to Python code:

```bash
# Restart Odoo
docker-compose restart odoo
```

When you make changes to XML/CSV files:

1. Go to Odoo Apps menu
2. Find your module
3. Click "Upgrade"

### Development Mode

Enable development mode for automatic reloading:

1. Edit `config/odoo.conf`
2. Add: `dev_mode = reload,qweb,werkzeug,xml`
3. Restart Odoo

Or append to URL: `?debug=1` or `?debug=assets`

## 🧩 Custom Modules

### Creating a New Module

Use the scaffold script:

```bash
./scripts/scaffold.sh my_custom_module
```

Or use docker directly:

```bash
docker-compose exec odoo odoo scaffold my_module /mnt/extra-addons
```

### Module Structure

```
addons/my_module/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   └── my_model.py
├── views/
│   └── my_views.xml
├── security/
│   └── ir.model.access.csv
└── static/
    └── description/
        └── icon.png
```

### Installing a Module

1. Restart Odoo: `docker-compose restart odoo`
2. Update Apps list: Settings → Apps → Update Apps List
3. Search for your module
4. Click "Install"

### Example Module

The included `example_module` demonstrates:

- Model creation with various field types
- Tree, Form, Kanban, and Search views
- State management and workflows
- Security and access rights
- Computed fields and constraints
- Business logic methods

To install:

1. Go to Apps
2. Remove "Apps" filter
3. Search "Example Module"
4. Click Install

## 🗄️ Database Management

### Using psql

```bash
# Access PostgreSQL
docker-compose exec db psql -U odoo -d odoo

# Backup database
docker-compose exec db pg_dump -U odoo odoo > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U odoo -d odoo
```

### Using pgAdmin

1. Start with dev profile: `docker-compose --profile dev up -d`
2. Access pgAdmin at http://localhost:5050
3. Login with credentials from `.env`
4. Add new server:
   - **Host**: `db`
   - **Port**: `5432`
   - **Username**: Value from `POSTGRES_USER`
   - **Password**: Value from `POSTGRES_PASSWORD`

### Database Operations

```bash
# List all databases
docker-compose exec odoo odoo shell -d postgres

# Drop a database (careful!)
docker-compose exec db dropdb -U odoo database_name

# Create a database
docker-compose exec db createdb -U odoo database_name
```

## 🔧 Troubleshooting

### Common Issues

**Odoo won't start:**

```bash
# Check logs
docker-compose logs odoo

# Check if database is ready
docker-compose exec db pg_isready -U odoo

# Restart all services
docker-compose down && docker-compose up -d
```

**Port already in use:**

```bash
# Check what's using port 8069
lsof -i :8069

# Or change port in .env
ODOO_PORT=8070
```

**Module not showing up:**

```bash
# Restart Odoo
docker-compose restart odoo

# Update apps list
# Go to Apps → Update Apps List
```

**Permission denied errors:**

```bash
# Fix permissions
sudo chown -R $USER:$USER addons/ logs/
```

**Database connection failed:**

```bash
# Wait for database to be ready
docker-compose logs db

# Check database health
docker-compose exec db pg_isready -U odoo
```

### Resetting Everything

```bash
# Stop and remove containers, volumes
docker-compose down -v

# Remove local files (careful!)
rm -rf logs/*

# Start fresh
docker-compose up -d
```

### Viewing Logs

```bash
# Follow Odoo logs
docker-compose logs -f odoo

# Follow database logs
docker-compose logs -f db

# View log file
tail -f logs/odoo.log
```

## 🚀 Production Deployment

For production use:

1. **Change default passwords** in `.env`
2. **Generate secure admin password**:
   ```bash
   python3 -c "from passlib.context import CryptContext; print(CryptContext(['pbkdf2_sha512']).hash('your_password'))"
   ```
3. **Update `config/odoo.conf`**:
   - Set appropriate workers: `workers = 5`
   - Configure memory limits
   - Set `list_db = False`
   - Enable proxy mode: `proxy_mode = True`

4. **Use a reverse proxy** (nginx/traefik):
   ```nginx
   server {
       listen 80;
       server_name odoo.example.com;

       location / {
           proxy_pass http://localhost:8069;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Enable SSL** with Let's Encrypt

6. **Set up regular backups**:
   ```bash
   # Add to crontab
   0 2 * * * docker-compose exec db pg_dump -U odoo odoo > /backups/odoo_$(date +\%Y\%m\%d).sql
   ```

7. **Monitor resources** and adjust worker configuration

## 📚 Additional Resources

- [Odoo Official Documentation](https://www.odoo.com/documentation/19.0/)
- [Odoo Developer Documentation](https://www.odoo.com/documentation/19.0/developer.html)
- [Odoo Community Hub](https://www.odoo.com/forum/help-1)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

See [CLAUDE.md](./CLAUDE.md) for development guidelines and best practices.

## 📝 License

This project structure is provided as-is for Odoo development. Odoo itself is licensed under LGPL-3.

## 💡 Tips

- Use `docker-compose logs -f` to debug issues
- Keep your custom modules in `addons/` directory
- Regular backups are essential
- Test modules in development before production
- Use version control for your custom modules
- Document your module dependencies in `__manifest__.py`

---

**Happy Odoo Development! 🎉**

For questions or issues, check the troubleshooting section or consult the Odoo documentation.
