# ZENITH Terraform (AWS Deployment)

This folder contains a **minimal AWS deployment** for ZENITH using:

- **ECR** for container images
- **ECS Fargate** for app services
- **ALB (HTTP :80, no ACM)** for routing
- **RDS PostgreSQL** for database
- **CloudWatch Logs** for basic container logging
- **SSM Parameter Store** for DB password / `DATABASE_URL`

> Prometheus/Grafana are **not** deployed to AWS in this setup. Keep using them locally with Docker Compose.

## What gets created

- VPC, 2 public subnets, 2 private subnets, Internet Gateway, route tables
- Security groups (ALB, ECS tasks, RDS)
- ECR repositories: `frontend`, `product`, `tour`, `order`
- ECS cluster + 4 Fargate services/task definitions
- ALB with path-based routing:
  - `/api/products*`, `/api/categories*` -> product-service
  - `/api/tours*` -> tour-service
  - `/api/orders*` -> order-service
  - `/*` -> frontend
- RDS PostgreSQL (private subnets, not publicly accessible)
- SSM SecureString parameters for DB password and DB URL
- CloudWatch log groups (`/ecs/<project>-<env>-<service>`)

## Cost-conscious choices

- **No NAT Gateway**: ECS tasks run in **public subnets** with `assign_public_ip=true` so they can pull images from ECR without NAT. Security groups still restrict inbound app traffic to the ALB.
- **No ACM/HTTPS**: ALB listens on HTTP :80 only. Good for learning; add ACM+HTTPS for real deployments.
- **No self-hosted Prometheus/Grafana on AWS**: avoids extra storage/service-discovery complexity.
- **RDS small/single-AZ**: `db.t3.micro` by default; tune for your account/free-tier eligibility.

## Prerequisites

- AWS account + credentials configured (`aws configure` or env vars)
- Terraform >= 1.6
- Docker installed (to build/push images)
- AWS CLI installed

## Deploy

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Review variables

Copy the example and adjust as needed:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Set `allowed_http_cidr` to your IP/32 if you want tighter access.

### 3. Plan and apply

```bash
terraform plan -out=tfplan
terraform apply tfplan
```

### 4. Build and push images to ECR

After apply, get ECR URLs:

```bash
terraform output ecr_repository_urls
```

Login to ECR (replace region/account as needed):

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

Build and push each image (run from repo root):

```bash
# Example for one service - repeat for all 4
docker build -t <ecr-repo-url>:latest ./services/product-service
docker push <ecr-repo-url>:latest
```

Services to push:
- `frontend` -> build from `./frontend`
- `product` -> build from `./services/product-service`
- `tour` -> build from `./services/tour-service`
- `order` -> build from `./services/order-service`

### 5. Force new ECS deployment (if tasks started before images were pushed)

```bash
aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment
```

### 6. Open the app

```bash
terraform output app_url
```

## Important notes

- **`order-service` is currently in-memory**. Terraform provisions RDS and injects `DATABASE_URL` into the order service, but the application code does not persist orders to Postgres yet. Add DB persistence before relying on RDS.
- **HTTP only**: no TLS. Do not use for sensitive real traffic.
- **ECS tasks in public subnets**: this is a cost tradeoff to avoid NAT Gateway. For stricter production networking, move tasks to private subnets and add NAT Gateway or VPC endpoints.
- **Secrets**: DB password is generated randomly and stored in SSM SecureString; do not hardcode it.
- **Destroy when done** to avoid charges:

```bash
terraform destroy
```

## Files

- `versions.tf` - Terraform/provider versions
- `variables.tf` - input variables
- `locals.tf` - naming/local values
- `vpc.tf` - VPC/subnets/routes
- `security.tf` - security groups
- `ecr.tf` - ECR repositories
- `iam.tf` - ECS IAM roles/policies
- `cloudwatch.tf` - log groups
- `rds.tf` - RDS + SSM DB parameters
- `alb.tf` - ALB/listener/rules/target groups
- `ecs.tf` - ECS cluster/task defs/services
- `outputs.tf` - useful outputs
