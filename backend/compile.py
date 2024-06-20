import asyncio
import pandas as pd
import requests
from time import time

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

QUALIFIERS = "?user_Text2[in]=kbn|customer"
FIELDS = "&fields=partNumber,user_Text2,user_Number1,user_Number2"
ESTIMATES_URL = JB2_API + "estimates" + QUALIFIERS + FIELDS


class CTL:
    def __init__(self):
        self.__session = requests.Session()

        # Get & set authentication headers
        self.__auth_token = get_auth_token(self.__session)
        self.__session.headers.update({"Authorization": f"Bearer {self.__auth_token}"})

        start = time()
        print("Started table fetch")

        # Get all tables
        self._releases = pd.DataFrame.from_records(paginator(self.__session, RELEASES_URL))
        self._orders = pd.DataFrame.from_records(paginator(self.__session, ORDERS_URL))
        self._order_det = pd.DataFrame.from_records(paginator(self.__session, ORDER_DET_URL))
        self._estimates = pd.DataFrame.from_records(paginator(self.__session, ESTIMATES_URL))

        # Create Kanban table from releases and estimates


        # Merge tables
        self._releases = self._releases.merge(self._orders,
                                                how="left",
                                                on="orderNumber")
        self._releases = self._releases.merge(self._order_det,
                                                how="left",
                                                on="jobNumber")
        self._releases = self._releases.merge(self._estimates,
                                                how="left",
                                                on="partNumber")

        print("Finished table fetch:", time()-start)


    @property
    def table(self):
        return self._releases.to_json(orient='records')
