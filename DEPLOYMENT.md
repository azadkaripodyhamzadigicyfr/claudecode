# Odoo 19 Deployment Guide

This guide covers different options for running Odoo 19 in Docker through GitHub.

## Table of Contents

1. [GitHub Codespaces (Development)](#github-codespaces)
2. [GitHub Actions (CI/CD)](#github-actions)
3. [Cloud Deployment Options](#cloud-deployment)
4. [Docker Image Registry](#docker-image-registry)

---

## GitHub Codespaces

**Best for:** Development and testing in the cloud

### Quick Start

1. **Open in Codespaces:**
   - Go to your GitHub repository
   - Click the green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on main"

2. **Wait for setup:**
   - Docker containers will start automatically
   - Odoo will be available on port 8069
   - PostgreSQL will be on port 5432

3. **Access Odoo:**
   - Click on the "Ports" tab in VS Code
   - Find port 8069 and click the globe icon
   - Or use the forwarded URL shown in the terminal

4. **Initialize Database:**
   - Access the Odoo web interface
   - Create your first database
   - Set master password and database name

### Codespaces Configuration

The `.devcontainer/devcontainer.json` file configures:
- Docker Compose integration
- VS Code extensions for Python and XML
- Port forwarding (8069, 8072, 5432)
- Development tools (Git, GitHub CLI, Python)

### Working in Codespaces

```bash
# Check running containers
docker compose ps

# View Odoo logs
docker compose logs -f odoo

# Restart Odoo
docker compose restart odoo

# Stop all services
docker compose down

# Create a new module
docker compose exec odoo odoo scaffold my_module /mnt/extra-addons
```

---

## GitHub Actions

**Best for:** Automated testing and building Docker images

### Workflows Included

#### 1. `docker-build.yml`

Automatically runs on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`
- Manual trigger via workflow_dispatch

**What it does:**
- ✅ Builds and tests Odoo with Docker Compose
- ✅ Runs health checks
- ✅ Builds custom Docker image with your addons
- ✅ Pushes to GitHub Container Registry (ghcr.io)

### Using GitHub Actions

**View workflow runs:**
1. Go to the "Actions" tab in your repository
2. Select the workflow run to see logs
3. Check the summary for build information

**Trigger manually:**
1. Go to "Actions" tab
2. Select "Docker Build and Test"
3. Click "Run workflow"
4. Choose branch and click "Run workflow"

**Pull built images:**
```bash
# Pull the latest image
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO/odoo:latest

# Run the custom image
docker run -d \
  -e HOST=your-db-host \
  -e USER=odoo \
  -e PASSWORD=odoo \
  -p 8069:8069 \
  ghcr.io/YOUR_USERNAME/YOUR_REPO/odoo:latest
```

---

## Cloud Deployment

### Option 1: DigitalOcean App Platform

**Cost:** ~$12/month (basic setup)

1. **Prepare repository:**
   - Ensure `docker-compose.yml` is in the root
   - Push to GitHub

2. **Create App:**
   - Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect GitHub repository
   - Select repository and branch

3. **Configure:**
   - Detect `docker-compose.yml` automatically
   - Add managed PostgreSQL database
   - Set environment variables

4. **Deploy:**
   - Review and create
   - Get deployment URL

**Environment Variables:**
```
POSTGRES_DB=odoo
POSTGRES_USER=odoo
POSTGRES_PASSWORD=${db.PASSWORD}
DB_HOST=${db.HOSTNAME}
DB_PORT=${db.PORT}
ODOO_ADMIN_PASSWORD=your-secure-password
```

### Option 2: Render

**Cost:** Free tier available

1. **Create Blueprint:**
   ```yaml
   # render.yaml
   services:
     - type: web
       name: odoo
       env: docker
       dockerfilePath: ./Dockerfile
       envVars:
         - key: HOST
           fromDatabase:
             name: odoo-db
             property: host
         - key: USER
           fromDatabase:
             name: odoo-db
             property: user
         - key: PASSWORD
           fromDatabase:
             name: odoo-db
             property: password
       disk:
         name: odoo-data
         mountPath: /var/lib/odoo
         sizeGB: 10

   databases:
     - name: odoo-db
       databaseName: odoo
       user: odoo
   ```

2. **Deploy:**
   - Connect GitHub repository
   - Render auto-detects configuration
   - Deploy with one click

### Option 3: Railway

**Cost:** $5/month credit free tier

1. **Deploy from GitHub:**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add PostgreSQL:**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway auto-connects environment variables

3. **Configure Odoo:**
   - Environment variables are auto-configured
   - Add custom domain if needed

### Option 4: AWS ECS (Advanced)

**Cost:** Variable (~$30+/month)

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: odoo19
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster odoo-cluster \
            --service odoo-service \
            --force-new-deployment
```

**Setup Requirements:**
- Create ECS cluster
- Create RDS PostgreSQL database
- Configure task definitions
- Set up Application Load Balancer
- Configure GitHub secrets

---

## Docker Image Registry

### GitHub Container Registry (ghcr.io)

Your images are automatically published to:
```
ghcr.io/YOUR_USERNAME/YOUR_REPO/odoo:latest
```

**Making images public:**
1. Go to repository → Packages
2. Click on the package
3. Package settings → Change visibility → Public

**Using the image:**
```bash
# Pull the image
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO/odoo:latest

# Run with docker-compose using the custom image
# Update docker-compose.yml:
services:
  odoo:
    image: ghcr.io/YOUR_USERNAME/YOUR_REPO/odoo:latest
    # ... rest of configuration
```

### Docker Hub (Alternative)

Add to `.github/workflows/docker-build.yml`:

```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build and push to Docker Hub
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: |
      YOUR_USERNAME/odoo19:latest
      YOUR_USERNAME/odoo19:${{ github.sha }}
```

---

## Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Configure GitHub Actions (automatic)
- [ ] Choose deployment platform
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Access Odoo web interface
- [ ] Initialize first database
- [ ] Install your custom modules
- [ ] Configure backups

---

## Security Best Practices

1. **Change default passwords:**
   - Set strong `ODOO_ADMIN_PASSWORD`
   - Use secure database passwords
   - Rotate secrets regularly

2. **Use environment variables:**
   - Never commit `.env` files
   - Use platform secret management
   - Different passwords per environment

3. **Enable HTTPS:**
   - Use platform SSL/TLS features
   - Configure reverse proxy if needed
   - Redirect HTTP to HTTPS

4. **Database security:**
   - Use managed databases when possible
   - Enable connection encryption
   - Regular backups
   - Restrict network access

5. **Monitoring:**
   - Set up log aggregation
   - Configure health checks
   - Monitor resource usage
   - Set up alerts

---

## Troubleshooting

### Codespaces Issues

**Problem:** Ports not forwarding
- **Solution:** Check Ports tab, ensure visibility is "Public"

**Problem:** Containers not starting
- **Solution:**
  ```bash
  docker compose down -v
  docker compose up -d
  ```

### GitHub Actions Failures

**Problem:** Build timeout
- **Solution:** Increase workflow timeout in yml file

**Problem:** Permission denied on registry
- **Solution:** Check repository → Settings → Actions → General → Workflow permissions

### Deployment Issues

**Problem:** Can't connect to database
- **Solution:** Check environment variables match database credentials

**Problem:** Application crashes
- **Solution:** Check logs and ensure sufficient memory (minimum 2GB recommended)

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| GitHub Codespaces | 120 hours/month | $0.18/hour | Development |
| Render | 750 hours/month | $7/month+ | Small projects |
| Railway | $5 credit/month | $0.02/hour | Startups |
| DigitalOcean | - | $12/month+ | Production |
| AWS ECS | 12 months free | $30+/month | Enterprise |

---

## Next Steps

1. **Choose your deployment method:**
   - Development → GitHub Codespaces
   - Testing → GitHub Actions
   - Production → Cloud platform

2. **Set up monitoring:**
   - Application logs
   - Database performance
   - Resource usage

3. **Configure backups:**
   - Automated database backups
   - File storage backups
   - Disaster recovery plan

4. **Scale as needed:**
   - Horizontal scaling (multiple instances)
   - Vertical scaling (more resources)
   - Load balancing

---

**Need help?** Check the [README.md](./README.md) or [CLAUDE.md](./CLAUDE.md) for more information.
