
data "aws_availability_zones" "available" {}

resource "aws_vpc" "mmo-vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "mmo-vpc"
  }
}

resource "aws_internet_gateway" "mmo-vpc-gateway" {
  vpc_id = aws_vpc.mmo-vpc.id
  tags = {
    Name = "mmo-gateway"
  }
}

resource "aws_route" "igw_route" {
  route_table_id         = aws_vpc.mmo-vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.mmo-vpc-gateway.id
}

resource "aws_subnet" "mmo-subnets" {
  vpc_id            = aws_vpc.mmo-vpc.id
  count             = 2
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(aws_vpc.mmo-vpc.cidr_block, 8, count.index)

  tags = {
    Name = "mmo-subnet-${count.index}"
  }
}

resource "aws_security_group" "mmo-db-sg" {
  name   = "mmo-db-group"
  vpc_id = aws_vpc.mmo-vpc.id
  tags = {
    Name = "mmo db"
  }
}

resource "aws_security_group_rule" "inside_db_access" {
  security_group_id = aws_security_group.mmo-db-sg.id
  protocol          = "tcp"
  from_port         = 3306
  to_port           = 3306
  type              = "ingress"
  cidr_blocks       = [var.vpc_cidr, var.local_cidr]
}