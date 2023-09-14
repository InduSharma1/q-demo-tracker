import axios from './axios'

class DataService {
  /** get page details based on Org key */
  getPageData = async (org_key) => {
    return await axios.get(`/api/pageDetails/${org_key}`)
  }

  /**get the list of org keys */
  getOrgKey = async () => {
    return await axios.get(`/api/keys`)
  }

  /**Create page deatils*/
  createPageData = async (data) => {
    return await axios.post(`/api/createPageDetails`, { data })
  }
  /**Update page deatils*/
  updatePageData = async (data) => {
    return await axios.post(`/api/updatePageDetails`, { data })
  }
  /**Upsert page deatils*/
  upsertPageData = async (data) => {
    return await axios.post(`/api/pageDetails`, { data })
  }

  /** send request to the mixpanel to track events */
  trackMixpanel = async (props) => {
    return await axios.post(`mixpanel/track`, { props });
  }
}

export default new DataService()
