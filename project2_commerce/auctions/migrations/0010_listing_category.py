# Generated by Django 2.2.11 on 2020-07-17 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0009_auto_20200717_1042'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='category',
            field=models.CharField(default='other', max_length=10),
        ),
    ]
