import axios from 'axios'

var url = ''

if(process.env.NODE_ENV === 'development'){
  url = 'https://c116b56c9620.ngrok.io'
} else {
  url = '/api'
}

const api = () =>
  axios.create({
    baseURL: url,
    timeout: 20000,
    withCredentials: true
})

// -----------------------------Login---------------------------------------
export const apiLogin = data => api().post('/user/login', data)
export const apiLogout = () => api().get('/user/logout')
export const apiSessionVerify = () => api().get('/user/session')
// -----------------------------Company Management--------------------------
export const apiCompanyCreate = data => api().post('/companies/create', data)
export const apiCompanyGet = () => api().get('/companies/list')
// -----------------------------Users Management----------------------------
export const apiUserList = () => api().get('/user/list')
export const apiUserStatus = data => api().post('/user/changeStatus', data)
export const apiUserCreate = data => api().post('/user/create', data)
export const apiUserUpdate = data => api().post('/user/update', data)
export const apiUserPermissions = () => api().get('/user/permissions')
export const apiUserFind = data => api().post('/user/find', data)
// -----------------------------Wallet Management---------------------------
export const apiWalletCreate = data => api().post('/wallet/create', data)
export const apiWalletDelete = data => api().post('/wallet/delete', data)
export const apiWalletList = data => api().post('/wallet/list', data)
// -----------------------------NFSE Management-----------------------------
export const apiNfseList = () => api().get('/invoices/list')
export const apiNfseCreate = data => api().post('/invoices/create', data)
export const apiNfseCancel = data => api().post('/invoices/cancel', data)
export const apiNfseResend = data => api().post('/invoices/resend', data)
export const apiNfseUpdate = () => api().get('/invoices/update')
// -----------------------------PSP Management------------------------------
export const apiPspGet = () => api().get('/psps/list')
// -----------------------------Transaction Management----------------------
export const apiTransGetR = () => api().get('/transactions/list/REAL')
export const apiTransDataR = () => api().get('/transactions/data/REAL')
export const apiTransGetL = () => api().get('/transactions/list/LOGUS',)
export const apiTransDataL = () => api().get('/transactions/data/LOGUS',)
export const apiTransGetJ = () => api().get('/transactions/list/JARAGUA')
export const apiTransDataJ = () => api().get('/transactions/data/JARAGUA')
// -----------------------------Group Management----------------------------
export const apiGroupCreate = data => api().post('/groups/create', data)
export const apiGroupList = () => api().get('/groups/list')
export const apiGroupActionList = () => api().get('/groups/actionsData')
export const apiGroupsUpdate = data => api().post('/groups/update', data)
export const apiGroupsStatusChange = data => api().post('/groups/statusChange', data)
export const apiGroupsFind = data => api().post('/groups/find', data)
export const apiActionsList = () => api().get('/groups/actions')
export const apiGroupAction = data => api().post('/groups/groupActions', data)
// -----------------------------Log Management------------------------------
export const apiLogList = () => api().get('/logs/list')
// -----------------------------HelpDesk Management-------------------------
export const apiCreateTicket = data => api().post('/helpDesk/create', data)
export const apiEditTicket = data => api().post('/helpDesk/update', data)
export const apiListTicket = () => api().get('/helpDesk/listAll')
export const apiFindTicket = data => api().post('/helpDesk/listOne', data)
export const apiStatusFilter = data => api().get('/helpDesk/listByStatus', data)
export const apiChangeTicketStatus = data => api().post('/helpDesk/changeTicketStatus', data)
export const apiFilterTicket = data => api().post('/helpDesk/listTicketFilter', data)
export const apiChatAnswer = data => api().post('/chatHelpDesk/create', data)
export const apiChatList = data => api().post('/chatHelpDesk/list', data)
// -----------------------------Client Management---------------------------
export const apiListClient = () => api().get('/player/list')
export const apiGetClientById = data => api().post('/player/listPlayerById', data)
export const apiUpdateClient = data => api().post('/player/update', data)
export const apiUpdateBtagClient = data => api().post('/player/updatePlayerBtag', data)
export const apiGetBtag = () => api().get('/btagUser/list')




