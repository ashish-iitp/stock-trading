from django.urls import path
from brokers.views import (side_bar,
                           add_broker_creds,
                           broker_list,
                           broker_status,
)

app_name = 'brokers'
urlpatterns = [
    path('side_bar', side_bar.SideBarView.as_view(), name="side-bar"),
    path('add_broker_creds', add_broker_creds.BrokerStore.as_view(), name="add-broker-creds"),
    path('broker_list', broker_list.BrokerListView.as_view(), name="broker-list"),
    path('update_broker_status', broker_status.BrokerStatusView.as_view(), name="update-broker-status"),
    path('update_broker_quantity', add_broker_creds.AddBrokerQuantityView.as_view(), name="update-broker-quantity"),

]