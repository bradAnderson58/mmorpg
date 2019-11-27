
terraform {
  backend "s3" {
    bucket  = "mmorpg.terraform"
    key     = "production/terraform.tfstate"
    region  = "us-west-1"
    encrypt = true
  }
}

provider "aws" {
  region = "us-west-1"
}

resource "aws_s3_bucket" "website" {
  bucket = "mmorpg.website"
  acl = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"

    routing_rules = <<EOF
[{
  "Condition": {
    "KeyPrefixEquals": "docs/"
  },
  "Redirect": {
    "ReplaceKeyPrefixWith": "documents/"
  }
}]
EOF
  }
}

resource "aws_db_subnet_group" "db-group" {
  name       = "mmo-db-subnets"
  subnet_ids = aws_subnet.mmo-subnets.*.id
}

resource "aws_db_instance" "mmo_db" {
  identifier        = "mmo-db"
  engine            = "mysql"
  engine_version    = "8.0.16"
  instance_class    = "db.t2.micro"
  allocated_storage = 20
  username          = "db_user"
  password          = var.mmo_db_password

  publicly_accessible = true
  apply_immediately   = true
  skip_final_snapshot = true

  db_subnet_group_name   = aws_db_subnet_group.db-group.name
  vpc_security_group_ids = [aws_security_group.mmo-db-sg.id]

  tags = {
    Name = "mmo-db"
  }
}
