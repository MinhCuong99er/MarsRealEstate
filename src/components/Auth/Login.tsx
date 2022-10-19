import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import RootStore from '@src/stores/RootStore'

interface LoginProps {
  store: RootStore
}

@inject('store')
@observer
class Login extends Component<LoginProps> {
  render() {
    const { authStore } = this.props.store
    return (
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-4 offset-md-4">
            <div className="login">
              <button
                disabled={this.props.store.loading}
                className="btn btn-primary"
                onClick={() =>
                  authStore.setAuth({
                    token: 's',
                    auth: { id: 1, name: 'phong' },
                  })
                }
              >
                {this.props.store.loading ? <i className="fa fa-gear fa-spin" /> : null} Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
