from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from auth.models import User


class UserAdmin(BaseUserAdmin):
    ordering = ('email',)
    list_filter = ('email', )
    fieldsets = (
        (None, {"fields": ("password", )}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (_("Permissions"),
            {
                "fields": (
                    "is_active",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = ("email", "first_name", "last_name")
    search_fields = ("first_name", "last_name", "email")


admin.site.register(User, UserAdmin)
