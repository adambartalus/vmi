from rest_framework import pagination
from rest_framework.response import Response


class CustomPagination(pagination.PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'next_page': self.get_next_page_number(),
            'previous_page': self.get_previous_page_number(),
            'results': data
        })

    def get_next_page_number(self):
        if not self.page.has_next():
            return None
        return self.page.number + 1

    def get_previous_page_number(self):
        if not self.page.has_previous():
            return None
        return self.page.number - 1