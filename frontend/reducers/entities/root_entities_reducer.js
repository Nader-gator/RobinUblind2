import {combineReducers} from 'redux'
import user from './user_reducer'
import news from "./news_reducer"
import currentStock from "./current_stock_reducer"
import watchlist from "./watchlist_reducer"
import stockData from './stock_data_reducer'
import transactions from './transactions_reducer'
import portfolio from './portfolio_reducer'

export default combineReducers({
  user,
  news,
  currentStock,
  watchlist,
  stockData,
  transactions,
  portfolio
})



// Entities: 
        //Stocks
        //user
        //purchasehistory
        //watchlist
        //news
        //stockData
//UI:
      //loading
      //purchase pending (might not need this one)
//errors
      //session
      //purchase
      //sale
//session