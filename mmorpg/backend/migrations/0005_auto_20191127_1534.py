# Generated by Django 2.2.7 on 2019-11-27 15:34

from django.db import migrations
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_auto_20191117_0945'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='animations',
            field=django_mysql.models.JSONField(default=dict),
        ),
    ]