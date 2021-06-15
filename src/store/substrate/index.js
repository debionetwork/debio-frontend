import keyring from '@polkadot/ui-keyring';
import { Keyring } from '@polkadot/keyring';
import { ApiPromise, WsProvider } from '@polkadot/api'
import types from './types.json'
import localStorage from '@/lib/local-storage'
// u8aToString, stringToU8a
import { u8aToHex } from '@polkadot/util'
import { queryEntireLabDataById } from '@/lib/polkadotProvider/query/labs'
import masterConfigEvent from "@/assets/json/config-event.json"
import { queryBalance } from "@/lib/polkadotProvider/query/balance"

const {
  mnemonicToMiniSecret,
  naclKeypairFromSeed,
  cryptoWaitReady,
} = require('@polkadot/util-crypto');

cryptoWaitReady().then(() => {
  keyring.loadAll({ ss58Format: 42, type: 'ed25519' });
});

const defaultState = {
  api: null,
  isLoadingApi: false,
  isLoadingWallet: false,
  wallet: null,
  walletBalance: null,
  walletPublicKey: '',
  labAccount: null,
  isLabAccountExist: false,
  doctorAccount: null,
  isDoctorAccountExist: false,
  hospitalAccount: null,
  isHospitalAccountExist: false,
  lastEventData: null,
  localListNotfication: [],
  configEvent: null,
  mnemonicData: null,
}

export default {
  namespaced: true,
  state: {
    ...defaultState
  },
  mutations: {
    SET_API(state, api) {
      state.api = api
    },
    SET_LOADING_API(state, isLoading) {
      state.isLoadingApi = isLoading
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    },
    SET_LAB_ACCOUNT(state, labAccount) {
      state.labAccount = labAccount
      state.isLabAccountExist = true
    },
    SET_IS_LAB_ACCOUNT_EXIST(state, isLabAccountExist) {
      state.isLabAccountExist = isLabAccountExist
    },
    SET_DOCTOR_ACCOUNT(state, doctorAccount) {
      state.doctorAccount = doctorAccount
      state.isDoctorAccountExist = true
    },
    SET_IS_DOCTOR_ACCOUNT_EXIST(state, isDoctorAccountExist) {
      state.isDoctorAccountExist = isDoctorAccountExist
    },
    SET_HOSPITAL_ACCOUNT(state, hospitalAccount) {
      state.hospitalAccount = hospitalAccount
      state.isHospitalAccountExist = true
    },
    SET_IS_HOSPITAL_ACCOUNT_EXIST(state, isHospitalAccountExist) {
      state.isHospitalAccountExist = isHospitalAccountExist
    },
    SET_LOADING_WALLET(state, isLoadingWallet) {
      state.isLoadingWallet = isLoadingWallet
    },
    SET_WALLET_BALANCE(state, balance) {
      state.walletBalance = balance
    },
    SET_WALLET_PUBLIC_KEY(state, publicKey) {
      state.walletPublicKey = publicKey
    },
    CLEAR_WALLET(state) {
      state.wallet = null
      state.walletBalance = null
    },
    SET_LAST_EVENT(state, event) {
      state.lastEventData = event
    },
    SET_LIST_NOTIFICATION(state, event) {
      state.localListNotfication = event
    },
    SET_CONFIG_EVENT(state, event) {
      state.configEvent = event
    },
    SET_MNEMONIC_DATA(state, event) {
      state.mnemonicData = event
    },
  },
  actions: {
    async connect({ commit }) {
      try {
        commit('SET_LOADING_API', true)
        const PROVIDER_SOCKET = 'wss://debio.theapps.dev/node'
        const wsProvider = new WsProvider(PROVIDER_SOCKET)
        const api = await ApiPromise.create({
          provider: wsProvider,
          types: types
        })

        // Example of how to subscribe to events via storage
        api.query.system.events((events) => {
          console.log(`\nReceived ${events.length} events:`);
          events.forEach((record) => {
            const { event, phase } = record;
            switch (event.section) {
              case "orders":
                console.log("Method :" + event.method);
                console.log(`Phase: ${phase.toString()}`)
                commit('SET_LAST_EVENT', event);
                break;
              case "geneticTesting":
                console.log("Method :" + event.method);
                console.log(`Phase: ${phase.toString()}`)
                commit('SET_LAST_EVENT', event);
                break;
              case "balances":
                console.log("Method :" + event.method);
                console.log(`Phase: ${phase.toString()}`);
                commit('SET_LAST_EVENT', event);
                break;
              default:
                console.log("event no mapping");
                break;
            }
          })
        })

        await api.isReady
        commit('SET_API', api)

        commit('SET_LOADING_API', false)
      } catch (err) {
        console.log(err)
        commit('SET_LOADING_API', false)
      }
    },
    async registerMnemonic({ commit }, { mnemonic, password, accountName }) {
      try {
        commit('SET_LOADING_WALLET', true)
        commit('CLEAR_WALLET')

        const { pair, json } = keyring.addUri(mnemonic, password, { name: accountName })
        pair.unlock(password)
        localStorage.setKeystore(JSON.stringify(json))
        localStorage.setAddress(pair.address)
        commit('SET_WALLET_PUBLIC_KEY', u8aToHex(pair.publicKey))
        console.log('Is pair locked?', pair.isLocked)
        commit('SET_WALLET', pair) // FIXME: simpen untuk dev
        commit('SET_LOADING_WALLET', false)

        const seed = mnemonicToMiniSecret(mnemonic)
        const { publicKey, secretKey } = naclKeypairFromSeed(seed)
        const dataMemonic = {
          privateKey: u8aToHex(secretKey),
          publicKey: u8aToHex(publicKey),
          mnemonic: mnemonic,
        };
        localStorage.setLocalStorageByName("mnemonic_data", JSON.stringify(dataMemonic));
        commit('SET_MNEMONIC_DATA', dataMemonic)
        return { success: true }
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING_WALLET', false)
        return { success: false, error: err.message }
      }
    },
    async restoreAccountKeystore({ commit }, { file, password }) {
      try {
        commit('SET_LOADING_WALLET', true)
        const pair = keyring.restoreAccount(file[0], password);
        pair.unlock(password)
        localStorage.setKeystore(JSON.stringify(file[0]))
        localStorage.setAddress(pair.address)
        commit('SET_WALLET_PUBLIC_KEY', u8aToHex(pair.publicKey))
        console.log('Is pair locked?', pair.isLocked)
        commit('SET_WALLET', pair)

        localStorage.setLocalStorageByName("mnemonic_data", JSON.stringify(file[1]));
        commit('SET_MNEMONIC_DATA', file[1])
        commit('SET_LOADING_WALLET', false)

        return { success: true }
      } catch (err) {
        commit('CLEAR_WALLET')
        commit('SET_LOADING_WALLET', false)
        return { success: false, error: err.message }
      }
    },
    async getAkun({ commit, state }, { address }) {
      try {
        commit('SET_LOADING_WALLET', true)
        const pair = keyring.getPair(address);
        commit('SET_WALLET_PUBLIC_KEY', u8aToHex(pair.publicKey))
        commit('SET_WALLET', pair)
        commit('SET_LOADING_WALLET', false)

        const dataMemonicJson = localStorage.getLocalStorageByName("mnemonic_data");
        if (dataMemonicJson != null && dataMemonicJson != "") {
          const dataMemonic = JSON.parse(dataMemonicJson);
          commit('SET_MNEMONIC_DATA', dataMemonic);
        }

        commit('SET_LAB_ACCOUNT', null)
        commit('SET_IS_LAB_ACCOUNT_EXIST', false)
        const labAccount = await queryEntireLabDataById(state.api, address)
        if (labAccount) {
          commit('SET_LAB_ACCOUNT', labAccount)
          commit('SET_IS_LAB_ACCOUNT_EXIST', true)
        }

        commit('SET_DOCTOR_ACCOUNT', null)
        commit('SET_IS_DOCTOR_ACCOUNT_EXIST', false)
        // const doctorAccount = await queryEntireDoctorDataById(state.api, address)
        // if (doctorAccount) {
        //   commit('SET_DOCTOR_ACCOUNT', doctorAccount)
        //   commit('SET_IS_DOCTOR_ACCOUNT_EXIST', true)
        // }

        commit('SET_HOSPITAL_ACCOUNT', null)
        commit('SET_IS_HOSPITAL_ACCOUNT_EXIST', false)
        // const hospitalAccount = await queryEntireHospitalDataById(state.api, address)
        // if (hospitalAccount) {
        //   commit('SET_HOSPITAL_ACCOUNT', hospitalAccount)
        //   commit('SET_IS_HOSPITAL_ACCOUNT_EXIST', true)
        // }

        return { success: true }
      } catch (err) {
        console.log(err)
        commit('CLEAR_WALLET')
        commit('SET_LOADING_WALLET', false)
        return { success: false, error: err.message }
      }
    },
    async getLabAccount({ commit, state }) {
      try {
        commit('SET_LAB_ACCOUNT', null)
        commit('SET_IS_LAB_ACCOUNT_EXIST', false)
        const labAccount = await queryEntireLabDataById(state.api, state.wallet.address)
        if (labAccount) {
          commit('SET_LAB_ACCOUNT', labAccount)
          commit('SET_IS_LAB_ACCOUNT_EXIST', true)
        }

        return { success: true }
      } catch (err) {
        console.log(err)
        return { success: false, error: err.message }
      }
    },
    async getDoctorAccount({ commit, state }) {
      try {
        commit('SET_DOCTOR_ACCOUNT', null)
        commit('SET_IS_DOCTOR_ACCOUNT_EXIST', false)
        console.log(state) // TODO: Remove when certification pallet added
        // const doctorAccount = await queryEntireDoctorDataById(state.api, state.wallet.address)
        // if (doctorAccount) {
        //   commit('SET_DOCTOR_ACCOUNT', doctorAccount)
        //   commit('SET_IS_DOCTOR_ACCOUNT_EXIST', true)
        // }

        return { success: true }
      } catch (err) {
        console.log(err)
        return { success: false, error: err.message }
      }
    },
    async getHospitalAccount({ commit, state }) {
      try {
        commit('SET_HOSPITAL_ACCOUNT', null)
        commit('SET_IS_HOSPITAL_ACCOUNT_EXIST', false)
        console.log(state) // TODO: Remove when certification pallet added
        // const hospitalAccount = await queryEntireHospitalDataById(state.api, state.wallet.address)
        // if (hospitalAccount) {
        //   commit('SET_HOSPITAL_ACCOUNT', hospitalAccount)
        //   commit('SET_IS_HOSPITAL_ACCOUNT_EXIST', true)
        // }

        return { success: true }
      } catch (err) {
        console.log(err)
        return { success: false, error: err.message }
      }
    },
    async checkMnemonicSomeAddress({ commit }, { mnemonic, accountAddress }) {
      try {
        const keyringX = new Keyring({ type: 'ed25519', ss58Format: 42 });
        const pair = keyringX.addFromUri(mnemonic, { name: 'first pair' }, 'ed25519');
        commit('SET_LOADING_WALLET', false)
        if (accountAddress == pair.address) {
          console.log(accountAddress);
          console.log(pair.address);
          return { success: true }
        } else {
          return { success: false }
        }

      } catch (err) {
        return { success: false }
      }
    },
    async getListNotification({ commit }, { address, role }) {
      try {
        //localStorage.removeLocalStorageByName("LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role, null);
        commit('SET_CONFIG_EVENT', masterConfigEvent);
        const listNotficationJson = localStorage.getLocalStorageByName("LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role);
        let listNotfication = [];
        if (listNotficationJson != null && listNotficationJson != "") {
          listNotfication = JSON.parse(listNotficationJson);
          listNotfication.reverse();
          //console.log(listNotfication);
        }
        commit('SET_LIST_NOTIFICATION', listNotfication);
      } catch (err) {
        console.log(err);
      }
    },
    async addListNotification({ commit, state }, { address, event, role }) {
      try {
        const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role;
        const listNotficationJson = localStorage.getLocalStorageByName(storageName);
        let listNotfication = [];
        if (listNotficationJson != null && listNotficationJson != "") {
          listNotfication = JSON.parse(listNotficationJson);
        }
        let message = state.configEvent["role"][role][event.section][event.method].message;
        const route = state.configEvent["role"][role][event.section][event.method].route;
        const value = state.configEvent["role"][role][event.section][event.method].value;
        const value_message = state.configEvent["role"][role][event.section][event.method].value_message;
        const identy = state.configEvent["role"][role][event.section][event.method].identy;
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const dataEvent = JSON.parse(event.data.toString());

        let id = "";
        let statusAdd = false;
        let data = null;
        let params = null;
        let wording = "";
        let finalText = "";
        if (dataEvent.length > 0) {
          switch (role) {
            case "customer":
              switch (event.section) {
                case "orders":
                  data = dataEvent[0];
                  id = data[value];
                  params = { number: id };
                  wording = "for (" + data[value_message].substr(0, 4) + "..." + data[value_message].substr(data[value_message].length - 4) + ")";
                  break;
                case "geneticTesting":
                  data = dataEvent[0];
                  id = data[value];
                  params = { number: id };
                  wording = "for (" + data[value_message].substr(0, 4) + "..." + data[value_message].substr(data[value_message].length - 4) + ")";
                  break;
                case "balances":
                  data = dataEvent;
                  id = data[value];
                  params = { number: id };
                  if (data[value_message].toString().includes("0x")) {
                    const decimal = parseInt(data[value_message].toString(), 16).toString();
                    finalText = decimal.replace("000000000000000", "");
                  } else {
                    finalText = data[value_message].toString().replace("000000000000000", "");
                  }
                  if (finalText != "") {
                    const balance = await queryBalance(
                      state.api,
                      state.wallet.address
                    );
                    commit('SET_WALLET_BALANCE', balance);
                  }
                  wording = finalText + " DBIO!";
                  break;
                default:
                  data = dataEvent[0];
                  id = data[value];
                  params = { number: id };
                  wording = "for (" + data[value_message].substr(0, 4) + "..." + data[value_message].substr(data[value_message].length - 4) + ")";
                  break;
              }
              break;
            case "lab":
              switch (event.section) {
                case "balances":
                  data = dataEvent;
                  id = data[value];
                  params = { number: id };
                  wording = data[value_message] + " DBIO!";
                  break;
                case "orders":
                  data = dataEvent[0];
                  params = data;
                  wording = "for (" + data[value_message].substr(0, 4) + "..." + data[value_message].substr(data[value_message].length - 4) + ")";
                  break;
                case "geneticTesting":
                  data = dataEvent[0];
                  id = data[value];
                  params = { number: id };
                  wording = "for (" + data[value_message].substr(0, 4) + "..." + data[value_message].substr(data[value_message].length - 4) + ")";
                  break;
                default:
                  data = dataEvent[0];
                  id = data[value];
                  params = { number: id };
                  wording = "for (" + data[value_message].substr(0, 4) + "..." + data[value_message].substr(data[value_message].length - 4) + ")";
                  break;
              }
              break;
            default:
              console.log("role no mapping");
              break;
          }

          if (data[identy] == address) {
            statusAdd = true;
            message = message + " " + wording;
          }
        }

        if (statusAdd) {
          listNotfication.push({
            message: message,
            timestamp: timestamp,
            data: data,
            route: route,
            params: params,
            read: false,
          });
        }
        localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotfication));
        listNotfication.reverse();
        commit('SET_LIST_NOTIFICATION', listNotfication);
      } catch (err) {
        console.log(err);
      }
    },
    async updateDataListNotification({ commit }, { address, data, role }) {
      try {
        if (data != null && data != "") {
          data.reverse();
          localStorage.setLocalStorageByName("LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role, JSON.stringify(data));
          data.reverse();
          commit('SET_LIST_NOTIFICATION', data);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  getters: {
    wallet(state) {
      return state.wallet
    },
    labAccount(state) {
      return state.labAccount
    },
    isLabAccountExist(state) {
      return state.isLabAccountExist
    },
    doctorAccount(state) {
      return state.doctorAccount
    },
    isDoctorAccountExist(state) {
      return state.isDoctorAccountExist
    },
    hospitalAccount(state) {
      return state.hospitalAccount
    },
    isHospitalAccountExist(state) {
      return state.isHospitalAccountExist
    },
    getAPI(state) {
      return state.api
    },
    getLastEvent(state) {
      return state.lastEventData
    },
    getListNotification(state) {
      state.localListNotfication
    },
    getMnemonicData(state) {
      state.mnemonicData
    }
  }
}