/** @format */

// //SamplePage
import AddCurrencyPage from "../Components/Pages/PageLayout/currency/AddCurrencyPage";
import ListCurrency from "../Components/Pages/PageLayout/currency/ListCurrency";
import ListUsers from "../Components/Pages/PageLayout/users/ListUsers";
import AddUser from "../Components/Pages/PageLayout/users/AddUser";
import ListResultTransaction from "../Components/Pages/PageLayout/Reports/ResultTransaction";
import Dashboard from "../Components/Pages/PageLayout/Dashboard/Dashboard";
import EventManagement from "../Components/Pages/PageLayout/EventManagement/EventManagement";
import RestorePanel from "../Components/Pages/PageLayout/RestorePanel/RestorePanel";
import Results from "../Components/Pages/PageLayout/Result/Results";
import SportSettings from "../Components/Pages/PageLayout/Settings/SportSetting";
import LeagueSetting from "../Components/Pages/PageLayout/Settings/LeagueSetting";
import MatchSetting from "../Components/Pages/PageLayout/Settings/MatchSetting";
import OtherSetting from "../Components/Pages/PageLayout/Settings/OtherSettings";
import RunningMarkets from "../Components/Pages/PageLayout/RunningMarkets/RunningMarkets";
import MarketAnalysis from "../Components/Pages/PageLayout/RunningMarkets/MarketAnalysis";
import ReportDetailed from "../Components/Pages/PageLayout/Reports/ReportDetailed";
import Reports from "../Components/Pages/PageLayout/Reports/Report";
import DeletedBetsReport from "../Components/Pages/PageLayout/Bets/DeletedBetsReport";
import AddBanner from "../Components/Pages/PageLayout/HomeSliders/AddBanner";
import ListBanner from "../Components/Pages/PageLayout/HomeSliders/ListBanner";
import AddManager from "../Components/Pages/PageLayout/managers/AddManager";
import ListManagers from "../Components/Pages/PageLayout/managers/ListManagers";
import AddWhiteLabel from "../Components/Pages/PageLayout/WhiteLabels/AddWhiteLabel";
import { layerRoles, ManagerRoles } from "../Constant";
import SsoId from "../Components/Pages/PageLayout/SsoId/SsoId";
import Bonus from "../Components/Pages/PageLayout/Bonus/Bonus";
import FancyStakeSetting from "../Components/Pages/PageLayout/Settings/FancyStakeSetting";
import ManageSportsAccordingly from "../Components/Pages/PageLayout/HomeSliders/ManageSportsAccordingly";
import UploadApk from "../Components/Pages/PageLayout/APKComponent/UploadApk";
import Notification from "../Components/Pages/PageLayout/Notification/Notification";
import ReportAnalysis from "../Components/Pages/PageLayout/Reports/ReportAnalysis";
import ViewMarketBetsByEvent from "../Components/Pages/PageLayout/Reports/ViewMarketBetsByEvent";
import EventView from "../Components/Pages/PageLayout/Reports/EventView";
import CommissionReports from "../Components/Pages/PageLayout/Reports/CommissionReports";
import WhiteLabelsList from "../Components/Pages/PageLayout/WhiteLabels/WhiteLabelsList";
import NewExposure from "../Components/Pages/PageLayout/Exposure/NewExposure";
import WithdrawalList from "../Components/Pages/PageLayout/Withdrawal/WithdrawalList";
import AddBankDetails from "../Components/Pages/PageLayout/Deposit/AddBankDetail";
import DepositList from "../Components/Pages/PageLayout/Deposit/DepositList";
import HorseMarketAnalysis from "../Components/Pages/PageLayout/RunningMarkets/HorseMarketAnalysis";
import WithdrawelCryptoPaymentRequestList from "../Components/Pages/PageLayout/Withdrawal/WithdrawelCryptoPaymentRequest";
import ReportAnalysisMarketView from "../Components/Pages/PageLayout/Reports/ReportAnalysisMarketView";

export const routes = [
  { path: `/users`, Component: <ListUsers inactive={false} /> },
  { path: `/inactive-users`, Component: <ListUsers inactive={true} /> },
  { path: "/users/:userId/:role", Component: <ListUsers /> },
  { path: `/users/add-user`, Component: <AddUser /> },
  { path: `/dashboard`, Component: <Dashboard /> },
  // { path: "/manage-events", Component: <EventManagement /> },
  // { path: "/running-markets", Component: <RunningMarkets inactive={false}/> },
  { path: "/running-markets/exchange", Component: <RunningMarkets /> },
  { path: "/running-markets/bookmaker-fancy", Component: <RunningMarkets /> },
  { path: "/running-markets/error-bets", Component: <RunningMarkets /> },
  { path: "/running-markets/:eventName", Component: <MarketAnalysis /> },
  { path: "/running-markets/horse/:eventName", Component: <HorseMarketAnalysis /> },
  { path: "/reports/:detail", Component: <ReportDetailed /> },
  { path: "/reports", Component: <ListResultTransaction /> },
  { path: "/reports/analysis", Component: <ReportAnalysis /> },
  { path: "/report/:mobile_no", Component: <Reports /> },
  { path: "/home-sliders/add-slider", Component: <AddBanner /> },
  {
    path: "/home-sliders/sports-manage-accordingly",
    Component: <ManageSportsAccordingly />,
  },
  { path: "/commission-reports", Component: <CommissionReports /> },
  { path: "/home-sliders", Component: <ListBanner /> },
  { path: "/apk", Component: <UploadApk /> },
  // { path: "/banking", Component: <Banking /> },
  { path: "/deposit", Component: <AddBankDetails /> },
  { path: "/deposit-list", Component: <DepositList /> },
  { path: "/withdrawal-list", Component: <WithdrawalList /> },

  // CRYPTO TRANSACTION
  { path: "/crypto-deposit-list", Component: <DepositList /> },
  { path: "/cripto-withdrawal-list", Component: <WithdrawelCryptoPaymentRequestList /> },
];

// Routes only for Top-authority { -Director- }
export const protectedRoutes = [
  {
    path: "/currencies",
    Component: <ListCurrency />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/currencies/add-currency",
    Component: <AddCurrencyPage />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: `/restore-panel`,
    Component: <RestorePanel />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/users",
    Component: <ListUsers inactive={false} />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: `/inactive-users`,
    Component: <ListUsers inactive={true} />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/users/:userId/:role",
    Component: <ListUsers />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/users/add-user",
    Component: <AddUser />,
    managerAccess: [ManagerRoles.MANAGER, ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/reports/:detail",
    Component: <ReportDetailed />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/reports/analysis",
    Component: <ReportAnalysis />,
    managerAccess: [
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.FANCY_MANAGER,
    ],
  },
  {
    path: "/reports/analysis/:eventid",
    Component: <EventView />,
    managerAccess: [
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.FANCY_MANAGER,
    ],
  },
  {
    path: "/reports/analysis/:eventid/:market",
    Component: <ReportAnalysisMarketView />,
    // Component: <ViewMarketBetsByEvent />,
    managerAccess: [
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.FANCY_MANAGER,
    ],
  },
  {
    path: "/reports/analysis/:eventid/:market/:marketName",
    Component: <ViewMarketBetsByEvent />,
    managerAccess: [
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.FANCY_MANAGER,
    ],
  },
  {
    path: "/commission-reports",
    Component: <CommissionReports />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/dashboard",
    Component: <Dashboard />,
    managerAccess: [
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.MANAGER,
    ],
  },
  {
    path: "/results",
    Component: <Results />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/sport-setting",
    Component: <SportSettings />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/league-setting",
    Component: <LeagueSetting />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/match-setting",
    Component: <MatchSetting />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/other-setting",
    Component: <OtherSetting />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/fancy-stake-setting",
    Component: <FancyStakeSetting />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/manage-events",
    Component: <EventManagement />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/running-markets/exchange",
    Component: <RunningMarkets type={"exchange"} />,
    managerAccess: [ManagerRoles.MONITORING_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/running-markets/bookmaker-fancy",
    Component: <RunningMarkets type={"bookmaker-fancy"} />,
    managerAccess: [
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.FANCY_MANAGER,
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.MANAGER,
    ],
  },
  {
    path: "/running-markets/error-bets",
    Component: <RunningMarkets type={"error-bets"} />,
    managerAccess: [
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.FANCY_MANAGER,
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.MANAGER,
    ],
  },
  {
    path: "/running-markets/:eventName",
    Component: <MarketAnalysis />,
    managerAccess: [
      ManagerRoles.MONITORING_MANAGER,
      ManagerRoles.FANCY_MANAGER,
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.MANAGER,
    ],
  },
  {
    path: "/running-markets/horse/:eventName",
    Component: <HorseMarketAnalysis />,
    managerAccess: [ManagerRoles.MONITORING_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/reports",
    Component: <ListResultTransaction />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/report/:mobile_no",
    Component: <Reports />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/deleted-bets",
    Component: <DeletedBetsReport />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/betfair-reports",
    Component: <ListResultTransaction />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },

  {
    path: "/home-sliders/add-slider",
    Component: <AddBanner />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/home-sliders",
    Component: <ListBanner />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/home-sliders/sports-manage-accordingly",
    Component: <ManageSportsAccordingly />,
    managerAccess: [ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MANAGER],
  },

  {
    path: "/bonus",
    Component: <Bonus />,
    managerAccess: [
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.MONITORING_MANAGER,
    ],
  },
  {
    path: "/apk",
    Component: <UploadApk />,
    managerAccess: [layerRoles.DIRECTOR],
  },
  { path: "/add-manager", Component: <AddManager /> },
  { path: "/accounts-managers", Component: <ListManagers /> },
  { path: "/operational-managers", Component: <ListManagers /> },
  { path: "/monitoring-managers", Component: <ListManagers /> },
  { path: "/fancy-managers", Component: <ListManagers /> },
  {
    path: "/managers",
    Component: <ListManagers />,
    managerAccess: [ManagerRoles.MANAGER],
  },
  { path: "/whitelabels/add-whitelabel", Component: <AddWhiteLabel /> },
  {
    path: "/whitelabels",
    Component: <WhiteLabelsList inactive={false} />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  {
    path: "/inactive-whitelabels",
    Component: <WhiteLabelsList inactive={true} />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.MONITORING_MANAGER, ManagerRoles.MANAGER],
  },
  // { path: "/banking", Component: <Banking /> },
  {
    path: "/notification",
    Component: <Notification />,
    managerAccess: [
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.MONITORING_MANAGER,
    ],
  },
  // {
  //   path: "/betfairbalancechecker",
  //   Component: <BetFairEngine />,
  //   managerAccess: [
  //     ManagerRoles.OPERATIONAL_MANAGER,
  //     ManagerRoles.ACCOUNTS_MANAGER,
  //     ManagerRoles.MANAGER,
  //     ManagerRoles.MONITORING_MANAGER,
  //   ],
  // },
  {
    path: "/exposure",
    Component: <NewExposure />,
    managerAccess: [
      ManagerRoles.OPERATIONAL_MANAGER,
      ManagerRoles.ACCOUNTS_MANAGER,
      ManagerRoles.MANAGER,
      ManagerRoles.MONITORING_MANAGER,
    ],
  },
  {
    path: "/deposit",
    Component: <AddBankDetails />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MONITORING_MANAGER],
  },

  {
    path: "/deposit-list",
    Component: <DepositList />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MONITORING_MANAGER],
  },
  {
    path: "/withdrawal-list",
    Component: <WithdrawalList />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MONITORING_MANAGER],
  },
  {
    path: "/crypto-withdrawal-list",
    Component: <WithdrawelCryptoPaymentRequestList />,
    managerAccess: [ManagerRoles.ACCOUNTS_MANAGER, ManagerRoles.OPERATIONAL_MANAGER, ManagerRoles.MONITORING_MANAGER],
  },

  // CRYPTO TRANSATION
  // {
  //   path: "/crypto-deposit-list",
  //   Component: <DepositList />,
  //   managerAccess: [
  //     ManagerRoles.ACCOUNTS_MANAGER,
  //     ManagerRoles.OPERATIONAL_MANAGER,
  //     ManagerRoles.MONITORING_MANAGER,
  //   ],
  // },
];
