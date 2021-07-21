
import store from '@/store/index'
import axios from 'axios'

const pathLocation = "/location";

export async function getLocation(country, region) {
  let query = "";
  if (country != null) {
    query = query + "?country_code=" + country;
  }
  if (region != null) {
    query = query + "&region_code=" + region;
  }
  const baseUrl = store.getters['auth/getConfig'].apiUrl;
  const request = `${baseUrl}${pathLocation}${query}`;
  try {
    const resp = await axios.get(request);
    return resp.data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}