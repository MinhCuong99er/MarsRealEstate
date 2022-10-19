import provinceData from './newMap/province.json'
import districtData from './newMap/district.json'
import wardData from './newMap/ward.json'

const provincelist = provinceData.RECORDS
const districtlistAll = districtData.RECORDS
const wardlistAll = wardData.RECORDS

export const getProvinceInfo = (id) => {
  if (id == null || id == 0) {
    return {}
  }
  return provincelist.find((i) => `${i.id}` == `${id}`)
}

export const getDistrictInfo = (id) => {
  if (id == null || id == 0) {
    return {}
  }
  return districtlistAll.find((i) => `${i.id}` == `${id}`)
}

export const getWardInfo = (id) => {
  if (id == null || id == 0) {
    return {}
  }
  return wardlistAll.find((i) => `${i.id}` == `${id}`)
}
