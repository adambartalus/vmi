from rest_access_policy import AccessPolicy


class BaseAccessPolicy(AccessPolicy):
    statements = [
        {
            'action': '*',
            'principal': ['group:admin'],
            'effect': 'allow'
        }
    ]


class PadlockAccessPolicy(BaseAccessPolicy):
    statements = BaseAccessPolicy.statements + [
        {
            'action': '*',
            'principal': ['group:staff'],
            'effect': 'allow',
        }
    ]


class GymPassAccessPolicy(BaseAccessPolicy):
    statements = BaseAccessPolicy.statements + [
        {
            'action': ['list', 'retrieve'],
            'principal': ['authenticated'],
            'effect': 'allow',
        },
        {
            'action': ['create', 'update', 'partial_update', 'destroy'],
            'principal': ['group:staff'],
            'effect': ['allow'],
        }
    ]

    @classmethod
    def scope_queryset(cls, request, queryset):
        if request.method != 'GET' and request.user.groups.filter(name='admin').exists():
            return queryset
        return queryset.filter(owner=request.user)


class GymVisitAccessPolicy(BaseAccessPolicy):
    statements = BaseAccessPolicy.statements + [
        {
            'action': ['list', 'retrieve'],
            'principal': ['authenticated'],
            'effect': 'allow'
        },
        {
            'action': ['create', 'update', 'partial_update', 'destroy'],
            'principal': ['group:staff'],
            'effect': 'allow'
        }
    ]

    @classmethod
    def scope_queryset(cls, request, queryset):
        if request.method != 'GET' and request.user.groups.filter(name='staff').exists():
            return queryset
        return queryset.filter(user=request.user)
