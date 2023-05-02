from rest_access_policy import AccessPolicy


class BaseAccessPolicy(AccessPolicy):
    statements = [
        {
            'action': '*',
            'principal': ['group:admin'],
            'effect': 'allow'
        }
    ]


class GroupAccessPolicy(BaseAccessPolicy):
    pass


class UserAccessPolicy(BaseAccessPolicy):
    statements = BaseAccessPolicy.statements + [
        {
            'action': '*',
            'principal': ['group:staff'],
            'effect': 'allow',
        },
        {
            'action': ['retrieve', 'update', 'partial_update', 'destroy'],
            'principal': ['*'],
            'effect': 'allow',
            'condition': 'is_the_user',
        },
    ]

    def is_the_user(self, request, view, action) -> bool:
        user = view.get_object()
        return user == request.user
