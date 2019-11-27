
variable "mmo_db_password" {
  description = "password for the mmo database"
}

variable "vpc_cidr" {
  description = "cidr block for the vpc"
  default = "200.0.0.0/16"
}

variable "local_cidr" {
  description = "(for now) local ip address for whitelisting development"
}
