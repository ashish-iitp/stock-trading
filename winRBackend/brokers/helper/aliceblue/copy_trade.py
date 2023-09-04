import time
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from pya3 import Aliceblue, TransactionType, OrderType, ProductType


class TradingBot:
    def __init__(self, master_account, other_accounts, logger, max_threads=50):
        self.logger = logger
        self.master_account = Aliceblue(user_id=master_account["userid"], api_key=master_account["api_key"])
        self.accounts = other_accounts
        self.order_history_df = pd.DataFrame()
        self.num_rows = 0
        self.max_threads = max_threads

    def fetch_master_session_id(self):
        return self.master_account.get_session_id()

    def fetch_all_session_ids(self):
        ans = {}
        with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
            results = executor.map(self.fetch_session_for_account, self.accounts)
        for r in results:
            ans.update(r)
        return ans

    def fetch_session_for_account(self, account):
        try:
            alice_instance = Aliceblue(user_id=account["userid"], api_key=account["api_key"])
            return {account["userid"]: alice_instance.get_session_id()}
        except Exception as e:
            self.logger.error(f"Error fetching session for account {account['userid']}: {e}")
            return {}

    def fetch_order_history(self):
        while True:
            try:
                order_history = self.master_account.get_order_history('')
                if 'emsg' in order_history and order_history['emsg'] == 'No Data':
                    self.logger.info("You have no placed order till now.")
                else:
                    self.order_history_df = pd.DataFrame(order_history)
                    self.num_rows = self.order_history_df.shape[0]
                    break
            except Exception as e:
                self.logger.error(f"Error fetching order history: {e}")

    def place_order_for_account(self, account):
        try:
            alice_instance = Aliceblue(user_id=account["userid"], api_key=account["api_key"])
            order = alice_instance.place_order(
                transaction_type=self.t_type,
                instrument=self.master_account.get_instrument_by_symbol(self.exch, self.symbol),
                quantity=account["Qty"],
                order_type=self.o_type,
                product_type=self.p_type
            )
            self.logger.info(f"The order id for account {account['userid']} is: {order}")
        except Exception as e:
            self.logger.error(f"Error placing order for account {account['userid']}: {e}")

    def process_orders(self):
        while True:
            if self.order_history_df.shape[0] >= 1:
                ob = self.master_account.get_order_history('')[0]
                self.map_order_details(ob)
                self.fetch_order_history()
                self.logger.info(f"Number of orders placed in master account: {self.num_rows}")

                if self.num_rows > self.num_rows1:
                    with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
                        executor.map(self.place_order_for_account, self.accounts)
                    self.logger.info("All orders placed successfully.")
                self.num_rows1 = self.order_history_df.shape[0]
            time.sleep(0.5)

    def map_order_details(self, ob):
        self.t_type_map = {'B': TransactionType.Buy, 'S': TransactionType.Sell}
        self.t_type = self.t_type_map.get(ob['Trantype'], 'Unknown')

        self.o_type_map = {'L': OrderType.Limit, 'MKT': OrderType.Market}
        self.o_type = self.o_type_map.get(ob['Prctype'], 'Unknown')

        self.p_type_map = {'NRML': ProductType.Delivery, 'MIS': ProductType.Intraday}
        self.p_type = self.p_type_map.get(ob['Pcode'], 'Unknown')

        self.exch = ob['Exchange']
        self.symbol = ob['Trsym']