import localStorage from '../lib/local-storage'
import store from '@/store/index';
import { queryDnaSamples } from "@/lib/polkadotProvider/query/geneticTesting";
import { getLocation } from "@/lib/api";

export async function getStatusAllOrder(orderHistory) {
  const api = store.getters['substrate/getAPI'];
  let dataStatus = [];
  for (let i = 0; i < orderHistory.length; i++) {
    if (orderHistory[i].status == "Paid") {
      const dnaTestResults = await queryDnaSamples(
        api,
        orderHistory[i].dna_sample_tracking_id
      );

      if (dnaTestResults != null) {
        dataStatus.push(dnaTestResults.status);
      } else {
        dataStatus.push(orderHistory[i].status);
      }
    } else {
      dataStatus.push(orderHistory[i].status);
    }
  }
  return dataStatus;
}

export async function getStatusOrder(order) {
  const api = store.getters['substrate/getAPI'];
  let dataStatus = "";
  if (order.status == "Paid") {
    const dnaTestResults = await queryDnaSamples(
      api,
      order.dna_sample_tracking_id
    );
    if (dnaTestResults != null) {
      dataStatus = dnaTestResults.status;
    } else {
      dataStatus = order.status;
    }
  } else {
    dataStatus = order.status;
  }
  return dataStatus;
}

export async function getDataLocation(country, region, city) {
  const countries = store.getters['auth/getCountryData'];
  let fCountry = "";
  let fRegion = "";
  let fCity = "";
  const resultCountry = countries.find(function (data) {
    return data.code == country;
  });
  if (resultCountry != undefined) {
    fCountry = resultCountry.name;

    const regions = await getLocation(resultCountry.code, null);
    const resultRegions = regions.find(function (data) {
      return data.code.trim() == region;
    });
    if (resultRegions != undefined) {
      fRegion = resultRegions.name;

      const cities = await getLocation(
        resultCountry.code,
        resultRegions.code
      );
      const resultCities = cities.find(function (data) {
        return data.code.trim() == city;
      });

      if (resultCities != undefined) {
        fCity = resultCities.name;
      }
    }
  }
  return fCity + ", " + fRegion + ", " + fCountry;
}

const globalFunctions = {
  hasStatusLogin() {
    const keystore = localStorage.getAddress()
    return !!keystore
  },
  async checkIsLoggedIn(to, from, next) {
    let api = store.getters['substrate/getAPI'];
    if (api == null) {
      await store.dispatch('substrate/connect');
    }

    let wallet = store.getters['substrate/wallet'];
    const keystore = localStorage.getAddress()
    const isLoggedIn = !!keystore;
    const address = localStorage.getAddress();
    if (to.path == '/login') {
      if (isLoggedIn) {
        if (wallet == null) {
          if (address != "") {
            await store.dispatch('substrate/getAkun', {
              address: address
            })
          }
        }
        next('/')
        return address;
      } else {
        next()
        return ""
      }
    } else {
      if (isLoggedIn) {
        if (wallet == null) {
          if (address != "") {
            await store.dispatch('substrate/getAkun', {
              address: address
            })
          }
        }
        next()
        return address;
      } else {
        next('/login')
        return ""
      }
    }
  },
}

export default globalFunctions
