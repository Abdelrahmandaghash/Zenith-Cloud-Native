resource "random_password" "db" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/${local.name_prefix}/db/password"
  type  = "SecureString"
  value = random_password.db.result

  tags = { Name = "${local.name_prefix}-db-password" }
}

resource "aws_ssm_parameter" "db_url" {
  name = "/${local.name_prefix}/db/url"
  type = "SecureString"
  # urlencode() is required: the generated password may contain '#', '?' or
  # '%', which would otherwise truncate or corrupt the connection URL.
  value = "postgresql://${urlencode(var.db_username)}:${urlencode(random_password.db.result)}@${aws_db_instance.postgres.address}:5432/${urlencode(var.db_name)}"

  tags = { Name = "${local.name_prefix}-db-url" }
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = { Name = "${local.name_prefix}-db-subnet-group" }
}

resource "aws_db_instance" "postgres" {
  identifier              = "${local.name_prefix}-postgres"
  engine                  = "postgres"
  engine_version          = "15"
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  db_name                 = var.db_name
  username                = var.db_username
  password                = random_password.db.result
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  publicly_accessible     = false
  storage_encrypted       = true
  backup_retention_period = 1
  skip_final_snapshot     = true
  deletion_protection     = false
  multi_az                = false
  apply_immediately       = true

  tags = { Name = "${local.name_prefix}-postgres" }
}
