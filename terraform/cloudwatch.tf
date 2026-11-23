resource "aws_cloudwatch_log_group" "app" {
  for_each          = local.services
  name              = "/ecs/${local.name_prefix}-${each.key}"
  retention_in_days = 7

  tags = { Name = "${local.name_prefix}-${each.key}-logs" }
}
