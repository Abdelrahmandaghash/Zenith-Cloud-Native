output "alb_dns_name" {
  description = "Public DNS name of the Application Load Balancer."
  value       = aws_lb.main.dns_name
}

output "app_url" {
  description = "HTTP URL for the application."
  value       = "http://${aws_lb.main.dns_name}"
}

output "ecr_repository_urls" {
  description = "ECR repository URLs for app images."
  value       = { for k, v in aws_ecr_repository.app : k => v.repository_url }
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint."
  value       = aws_db_instance.postgres.address
}

output "db_name" {
  description = "Database name."
  value       = aws_db_instance.postgres.db_name
}
