# ZENITH — AWS Cloud Infrastructure & Terraform Deployment Guide

This directory documents the production-grade **Amazon Web Services (AWS)** architecture planned for deploying the **ZENITH** microservices application using **Terraform (Infrastructure as Code)**.

---

## 1. High-Level AWS Architecture

```
                    Internet Users & Climbers
                               │
                               ▼
               [ Amazon Route 53 (DNS: zenith.com) ]
                               │
                               ▼
               [ Application Load Balancer (ALB) ]
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
/api/products/*          /api/tours/*            /api/orders/*
       │                       │                       │
       ▼                       ▼                       ▼
[ ECS Fargate:           [ ECS Fargate:          [ ECS Fargate:
  Product Service ]       Tour Service ]          Order Service ]
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               ▼
              [ Amazon RDS PostgreSQL (Multi-AZ) ]
                               │
               [ Amazon CloudWatch & Observability ]
```

---

## 2. Core AWS Components

| Component | AWS Resource | Purpose |
| :--- | :--- | :--- |
| **Networking** | `aws_vpc`, `aws_subnet` | Dedicated VPC (`10.0.0.0/16`) spanning 2 Availability Zones with public subnets (ALB, NAT Gateways) and isolated private subnets (ECS tasks, RDS). |
| **Ingress & Routing** | `aws_lb`, `aws_lb_listener` | AWS Application Load Balancer handling SSL termination (ACM) and path-based routing directly mimicking the local Nginx gateway. |
| **Microservice Containers** | `aws_ecs_cluster`, `aws_ecs_task_definition` | Serverless **AWS Fargate** executing container tasks for `frontend`, `product-service`, `tour-service`, and `order-service` with zero EC2 host management. |
| **Image Registries** | `aws_ecr_repository` | Amazon Elastic Container Registry storing immutable, scanned Docker images tagged with Git commit SHAs from Jenkins. |
| **Database** | `aws_db_instance` | Managed Amazon RDS PostgreSQL (engine 15) deployed across multiple AZs with encrypted storage (AWS KMS) and automated snapshots. |
| **Observability** | `aws_cloudwatch_log_group` | Centralized CloudWatch Logs, ECS Container Insights, and metric alarm triggers. |

---

## 3. Terraform Architecture Blueprint (Code Samples)

### A. Virtual Private Cloud (VPC & Subnets)
```hcl
# vpc.tf
resource "aws_vpc" "zenith_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "zenith-production-vpc"
    Environment = "production"
    Project     = "ZENITH"
  }
}

resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.zenith_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private_1a" {
  vpc_id            = aws_vpc.zenith_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"
}
```

### B. Application Load Balancer (Path Routing)
```hcl
# alb.tf
resource "aws_lb" "zenith_alb" {
  name               = "zenith-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_1a.id, aws_subnet.public_1b.id]
}

# Path-based routing rule for Product Service
resource "aws_lb_listener_rule" "product_service_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.product_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/products*", "/api/categories*"]
    }
  }
}
```

### C. Serverless ECS Fargate Task Definition
```hcl
# ecs.tf
resource "aws_ecs_cluster" "zenith_cluster" {
  name = "zenith-microservices-cluster"
}

resource "aws_ecs_task_definition" "product_service" {
  family                   = "zenith-product-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "product-service"
      image     = "${aws_ecr_repository.product_service.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8001
          hostPort      = 8001
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/zenith-product-service"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}
```

---

## 4. How to Transition from Docker Compose to AWS

When ready to provision AWS infrastructure:
1. Initialize Terraform backend with an S3 bucket and DynamoDB state lock table:
   ```bash
   terraform init
   ```
2. Validate and review planned resources:
   ```bash
   terraform plan -out=tfplan
   ```
3. Apply changes with explicit confirmation:
   ```bash
   terraform apply tfplan
   ```
4. Configure Jenkins to build, tag, and push images to ECR, then update the ECS Fargate service:
   ```bash
   aws ecs update-service --cluster zenith-cluster --service product-service --force-new-deployment
   ```
