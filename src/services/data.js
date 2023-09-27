import axios from './axios'

class DataService {
  /** get page details based on Org key */
  getPageData = async (org_key) => {
    return await axios.get(`/api/pages/${org_key}`)
  }

  /**get the list of org keys */
  getOrgKey = async () => {
    return await axios.get(`/api/keys`)
  }

  /**Create page deatils*/
  createPageData = async (data) => {
    return await axios.post(`/api/pages`, { data })
  }
  /**Update page deatils*/
  updatePageData = async (data) => {
    return await axios.patch(`/api/pages`, { data })
  }

  login = () => {
    return window.open('/auth/login', '_self', 'noopener');
  }

}

export default new DataService()
