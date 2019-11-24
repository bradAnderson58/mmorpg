
terraform {
  backend "s3" {
    bucket  = "mmorpg.terraform"
    key     = "global/iam/terraform.tfstate"
    region  = "us-west-1"
    encrypt = true
  }
}

provider "aws" {
  region = "us-west-1"
}

module "mfa_group" {
  source = "git::https://github.com/bradAnderson58/brad_ops.git//modules/iam/mfa_group"

  company = "mmorpg"
}

module "mmo_bucket_policy" {
  source = "git::https://github.com/bradAnderson58/brad_ops.git//modules/iam/s3_single_bucket_policy"

  company = "mmorpg"
  bucket  = "mmorpg.website"
}

resource "aws_iam_group" "mmo-dev" {
  name = "mmo-devs"
}

resource "aws_iam_group_policy_attachment" "mmo-s3" {
  group      = aws_iam_group.mmo-dev.name
  policy_arn = module.mmo_bucket_policy.policy_arn
}

resource "aws_iam_user" "brad" {
  name = "brad.mmo"
}

resource "aws_iam_user_login_profile" "brad_login" {
  user    = aws_iam_user.brad.name
  pgp_key = "keybase:bradface"
}

resource "aws_iam_group_membership" "mmo-mfa" {
  name = "mmo-mfa"
  group = module.mfa_group.mfa_group_name

  users = [
    aws_iam_user.brad.name
  ]
}

resource "aws_iam_group_membership" "mmo-dev" {
  name = "mmo-dev"
  group = aws_iam_group.mmo-dev.name

  users = [
    aws_iam_user.brad.name
  ]
}

output "brad_password" {
  value = aws_iam_user_login_profile.brad_login.encrypted_password
}