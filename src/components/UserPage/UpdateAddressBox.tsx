import React, { FC, useEffect, useState } from 'react'
import { AuthHydration } from '@src/stores/auth.store'
import { flowResult } from 'mobx'
import province from '@src/helpers/dataMap/province.json'
import district from '@src/helpers/dataMap/district.json'
import ward from '@src/helpers/dataMap/ward.json'
import { toastUtil } from '@src/helpers/Toast'
const provincelist = province.RECORDS
const districtlistAll = district.RECORDS
const wardlistAll = ward.RECORDS

interface UpdateAddressBoxProps {
  authStore?: AuthHydration
}

const UpdateAddressBox: FC<UpdateAddressBoxProps> = (props: UpdateAddressBoxProps) => {
  const { authStore } = props
  const [address, setAddress] = useState<string>(authStore?.auth?.address ?? '')
  const [provinceId, setProvinceId] = useState<number>(authStore?.auth?.provinceId ?? 0)
  const [districtId, setDistrictId] = useState<number>(authStore?.auth?.districtId ?? 0)
  const [districtList, setDistrictList] = useState([])
  const [wardId, setWardId] = useState<number>(authStore?.auth?.wardId ?? 0)
  const [wardList, setWardList] = useState([])

  useEffect(() => {
    const listDistrict = districtlistAll
      .filter((item) => parseInt(item.province) === provinceId)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    setDistrictList(listDistrict)
  }, [provinceId])

  useEffect(() => {
    const listWard = wardlistAll
      .filter((item) => parseInt(item.district) === districtId)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    setWardList(listWard)
  }, [districtId])

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAddress(val)
  }
  const handleProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setProvinceId(parseInt(val))
    setDistrictId(0)
    setWardId(0)
  }
  const handleDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDistrictId(parseInt(val))
    setWardId(0)
  }
  const handleWard = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setWardId(parseInt(val))
  }
  const updateUser = async () => {
    if (!address || !provinceId || !districtId || !wardId) {
      toastUtil.error('Vui lòng cập nhập các trường cần thay đổi thông tin')
    } else {
      const resUpdate = await flowResult<any>(
        authStore.updateCustomerInfo?.({
          address,
          provinceId,
          districtId,
          wardId,
        })
      )
      if (resUpdate.code != 0) {
        toastUtil.error(resUpdate.message || 'Hệ thống đang bận, vui lòng thực hiện sau')
      } else {
        toastUtil.success(resUpdate.message || 'Xác thực thành công!')
        authStore?.setAuth({
          auth: {
            ...authStore.auth,
            address: resUpdate.customerInfo.address,
            provinceId: resUpdate.customerInfo.provinceId,
            districtId: resUpdate.customerInfo.districtId,
            wardId: resUpdate.customerInfo.wardId,
          },
        })
      }
    }
  }

  return (
    <div className="md-userpage-address">
      <div className="md-userpage-address__box">
        <div className="is-title">Địa chỉ giao hàng</div>
        <div className="is-form">
          <div className="is-text">
            <div className="form-group">
              <input
                value={address}
                className="form-control"
                onChange={handleAddress}
                placeholder="Số nhà, toà nhà, tên đường"
              />
            </div>
          </div>
          <div className="is-row clearfix">
            <div className="form-group is-dropdown-nav">
              <select
                value={provinceId}
                onChange={handleProvince}
                className={`form-control ${provinceId ? 'active' : ''}`}
              >
                <option style={{ color: '#a8a8a8' }} value={0}>
                  Tỉnh/Thành phố
                </option>
                {provincelist.map((s) => (
                  <option style={{ color: '#f7942' }} key={parseInt(s.id, 10)} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group is-dropdown-nav">
              <select
                value={districtId}
                onChange={handleDistrict}
                className={`form-control ${districtId ? 'active' : ''}`}
              >
                <option style={{ color: '#a8a8a8' }} value={0}>
                  Quận/Huyện
                </option>
                {districtList.map((s) => (
                  <option style={{ color: '#f7942' }} key={parseInt(s.id, 10)} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group is-dropdown-nav">
              <select value={wardId} onChange={handleWard} className={`form-control ${wardId ? 'active' : ''}`}>
                <option style={{ color: '#a8a8a8' }} value={0}>
                  Phường/Xã
                </option>
                {wardList.map((s) => (
                  <option style={{ color: '#f7942' }} key={parseInt(s.id, 10)} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="is-btn">
          <button onClick={updateUser} className="btn btn-secondary">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateAddressBox
