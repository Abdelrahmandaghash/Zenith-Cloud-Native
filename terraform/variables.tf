variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming."
  type        = string
  default     = "zenith"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs (2 AZs for ALB)."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs (2 AZs for RDS)."
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "container_port_frontend" {
  type    = number
  default = 8080
}

variable "container_port_product" {
  type    = number
  default = 8001
}

variable "container_port_tour" {
  type    = number
  default = 8002
}

variable "container_port_order" {
  type    = number
  default = 8003
}

variable "app_image_tag" {
  description = "Image tag to deploy for app services."
  type        = string
  default     = "latest"
}

variable "desired_count" {
  description = "Desired task count per ECS service."
  type        = number
  default     = 1
}

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "zenith_db"
}

variable "db_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "zenith"
}

variable "db_instance_class" {
  description = "RDS instance class. db.t3.micro/db.t4g.micro are common free-tier eligible options depending on account/region."
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB."
  type        = number
  default     = 20
}

variable "allowed_http_cidr" {
  description = "CIDR allowed to access ALB HTTP. Use your IP/32 for tighter access."
  type        = string
  default     = "0.0.0.0/0"
}
