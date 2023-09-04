import logging
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from django.core.management.base import BaseCommand
from brokers.helper.aliceblue.copy_trade import TradingBot
from user.models import DnBrokerUserCredsMaster, DnBrokerUserStatusMaster

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Tries to trade for all user accounts'

    def process_user(self, user):
        user_id = user.id
        userCredsObj=DnBrokerUserCredsMaster.objects.filter(user_id=user_id, broker_id=2, status=1)
        if not userCredsObj.exists():
            return
        
        masterAccount = userCredsObj.filter(is_main=1)
        if not masterAccount.exists():
            return
        
        masterAccount=masterAccount.first()
        master_account={"userId": masterAccount.broker_user_id, 'api_key': masterAccount.broker_api_key}

        otherAccounts = list(userCredsObj.filter(is_main=0).values('broker_user_id', 'broker_api_key', 'quantity'))
        df_accounts = pd.DataFrame(otherAccounts)
        df_accounts.rename(columns={'broker_user_id':"userId", 'broker_api_key':"api_key", 'quantity':"Qty"}, inplace=True)
        accounts = df_accounts.to_dict(orient="records")

        bot = TradingBot(master_account=master_account,
                         accounts=accounts,
                         logger=logger
                         )
        
        logger.info(f"Master session ID: {bot.fetch_master_session_id()}")
        logger.info(f"Session IDs: {bot.fetch_all_session_ids()}")
        bot.fetch_order_history()
        bot.process_orders()

    def handle(self, *args, **kwargs):
        userBrokerObj = DnBrokerUserStatusMaster.objects.filter(broker_id=2, status=1)

        max_threads = 10  # You can adjust this according to the number of users or the capability of your server.
        with ThreadPoolExecutor(max_threads) as executor:
            list(executor.map(self.process_user, userBrokerObj))

        self.stdout.write(self.style.SUCCESS('Login attempt complete for all users'))