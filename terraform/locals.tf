data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  azs         = slice(data.aws_availability_zones.available.names, 0, 2)

  services = {
    frontend = {
      port          = var.container_port_frontend
      cpu           = 256
      memory        = 512
      health_path   = "/health"
      path_patterns = ["/*"]
      priority      = 400
      env = [
        { name = "NODE_ENV", value = "production" }
      ]
    }
    product = {
      port          = var.container_port_product
      cpu           = 256
      memory        = 512
      health_path   = "/health"
      path_patterns = ["/api/products*", "/api/categories*"]
      priority      = 100
      env = [
        { name = "PORT", value = tostring(var.container_port_product) },
        { name = "SERVICE_NAME", value = "product-service" }
      ]
    }
    tour = {
      port          = var.container_port_tour
      cpu           = 256
      memory        = 512
      health_path   = "/health"
      path_patterns = ["/api/tours*"]
      priority      = 200
      env = [
        { name = "PORT", value = tostring(var.container_port_tour) },
        { name = "SERVICE_NAME", value = "tour-service" }
      ]
    }
    order = {
      port          = var.container_port_order
      cpu           = 256
      memory        = 512
      health_path   = "/health"
      path_patterns = ["/api/orders*"]
      priority      = 300
      env = [
        { name = "PORT", value = tostring(var.container_port_order) },
        { name = "SERVICE_NAME", value = "order-service" }
      ]
    }
  }
}
