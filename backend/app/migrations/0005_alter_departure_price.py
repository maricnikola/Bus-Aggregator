# Generated by Django 5.1.1 on 2024-10-02 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_departure_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='departure',
            name='price',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
