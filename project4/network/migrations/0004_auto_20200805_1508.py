# Generated by Django 2.2.11 on 2020-08-05 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
