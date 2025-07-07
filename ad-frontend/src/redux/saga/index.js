import { all } from "redux-saga/effects";
import Login from "./auth/loginSaga";
import TwoAuthenticationSaga from "./auth/twoAuthenticationSaga";
import Client2FADetails from "./users/Client2FADetailsSaga";
import TwoFactorialToggleSettingsSaga from "./users/twoFactorialToggleSettingsSaga";
import Logout from "./auth/logoutSaga";
import GetLayers from "./users/getLayersSaga";
import addLayer from "./users/addLayerSaga";
import AddCurrency from "./currency/addCurrencySaga";
import GetCurrency from "./currency/getCurrencySaga";
import GetSports from "./sports/getSportSaga";
import GetLeagues from "./leagues/getLeagueSaga";
import GetEvents from "./events/getEventSaga";
import GetMarkets from "./markets/getMarketSaga";
import AddPanel from "./restorePanel/panelSaga";
import ManageEvents from "./eventManagement/getManageEventsSaga";
import GetEventsForReportAnalysisSaga from "./eventManagement/getEventsForReportAnalysisSaga";
import GetLeaguesForReportAnalysisSaga from "./eventManagement/getLeaguesForReportAnalysisSaga";
import GetDbSports from "./sports/getDbSportSaga";
import UpdateEventManagementDatas from "./eventManagement/postManageActionSaga";
import GetRunner from "./runners/getRunnerSaga";
import GetDbLeagues from "./leagues/getDbLeagueSaga";
import GetDbRunners from "./runners/getDbRunnersSaga";
import AddResult from "./result/addResultSaga";
import GetResult from "./result/getResultSaga";
import GetSportSettings from "./settings/getSportSettingsSaga";
import PostSportSettings from "./settings/postSportSettingSaga";
import GetAllBets from "./bets/getAllBets";
import DeleteUserBet from "./bets/deleteUserBet";
import GlobalMarketCode from "./markets/globalMarketCodes";
import GetEventMarkets from "./markets/getEventMarket";
import AddDeposit from "./deposit/addDepositSaga";
import AddWithdrawal from "./withdrawal/addWithdrawalSaga";
import Getwithdrawal from "./withdrawal/getWithdrawalSaga";
import GetUserBalance from "./users/getUserBalanceSaga";
import addPermission from "./users/addPermissionSaga";
import addCreditReference from "./users/addCreditReferenceSaga";
import resetPassword from "./users/resetPassword";
import changePassword from "./users/changePassword";
import GetResultTransaction from "./reports/getResultTransactionSaga";
import GetResultTransactionDetail from "./reports/getResultTransactionDetail";
import getUserBetsEvent from "./bets/getUserBetByEvent";
import GetReportsTransaction from "./reports/getReportsTransactionSaga";
import getUserExposure from "./users/getUserExposureSaga";
import getFancyMarkets from "./markets/getFancyMarkets";
import Settlement from "./settlement/settlementSaga";
import GetDashboardData from "./dashboard/getDashboardDataSaga";
import GetBankingData from "./banking/getBankingDataSaga";
import GetSettlement from "./settlement/getSettlementSaga";
import GlobalCurrencyValue from "./currency/globalCurrencyValueSaga";
import GetInactiveLayers from "./users/getInactiveLayersSaga";
import GetAnalysisData from "./analysis/getAnalysisDataSaga";
import GetBetsAndBooks from "./bets/getBetsAndBooks";
import GetBetStatusSaga from "./bets/getBetStatusSaga";
// import UpdateCurrency from "./currency/updateCurrencySaga";
import LoginHistory from "./auth/loginHistorySaga";
import GetLeagueSetting from "./settings/getLeagueSettingSaga";
import GetMatchSetting from "./settings/getMatchSettingSaga";
import PostLeagueSetting from "./settings/postLeagueSettingSaga";
import PostMatchSetting from "./settings/postMatchSettingSaga";
import GetDbEvent from "./events/getDbEventSaga";
import GetBetByMarketType from "./bets/getBetsByMarketType";
import GetAuthDetail from "./auth/getAuthDetailSaga";
import GetCasinoBets from "./reports/getCasinoBetsSaga";
import GetCasinoBetsReport from "./reports/getCasinoBetsReportSaga";
import GetCommissionReports from "./reports/getCommissionReportsSaga";
import AddOddLimit from "./eventManagement/addOddLimitSaga";
import EventDeActivated from "./result/eventDeActivatedSaga";
import RollBack from "./result/rollBackSaga";
import DeleteMultipleEvents from "./eventManagement/deleteMultipleEventsSaga";
import GetDeletedBets from "./bets/getDeletedBetsSaga";
import GetBetFilters from "./bets/getBetFilters";
import AddBanner from "./homeSliders/addBannerSaga";
import GetBanner from "./homeSliders/getBannerSaga";
import UpdateSliderStatus from "./homeSliders/updateStatusSaga";
import DeleteSlider from "./homeSliders/deleteSliderSaga";
import AddManager from "./managers/addManagerSaga";
import GetManagers from "./managers/getManagerSaga";
import GetManagerReports from "./managers/getManagerReportSaga";
import AddWhiteLabel from "./whiteLabel/addWhiteLabelSaga";
import GetWhiteLabel from "./whiteLabel/getWhiteLabelSaga";
import CheckWhiteLabelPresence from "./whiteLabel/checkWhiteLabelPresenceSaga";
import UpdateSetting from "./settings/updateSettingSaga";
import FetchWhiteLabelData from "./whiteLabel/fetchWhiteLabelData";
import ChangeBetfairCurrency from "./currency/changeBetfairCurrency";
import updateBetfairShare from "./users/updateBetfairShares";
import updateCommissionPercentage from "./users/updateCommissionPercentageSaga";
import GetBetfairCountry from "./countries/getBetfairCountries";
import GetBetfairVenues from "./venues/getVenues";
import GetBetfairTimeRange from "./timeRanges/getBetfairTimeRanges";
import GetTvUrl from "./live/getTvUrlSaga";
import UpdateRadarId from "./eventManagement/updateRadarIDSaga";
import AddRaceEvents from "./events/addRaceEvents";
import SsoId from "./ssoId/ssoIdSaga";
import BetxExchangeSsoId from "./ssoId/betxExchangeSsoIdSaga"
import SetPriorityLineMarketSaga from "./markets/setPriorityLineMarketSaga";
import GetPriorityEventMarketSaga from "./markets/getPriorityEventMarketSaga";
import SetCommissionValue from "./commission/setCommissionValue";
import CurrentCommissionStatus from "./commission/currentCommissionStatus";
import LiveExposureData from "./dashboard/getLiveExposureSaga";

import TwoFactorStatusUpdateSaga from "./TwoFA/TwoFactorStatusUpdateSaga";
import VerifyTwoFactorCodeSaga from "./TwoFA/VerifyTwoFactorCodeSaga";
import GoogleLoginValidationSaga from "./TwoFA/googleLoginValidationSaga";
import GetFancyStakeLimitSaga from "./settings/getFancyStakeSettingSaga";
import UpdateFancyStakeLimitSaga from "./settings/updateFancyStakeSettingSaga";

import GenerateQRCodeSaga from "./TwoFA/GenerateQRCodeSaga";
import GoogleAuthenticatorOTPValidationSaga from "./TwoFA/GoogleAuthenticatorOTPValidationSaga";

import GetLineMarket from "./eventManagement/getLineMarketSaga";
import AddNewMarket from "./eventManagement/addNewMarketSaga";
import ApkUploadSaga from "./APK/apkUploadSaga";
import GetBetfairBalance from "./dashboard/getBetfairBalanceSaga"
import GetSportsDataWithPrioritySaga from "./homeSliders/getSportsDataWithPrioritySaga";
import SetSportsDataWithPrioritySaga from "./homeSliders/setSportsDataWithPrioritySaga";

import GetLeagueDataWithPrioritySaga from "./homeSliders/getLeagueDataWithPrioritySaga";
import SetLeagueDataWithPrioritySaga from "./homeSliders/setLeagueDataWithPrioritySaga";
import postNotificationSaga from "./notification/postNotificationSaga";
import getAllusersSaga from "./notification/getAllusersSaga";
import deleteNotificationSaga from "./notification/deleteNotificationSaga";
import editNotificationSaga from "./notification/editNotificationSaga";
import errorBets from "./bets/deletedBetsSaga";
import ChangeErrorBetStatusSaga from "./bets/ChangeStatusErrorBetSaga";
import RestrictClientBetsSaga from "./restrictClientBets/restrictClientBetsSaga";
import BetfairEngineSaga from "./betFairEngine/betFairEngineSaga";
import GetEventLeagueDataSaga from "./eventManagement/getEventLeagueDataSaga";
import DeleteEventsDataSaga from "./eventManagement/deleteEventsDataSaga";
import SearchBasedOnEventsSaga from "./eventManagement/SearchBasedOnEventsSaga";
import LayerCurrency from "./currency/layerCurrencySaga";

import GetEventBasedBets from "./marketAnalysis/getEventBasedBets";
import GetBetsByMarketIdSaga from "./marketAnalysis/getBetsByMarketIdSaga";
import GetMarketAnalysisDataSaga from "./marketAnalysis/getMarketAnalysisDataSaga";
import GetEventSearchResult from "./marketAnalysis/getEventSearchResult";
import ChannelCode from "./eventManagement/updateChannelCodeSaga";
import DashBoardDetails from "./dashboard/getDashBoardDetailsDataSaga";
import AddAllEventsHorseRace from "./horseRace/addRaceEventAll";
import UpdateClientShares from "./users/updateClientSharesSaga";
import GetBetsOfRunningMarket from "./bets/getBetsOfRunningMarketSaga";
import GetViewBetsOfRunningMarket from "./bets/getViewBetsOfRunningMarketSaga";
import GetCasinoTransaction from "./reports/getCasinoTransactionSaga";
import GetLayersForManager from "./users/getLayersForManagerSaga";
import UpdateLayersForManager from "./users/updateLayersForManagerSaga";
import ClientSettlement from "./users/clientSettlementSaga";
import SettlementRollback from "./result/settlementRollBackSaga";
import AddGroupName from "./users/addGroupNameSaga";
import GetUsersGroupNameSaga from "./users/getUsersGroupNameSaga";
import clientSettlementCompletedUpdation from "./users/clientSettlementCompletedUpdation";
import TransactionStatusSaga from "./transaction/TransactionStatusSaga";
import AddDataSaga from "./banking/addBankSaga";
import DeleteBankSaga from "./banking/deleteBankDataSaga";
import GetBankSaga from "./banking/getBankSaga";
import GetBankingDataSaga from "./banking/getBankingDataSaga";
import DepositListFilterSaga from "./deposit/depositListFilterSaga";
import GetDepositListSaga from "./deposit/getDepositListSaga";
import AddHelpline from "./helpline/addHelplineSaga";
import GetHelpline from "./helpline/getHelplineSaga";
import DeleteHelpline from "./helpline/deleteHelplineSaga";
import UpdateBonus from "./users/updateBonusSaga";
import Bonus from "./bonus/bonusSaga";
import GetLineMarketBets from "./bets/getLineMarketBetsSaga";
import GetFancyMarketBets from "./bets/getFancyMarketBetsSaga";

import UpdateCryptoPaymentManualSaga from "./cryptoPayment/updateCryptoPaymentManualSaga";

export default function* rootSaga() {
  yield all([
    Login(),
    TwoAuthenticationSaga(),
    Client2FADetails(),
    TwoFactorialToggleSettingsSaga(),
    LoginHistory(),
    Logout(),
    GetLayers(),
    AddCurrency(),
    GetCurrency(),
    addLayer(),
    GetSports(),
    GetLeagues(),
    GetEvents(),
    GetEventsForReportAnalysisSaga(),
    GetLeaguesForReportAnalysisSaga(),
    GetMarkets(),
    AddPanel(),
    ManageEvents(),
    GetDbSports(),
    UpdateEventManagementDatas(),
    GetRunner(),
    GetDbLeagues(),
    GetDbRunners(),
    AddResult(),
    GetResult(),
    GetSportSettings(),
    PostSportSettings(),
    GetAllBets(),
    DeleteUserBet(),
    GlobalMarketCode(),
    GetEventMarkets(),
    AddDeposit(),
    AddWithdrawal(),
    Getwithdrawal(),
    GetUserBalance(),
    addPermission(),
    addCreditReference(),
    resetPassword(),
    changePassword(),
    GetResultTransaction(),
    GetResultTransactionDetail(),
    getUserBetsEvent(),
    GetReportsTransaction(),
    getUserExposure(),
    getFancyMarkets(),
    Settlement(),
    GetDashboardData(),
    GetBetfairBalance(),
    GetBankingData(),
    GetSettlement(),
    GlobalCurrencyValue(),
    GetInactiveLayers(),
    GetAnalysisData(),
    GetBetsAndBooks(),
    GetBetStatusSaga(),
    GetLeagueSetting(),
    GetMatchSetting(),
    PostLeagueSetting(),
    PostMatchSetting(),
    GetDbEvent(),
    GetBetByMarketType(),
    GetAuthDetail(),
    GetCasinoBets(),
    GetCasinoBetsReport(),
    GetCommissionReports(),
    AddOddLimit(),
    EventDeActivated(),
    RollBack(),
    DeleteMultipleEvents(),
    GetDeletedBets(),
    GetBetFilters(),
    AddBanner(),
    GetBanner(),
    UpdateSliderStatus(),
    DeleteSlider(),
    AddManager(),
    GetManagers(),
    GetManagerReports(),
    AddWhiteLabel(),
    GetWhiteLabel(),
    CheckWhiteLabelPresence(),
    UpdateSetting(),
    FetchWhiteLabelData(),
    ChangeBetfairCurrency(),
    updateBetfairShare(),
    updateCommissionPercentage(),
    GetBetfairCountry(),
    GetBetfairVenues(),
    GetBetfairTimeRange(),
    GetTvUrl(),
    UpdateRadarId(),
    AddRaceEvents(),
    SsoId(),
    BetxExchangeSsoId(),
    SetPriorityLineMarketSaga(),
    GetPriorityEventMarketSaga(),
    SetCommissionValue(),
    CurrentCommissionStatus(),
    LiveExposureData(),
    TwoFactorStatusUpdateSaga(),
    VerifyTwoFactorCodeSaga(),
    GoogleLoginValidationSaga(),
    GetFancyStakeLimitSaga(),
    UpdateFancyStakeLimitSaga(),
    GoogleAuthenticatorOTPValidationSaga(),
    GenerateQRCodeSaga(),
    GetLineMarket(),
    AddNewMarket(),
    ApkUploadSaga(),
    GetSportsDataWithPrioritySaga(),
    SetSportsDataWithPrioritySaga(),
    GetLeagueDataWithPrioritySaga(),
    SetLeagueDataWithPrioritySaga(),
    postNotificationSaga(),
    getAllusersSaga(),
    deleteNotificationSaga(),
    editNotificationSaga(),
    errorBets(),
    ChangeErrorBetStatusSaga(),
    RestrictClientBetsSaga(),
    BetfairEngineSaga(),
    GetEventLeagueDataSaga(),
    DeleteEventsDataSaga(),
    SearchBasedOnEventsSaga(),
    LayerCurrency(),
    GetEventBasedBets(),
    GetBetsByMarketIdSaga(),
    GetMarketAnalysisDataSaga(),
    GetEventSearchResult(),
    ChannelCode(),
    DashBoardDetails(),
    AddAllEventsHorseRace(),
    UpdateClientShares(),
    GetBetsOfRunningMarket(),
    GetViewBetsOfRunningMarket(),
    GetCasinoTransaction(),
    GetLayersForManager(),
    UpdateLayersForManager(),
    ClientSettlement(),
    SettlementRollback(),
    AddGroupName(),
    GetUsersGroupNameSaga(),
    clientSettlementCompletedUpdation(),
    TransactionStatusSaga(),
    AddDataSaga(),
    DeleteBankSaga(),
    GetBankSaga(),
    GetBankingDataSaga(),
    DepositListFilterSaga(),
    GetDepositListSaga(),
    AddHelpline(),
    GetHelpline(),
    DeleteHelpline(),
    UpdateBonus(),
    Bonus(),
    GetLineMarketBets(),
    GetFancyMarketBets(),
    UpdateCryptoPaymentManualSaga(),
  ]);
}
