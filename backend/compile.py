import asyncio
from datetime import datetime, timedelta
import pandas as pd
from pandas.api.types import is_number
import numpy as np
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
FIELDS = "&fields=partNumber,user_Number1,user_Number2"
ESTIMATES_URL = JB2_API + "estimates" + QUALIFIERS + FIELDS


class CTL:
    def __init__(self):
        self.__session = requests.Session()

        # Get & set authentication headers
        self.__auth_token = get_auth_token(self.__session)
        self.__session.headers.update({"Authorization": f"Bearer {self.__auth_token}"})

        # Get all tables
        self._releases = pd.DataFrame.from_records(paginator(self.__session, RELEASES_URL))
        self._orders = pd.DataFrame.from_records(paginator(self.__session, ORDERS_URL))
        self._order_det = pd.DataFrame.from_records(paginator(self.__session, ORDER_DET_URL))
        self._estimates = pd.DataFrame.from_records(paginator(self.__session, ESTIMATES_URL))

        # Merge tables
        self._releases = self._releases.merge(self._orders,
                                                how="left",
                                                on="orderNumber")
        self._releases = self._releases.merge(self._order_det,
                                                how="left",
                                                on="jobNumber")

        # Sum part Qty's grouped by part number with "KANBAN" comment
        idx_kanban_stock = self._releases["comments"].str.contains("KANBAN", na=False) & \
                          ~self._releases["comments"].str.contains("LPRD", na=False)
        kanban_stock = self._releases[idx_kanban_stock]
        kanban_stock.to_csv("stock.csv")

        kanban_stock = kanban_stock[["partNumber", "quantity"]].groupby("partNumber").sum()
        kanban_stock.rename(columns={"quantity": "kanban_stock"}, inplace=True)

        # Sum part Qty's grouped by part number with "customer" or "kbn" order entry type
        idx_kanban_order = self._releases["user_Text2"].isin(["customer", "kbn"]) & \
                         (~self._releases["comments"].str.contains("KANBAN", na=False) | \
                           self._releases["comments"].str.contains("LPRD", na=False))
        kanban_order = self._releases[idx_kanban_order]
        kanban_order.to_csv("order.csv")

        kanban_order = kanban_order[["partNumber", "quantity"]].groupby("partNumber").sum()
        kanban_order.rename(columns={"quantity": "order_qty"}, inplace=True)


        # Merge columns to create Kanban list
        self._estimates = self._estimates.merge(kanban_stock,
                                                how="left",
                                                on="partNumber")
        self._estimates = self._estimates.merge(kanban_order,
                                                how="left",
                                                on="partNumber")

        self._estimates.fillna(0, inplace=True)

        # Add "Weeks Left" column
        self._estimates["weeks_left"] = self._estimates["order_qty"] / self._estimates["user_Number1"] * 4

        # Fix divide by zero errors
        self._estimates.replace([np.inf, -np.inf], "No Usage", inplace=True)
        self._estimates.fillna("No Usage", inplace=True)

        # Merge weeks left onto releases
        self._releases = self._releases.merge(self._estimates[["partNumber", "weeks_left"]],
                                              how="left",
                                              on="partNumber")

        # Add "Effective Date" column
        self._releases["effective_date"] = self._releases.apply(self.__effective_date, axis=1)

    @property
    def ctl(self):
        return self._releases.to_json(orient="records")

    @property
    def official_kanban(self):
        return self._estimates.to_json(orient="records")

    @property
    def weekly_hours(self):
        weekly_hours = self._releases[["productCode", ]]

    @staticmethod
    def __effective_date(row):
        if pd.notna(row["weeks_left"]) and is_number(row["weeks_left"]):
            date = datetime.now() + timedelta(weeks=row["weeks_left"])

        else:
            date = datetime.fromisoformat(row["dueDate"])

        if row["priority"] == 30:
            date -= timedelta(days=2)

        elif row["priority"] == 50:
            date += timedelta(days=10)

        return date
