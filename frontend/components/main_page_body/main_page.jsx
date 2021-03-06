import React from "react";
import { Link } from "react-router-dom";
import HeaderContainer from "../header/header_container";
import Loading from "../loading_page/body_loading";
import PorfolioChart from "./portfolio_chart";
import Watchlist from "./watchlist";
import WatchlistLoading from "../loading_page/watchlist_loading";
import ValueDisplay from "./main_value";
import Chart from "../chart/mini_chart";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { watchlistWaiting: true };
  }

  componentWillMount() {
    this.props.updateChartDisplay(this.parsePortfolioVal("totalVal"));
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ watchlistWaiting: false });
    }, 5000);
  }

  positions = () => {
    if (this.props.transactions[1] === undefined) {
      return [];
    }

    return Object.keys(this.props.transactions[1][1].open).map((el, idx) => {
      if (this.props.data[el] == undefined) {
        return null;
      }
      return (
        <Link key={idx} to={el}>
          <h3>{el}</h3>
          <div>
            <Chart data={this.props.data[el]} />
          </div>
            <p>${this.props.data[el].quote ? this.props.data[el].quote.toFixed(2) : 0}</p>
        </Link>
      );
    });
  };

  parsePortfolioVal = type => {
    if (
      this.props.transactions.length == 0 ||
      !Array.isArray(this.props.transactions)
    ) {
      return "00.00";
    }
    let tally = 0;
    let todaysTally = 0;
    let yesterdayssTally = 0;
    switch (type) {
      case "totalVal":
        Object.values(this.props.transactions[1][1].open).forEach(el => {
          tally = tally + el.stats.holding * el.stats.price;
        });
        tally = tally + this.props.transactions[1][1].bankroll;
        return tally;

      case "dayChange":
        Object.values(this.props.transactions[1][1].open).forEach(el => {
          todaysTally = todaysTally + el.stats.holding * el.stats.price;
        });
        Object.values(this.props.transactions[1][0].open).forEach(el => {
          yesterdayssTally =
            yesterdayssTally + el.stats.holding * el.stats.price;
        });
        todaysTally = todaysTally + this.props.transactions[1][1].bankroll;
        yesterdayssTally =
          yesterdayssTally + this.props.transactions[1][0].bankroll;
        return this.numberWithCommas(todaysTally - yesterdayssTally);

      case "percentChange":
        Object.values(this.props.transactions[1][1].open).forEach(el => {
          todaysTally = todaysTally + el.stats.holding * el.stats.price;
        });
        Object.values(this.props.transactions[1][0].open).forEach(el => {
          yesterdayssTally =
            yesterdayssTally + el.stats.holding * el.stats.price;
        });
        todaysTally = todaysTally + this.props.transactions[1][1].bankroll;
        yesterdayssTally =
          yesterdayssTally + this.props.transactions[1][0].bankroll;
        return this.numberWithCommas(
          ((todaysTally - yesterdayssTally) / yesterdayssTally) * 100
        );

      default:
        return "00";
    }
  };

  mappedWatchlist = () => {
    const list = this.props.watchlist.map((el, idx) => {
      if (this.props.data[el.nasdaq_code] === undefined) {
        return [];
      }

      if (this.positions().length > 0) {
        const transactions =
          this.props.wListTransactions.length === 0
            ? Object.keys(this.props.transactions[1][1].open)
            : Object.keys(this.props.wListTransactions.open);
        if (transactions.includes(el.nasdaq_code)) return [];
      }

      return (
        <Link key={idx} to={el.nasdaq_code}>
          <h3>{el.nasdaq_code}</h3>
          <div>
            <Chart data={this.props.data[el.nasdaq_code]} />
          </div>
            <p>${this.props.data[el.nasdaq_code].quote ? this.props.data[el.nasdaq_code].quote.toFixed(2) : 0}</p>
        </Link>
      );
    });
    return list.reverse();
  };

  numberWithCommas = x => {
    return x
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  awaitingStocks = () => {
    if (this.props.preFetch) {
      return true;
    } else {
      return this.props.watchlist.length > Object.keys(this.props.data).length;
    }
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }
    return (
      <div>
        <header>
          <HeaderContainer />
          <script>
            {document.addEventListener("DOMContentLoaded", () => {
              window.onscroll = function() {
                myFunction();
              };
              var navbar = document.getElementById("loggedin-navbar");
              var sticky = navbar.offsetTop;

              function myFunction() {
                if (window.pageYOffset >= sticky) {
                  navbar.classList.add("sticky");
                } else {
                  navbar.classList.remove("sticky");
                }
              }
            })}
          </script>
          <script>
            {document.addEventListener("DOMContentLoaded", () => {
              window.onscroll = function() {
                myFunction();
              };
              var navbar = document.getElementById("watchlist");
              var sticky = navbar.offsetTop;

              function myFunction() {
                if (window.pageYOffset >= sticky) {
                  navbar.classList.add("wsticky");
                } else {
                  navbar.classList.remove("wsticky");
                }
              }
            })}
          </script>
        </header>

        <div className="entire-main-body">
          <div className="porfolio-performance">
            {/* <h1>${this.parsePortfolioVal("totalVal")}</h1> */}
            <ValueDisplay begin={this.parsePortfolioVal("totalVal")} />
            <h2>
              ${this.parsePortfolioVal("dayChange")} (
              {this.parsePortfolioVal("percentChange")}%)<span>Today</span>
            </h2>
          </div>

          <div
            onMouseLeave={() =>
              this.props.updateChartDisplay(this.parsePortfolioVal("totalVal"))
            }
          >
            <PorfolioChart
              stock={this.props.stock}
              fetchTransactionsMain={this.props.fetchTransactionsMain}
              currentUser={this.props.currentUser}
              transactions={this.props.transactions}
              loading={this.props.transactionLoading}
            />
          </div>

          <div className="news-list">
            <h1>Recent News</h1>
            <ul>{this.props.news}</ul>
          </div>

          {(this.state.watchlistWaiting && this.awaitingStocks()) ||
          this.props.transactionLoading ? (
            <div id="watchlist" className="watch-list-animate wsticky">
              <div className="loading-watchlist">
                <WatchlistLoading />
              </div>
            </div>
          ) : (
            <Watchlist
              data={this.props.data}
              transactions={
                this.props.wListTransactions.length === 0
                  ? this.props.transactions
                  : [null, [null, this.props.wListTransactions]]
              }
              mappedWatchlist={this.mappedWatchlist()}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MainPage;
