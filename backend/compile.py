import pandas as pd
import requests

from jb2 import JB2_API, get_auth_token, paginator

# Table requests
QUALIFIERS = "?jobNumber[ne]=&deliveryTicketNumber="
FIELDS = "&fields=jobNumber,orderNumber,partNumber,partDescription,quantity,dueDate,comments"
RELEASES_URL = JB2_API + "releases" + QUALIFIERS + FIELDS

# &fields=
QUALIFIERS = "?status=Open"
FIELDS = "&fields=orderNumber,PONumber,customerCode,dateEntered,location,notesToCustomer"
ORDERS_URL = JB2_API + "orders" + QUALIFIERS + FIELDS

QUALIFIERS = "?status=Open"
FIELDS = "&fields=jobNumber,user_Text2,jobOnHold,priority,productCode,unitPrice,miscDescription,totalEstimatedHours,quantityOrdered,quantityToStock"
ORDER_DET_URL = JB2_API + "order-line-items" + QUALIFIERS + FIELDS

class CTL:
    def __init__(self):
        self.__session = requests.Session()

        # Get & set authentication headers
        self.__auth_token = get_auth_token(self.__session)
        self.__session.headers.update({"Authorization": f"Bearer {self.__auth_token}"})

        print("Started table fetch")

        # Get all tables
        self._releases = paginator(self.__session, RELEASES_URL)
        self.__orders = paginator(self.__session, ORDERS_URL)
        self.__order_det = paginator(self.__session, ORDER_DET_URL)

        print("Finished table fetch")


    @property
    def table(self):
        return self._releases
