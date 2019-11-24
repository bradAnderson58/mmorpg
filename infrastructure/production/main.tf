
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