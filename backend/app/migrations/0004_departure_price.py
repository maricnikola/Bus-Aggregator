# Generated by Django 5.1.1 on 2024-10-02 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_userlocation'),
    ]

    operations = [
        migrations.AddField(
            model_name='departure',
            name='price',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
