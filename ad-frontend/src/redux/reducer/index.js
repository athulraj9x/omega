import { combineReducers } from "redux";
import Login from "./auth/loginReducer";
import TwoFactorAuthencation from "./auth/twoAuthenticationReducer";
import Client2FADetailsReducer from "./users/client2FADetailsReducer";
import TwoFactorToggleSettings from "./users/twoFactorToggleReducer";
import Logout from "./auth/logoutReducer";
import Layers from "./users/getLayersReducer";
import addLayer from "./users/addLayersReducer";
import AddCurrency from "./currency/addCurrencyReducer";
import GetCurrency from "./currency/getCurrencyReducer";
import GetSports from "./sports/getSportsReducer";
import GetLeagues from "./leagues/getLeaguesReducer";
import GetEvents from "./events/getEventsReducer";
import GetMarket from "./markets/getMarketReducer";
import AddPanel from "./restorePanel/panelReducer";
import ManageEvents from "./eventManagement/getManageEventsReducer";
import GetDbSports from "./sports/getDbSportsReducer";
import UpdateEventManagementDatas from "./eventManagement/postManageEventsReducer";
import GetRunner from "./runners/getRunnersReducer";
import GetDbLeagues from "./leagues/getDbLeaguesReducer";
import GetDbRunners from "./runners/getDbRunnersReducer";
import AddResult from "./result/addResultReducer";
import GetResult from "./result/getResultReducer";
import GetSportSettings from "./settings/getSportSettingsReducer";
import PostSportSettings from "./settings/postSportSettingsReducer";
import GetAllBets from "./bets/getAllBets";
import DeleteUserBet from "./bets/deleteUserBet";
import GlobalMarketCodes from "./markets/globalMarketCodes";
import GetEventMarkets from "./markets/getEventMarket";
import addDepositReducer from "./deposit/addDepositReducer";
import addWithdrawal from "./withdrawal/addWithdrawalReducer";
import getWithdrawal from "./withdrawal/getWIthdrawalReducer";
import getUserBalance from "./users/getUserBalanceReducer";
import addPermission from "./users/addPermissionReducer";
import addCreditReference from "./users/addCreditReferenceReducer";
import resetPassword from "./users/resetPassword";
import changePassword from "./users/changePassword";
import GetResultTransaction from "./reports/getResultTransactionReducer";
import GetResultTransactionDetail from "./reports/getResultTransactionDetail";
import getUserBetsEvent from "./bets/getUserBetByEvent";
import GetReportsTransaction from "./reports/getReportsTransactionReducer";
import getUserExposureReducer from "./users/getUserExposureReducer";
import getFancyMarkets from "./markets/getFancyMarkets";
import Settlement from "./settlement/settlementReducer";
import GetDashboardData from "./dashboard/getDashboardDataReducer";
import GetBankingData from "./banking/getBankingDataReducer";
import GetSettlement from "./settlement/getSettlementReducer";
import globalCurrencyValueReducer from "./currency/globalCurrencyValueReducer";
import GetInactiveLayers from "./users/getInactiveLayersReducer";
import GetAnalysisData from "./analysis/getAnalysisDataReducer";
import GetBetsAndBooks from "./bets/getBetsAndBooks";
import GetBetStatusReducer from "./bets/getBetStatusReducer";
import LoginHistory from "./auth/loginHistoryReducer";
import GetLeagueSetting from "./settings/getLeagueSettingReducer";
import GetMatchSetting from "./settings/getMatchSettingReducer";
import PostLeagueSetting from "./settings/postLeagueSettingReducer";
import PostMatchSetting from "./settings/postLeagueSettingReducer";
import GetDbEvent from "./events/getDbEventReducer";
import GetBetsByMarketType from "./bets/getBetsByMarketType";
import GetAuthDetail from "./auth/authDetailReducer";
import GetCasinoBets from "./reports/getCasinoBetsByDateReducer";
import GetCasinoBetsReport from "./reports/getCasinoBetsReportReducer";
import GetCommissionReports from "./reports/getCommissionReportsReducer"
import AddOddLimit from "./eventManagement/addOddLimitReducer";
import EventDeActivated from "./result/eventDeActivatedReducer";
import RollBack from "./result/rollBackReducer";
import DeleteMultipleEvents from "./eventManagement/deleteMultipleEventsReducer";
import GetDeletedBets from "./bets/getDeletedBetsReducer";
import GetBetFilters from "./bets/getBetFilters";
import AddBanner from "./homeSliders/addBannerReducer";
import GetBanner from "./homeSliders/getBannerReducer";
import UpdateSliderStatus from "./homeSliders/updateStatusReducer";
import DeleteSlider from "./homeSliders/deleteSliderReducer";
import AddManager from "./managers/addManagerReducer";
import GetManagers from "./managers/getManagerReducer";
import GetManagerReports from "./managers/getManagerReportsReducer";
import UpdateSetting from "./settings/updateStakeSettingReducer";
import AddWhiteLabel from "./whiteLabel/addWhiteLabelReducer";
import GetWhiteLabel from "./whiteLabel/getWhiteLabelReducer";
import CheckWhiteLabelPresence from "./whiteLabel/checkWhiteLabelPresenceReducer";
import ChangeBetfairCurrency from "./currency/changeBetfairCurrency";
import FetchWhiteLabelData from "./whiteLabel/fetchWhiteLabelData";
import UpdateBetfairShare from "./users/updateBetfairShares";
import UpdateCommissionPercentage from "./users/updateCommissionPercentageReducer";


import GetBetfairCountries from "./countries/getBetfairCountries";
import GetBetfairVenues from "./venues/getVenues";
import GetBetfairTimeRange from "./timeRanges/getTimeRanges";
import GetTvUrl from "./live/getTvUrlActionReducer";
import UpdateRadarId from "./eventManagement/updateRadarIDReducer";
import AddRaceEvents from "./events/addRaceEvents";
import AddSsoId from "./ssoId/addSsoIdReducer";
import AddBetxExchangeSsoid from "./ssoId/addBetxExchangeSsoIdReducer"
import SetPriorityLineMarketReducer from "./markets/setPriorityLineMarketReducer";
import GetPriorityEventMarketReducer from "./markets/getPriorityEventMarketReducer";
import SetCommissionReducer from "./commission/setCommissionReducer";
import CurrentCommissionStatus from "./commission/CurrentCommissionStatus";
import getLiveExposureDataReducer from "./dashboard/getLiveExposureReducer";

import TwoFactorStatusReducer from "./TwoFA/TwoFactorStatusReducer";
import VerifyTwoFactorCodeReducer from "./TwoFA/VerifyTwoFactorCodeReducer";
import GoogleLoginValidation from "./TwoFA/googleLoginValidation";
import getFancyStakeLimitReducer from "./settings/getFancyStakeSettingReducer";
import updateFancyStakeLimitReducer from "./settings/updateStakeSettingReducer"
import GenerateQRcodeReducer from "./TwoFA/generateQRcodeReducer";
import GoogleAuthenticatorOTPvalidation from "./TwoFA/googleAuthenticatorOTPvalidation";

import GetLineMarket from "./eventManagement/getLineMarketsReducer";
import AddNewMarket from "./eventManagement/addNewMarketReducer";
import UploadApkReducer from "./apk/UploadApkReducer";
import GetSportsDataWithPriority from "./homeSliders/getSportsDataWithPriorityReducer";
import SetSportsPriorityReducer from "./homeSliders/setSportsPriorityReducer";


import getLeagueDataWithPriorityReducer from "./homeSliders/getLeagueDataWithPriorityReducer";
import SetLeaguePriorityReducer from "./homeSliders/setLeaguePriorityReducer";
import addPostNotificationReducer from "./notification/postNotificationReducer";
import getAllusersReduer from "./notification/getAllUsersReducer";
import deleteNotificationReducer from "./notification/deleteNotificationReducer";
import editNotificationReducer from "./notification/editNotificationReducer";
import errorBetReducer from "./bets/getErrorBetsReducer";
import changeErrorBetReducer from "./bets/changeStatusErrorBetReducer";
import betFairEngineData from "./betFairEngine/betFairEngineReducer";


import RestrictClientBetsReducer from "./restrictClientBets/restrictClientBetsReducer";
import GetLeagueEventDataReducer from "./eventManagement/getLeagueEventDataReducer";
import DeleteEventsDataReducer from "./eventManagement/deleteEventsDataReducer";
import SearchBasedOnEventsReducer from "./eventManagement/SearchBasedOnEventsReducer";
import currencyLayerReducer from "./currency/getLayerCurrencyReducer";

import GetMarketBasedBets from "./marketAnalysis/getMarketBasedBets";
import GetBetsByMarketId from "./marketAnalysis/getBetsByMarketId";
import GetMarketAnalysisDataReducer from "./marketAnalysis/getMarketAnalysisDataReducer";
import SearchEventsReducer from "./marketAnalysis/searchEventsReducer";
import ChannelCode from "./eventManagement/updateChannelCodeReducer";
import getDashboardDataDetailsReducer from "./dashboard/getDashBoardDetailsDataReducer";
import addRaceEventsAll from "./horseRace/addRaceEventsAllReducer";
import UpdateClientShares from "./users/updateClientSharesReducer";
import GetBetsOfRunningMarket from "./bets/getBetsOfRunningMarketReducer";
import GetViewBetsOfRunningMarket from "./bets/getViewBetsOfRunningMarketReducer";
import getBetfairBalanceReducer from "./dashboard/getBetfairBalanceReducer";
import GetCasinoTransaction from "./reports/getCasinoTransactionReducer";
import GetLayersForManager from "./users/getLayersForManagerReducer";
import GetLeaguesForReportAnalysisReducer from "./eventManagement/getLeaguesForReportAnalysisReducer";
import GetEventsForReportAnalysisReducer from "./eventManagement/getEventsForReportAnalysisReducer";
import UpdateLayersForManager from "./users/updateLayersForManagerReducer";
import ClientSettlement from "./users/clientSettlementReducer";
import SettlementRollback from "./result/settlementRollBackReducer";
import AddGroupName from "./users/addGroupNameReducer";
import getUsersGroupNames from "./users/getUsersGroupNames";
import clientSettlementCompletedUpdation from "./users/clientSettlementCompletedUpdation";
import TransactionStatusReducer from "./transaction/transactionStatusReducer";
import GetBankingDataReducer from "./banking/getBankingDataReducer";
import DeleteBankDetailsReducer from "./banking/deleteBankDetailsReducer";

import GetHelplineReducer from "./helpline/getHelplineReducer";
import AddHelplineReducer from "./helpline/addHelplineReducer";
import DeleteHelplineReducer from "./helpline/deleteHelplineReducer";

import UpdateBonus from "./users/updateBonusReducer";
import Bonus from "./bonus/bonusReducer";
import GetLineMarketBets from "./bets/getLineMarketBetsReducer";
import GetFancyMarketBets from "./bets/getFancyMarketBetsReducer";
import CryptoManualUpdate from "./cryptoPayment/cryptoManualUpdate";

const appReducer = combineReducers({
  Login,
  TwoFactorAuthencation,
  TwoFactorToggleSettings,
  Client2FADetailsReducer,
  LoginHistory,
  Logout,
  Layers,
  addLayer,
  AddCurrency,
  GetCurrency,
  GetSports,
  GetLeagues,
  GetEvents,
  GetMarket,
  AddPanel,
  ManageEvents,
  GetLeaguesForReportAnalysisReducer,
  GetEventsForReportAnalysisReducer,
  GetDbSports,
  UpdateEventManagementDatas,
  GetRunner,
  GetDbLeagues,
  GetDbRunners,
  AddResult,
  GetResult,
  GetSportSettings,
  PostSportSettings,
  GetAllBets,
  DeleteUserBet,
  GlobalMarketCodes,
  GetEventMarkets,
  addDepositReducer,
  addWithdrawal,
  getWithdrawal,
  getUserBalance,
  addPermission,
  addCreditReference,
  resetPassword,
  changePassword,
  GetResultTransaction,
  GetResultTransactionDetail,
  getUserBetsEvent,
  GetReportsTransaction,
  getUserExposureReducer,
  getFancyMarkets,
  Settlement,
  GetDashboardData,
  GetBankingData,
  GetSettlement,
  globalCurrencyValueReducer,
  GetInactiveLayers,
  GetAnalysisData,
  GetBetsAndBooks,
  GetBetStatusReducer,
  GetLeagueSetting,
  GetMatchSetting,
  PostLeagueSetting,
  PostMatchSetting,
  GetDbEvent,
  GetBetsByMarketType,
  GetAuthDetail,
  GetCasinoBets,
  GetCasinoBetsReport,
  GetCommissionReports,
  AddOddLimit,
  EventDeActivated,
  RollBack,
  DeleteMultipleEvents,
  GetDeletedBets,
  GetBetFilters,
  AddBanner,
  GetBanner,
  UpdateSliderStatus,
  DeleteSlider,
  AddManager,
  GetManagers,
  GetManagerReports,
  UpdateSetting,
  AddWhiteLabel,
  GetWhiteLabel,
  CheckWhiteLabelPresence,
  ChangeBetfairCurrency,
  FetchWhiteLabelData,
  UpdateBetfairShare,
  UpdateCommissionPercentage,
  GetBetfairCountries,
  GetBetfairVenues,
  GetBetfairTimeRange,
  GetTvUrl,
  UpdateRadarId,
  AddRaceEvents,
  AddSsoId,
  AddBetxExchangeSsoid,
  SetPriorityLineMarketReducer,
  GetPriorityEventMarketReducer,
  SetCommissionReducer,
  CurrentCommissionStatus,
  getLiveExposureDataReducer,
  TwoFactorStatusReducer,
  VerifyTwoFactorCodeReducer,
  GoogleLoginValidation,
  getFancyStakeLimitReducer,
  updateFancyStakeLimitReducer,
  GenerateQRcodeReducer,
  GoogleAuthenticatorOTPvalidation,
  GetLineMarket,
  AddNewMarket,
  UploadApkReducer,
  GetSportsDataWithPriority,
  SetSportsPriorityReducer,
  getLeagueDataWithPriorityReducer,
  SetLeaguePriorityReducer,
  addPostNotificationReducer,
  getAllusersReduer,
  deleteNotificationReducer,
  editNotificationReducer,
  errorBetReducer,
  changeErrorBetReducer,
  RestrictClientBetsReducer,
  betFairEngineData,
  GetLeagueEventDataReducer,
  DeleteEventsDataReducer,
  SearchBasedOnEventsReducer,
  currencyLayerReducer,
  GetMarketBasedBets,
  GetBetsByMarketId,
  GetMarketAnalysisDataReducer,
  SearchEventsReducer,
  ChannelCode,
  getDashboardDataDetailsReducer,
  getBetfairBalanceReducer,
  addRaceEventsAll,
  UpdateClientShares,
  GetBetsOfRunningMarket,
  GetViewBetsOfRunningMarket,
  GetCasinoTransaction,
  GetLayersForManager,
  UpdateLayersForManager,
  ClientSettlement,
  SettlementRollback,
  AddGroupName,
  getUsersGroupNames,
  clientSettlementCompletedUpdation,
  TransactionStatusReducer,
  GetBankingDataReducer,
  DeleteBankDetailsReducer,
  GetHelplineReducer,
  AddHelplineReducer,
  DeleteHelplineReducer,
  UpdateBonus,
  Bonus,
  GetLineMarketBets,
  GetFancyMarketBets,
  CryptoManualUpdate,
});

const reducers = (state, action) => {
  return appReducer(state, action);
};

export default reducers;
