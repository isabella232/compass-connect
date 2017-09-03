const React = require('react');
const PropTypes = require('prop-types');
const isEmpty = require('lodash.isempty');
const Actions = require('../../actions');
const FormItemInput = require('./form-item-input');

const DEFAULT_SSH_TUNNEL_PORT = 22;

class SSHTunnelPasswordValidation extends React.Component {

  constructor(props) {
    super(props);
    this.isSSHTunnelPortChanged = false;
  }

  onSSHTunnelHostnameChanged(evt) {
    Actions.onSSHTunnelHostnameChanged(evt.target.value);
  }

  onSSHTunnelUsernameChanged(evt) {
    Actions.onSSHTunnelUsernameChanged(evt.target.value);
  }

  onSSHTunnelPasswordChanged(evt) {
    Actions.onSSHTunnelPasswordChanged(evt.target.value);
  }

  onSSHTunnelPortChanged(evt) {
    const value = evt.target.value;
    if (value === '') {
      this.isSSHTunnelPortChanged = false;
    } else {
      this.isSSHTunnelPortChanged = true;
    }
    Actions.onSSHTunnelPortChanged(value);
  }

  getPort() {
    const connection = this.props.currentConnection;
    if (!connection.last_used && !this.isSSHTunnelPortChanged &&
        connection.ssh_tunnel_port === DEFAULT_SSH_TUNNEL_PORT) {
      return '';
    }
    return connection.ssh_tunnel_port;
  }

  getHostnameError() {
    if (this._isInvalid(this.props.currentConnection.ssh_tunnel_hostname)) {
      return 'SSH hostname is required';
    }
  }

  getPortError() {
    if (this._isInvalid(this.props.currentConnection.ssh_tunnel_port)) {
      return 'SSH tunnel port is required';
    }
  }

  getUsernameError() {
    if (this._isInvalid(this.props.currentConnection.ssh_tunnel_username)) {
      return 'SSH username is required';
    }
  }

  getPasswordError() {
    if (this._isInvalid(this.props.currentConnection.ssh_tunnel_password)) {
      return 'SSH password is required';
    }
  }

  _isInvalid(field) {
    return !this.props.isValid && isEmpty(field);
  }

  render() {
    return (
      <div id="ssh_tunnel_password" className="form-group">
        <FormItemInput
          label="SSH Hostname"
          name="ssh_tunnel_hostname"
          error={this.getHostnameError()}
          changeHandler={this.onSSHTunnelHostnameChanged.bind(this)}
          value={this.props.currentConnection.ssh_tunnel_hostname || ''}
          link="https://docs.mongodb.com/compass/current/connect" />
        <FormItemInput
          label="SSH Tunnel Port"
          name="ssh_tunnel_port"
          error={this.getPortError()}
          changeHandler={this.onSSHTunnelPortChanged.bind(this)}
          value={this.getPort()} />
        <FormItemInput
          label="SSH Username"
          name="ssh_tunnel_username"
          error={this.getUsernameError()}
          changeHandler={this.onSSHTunnelUsernameChanged.bind(this)}
          value={this.props.currentConnection.ssh_tunnel_username || ''} />
        <FormItemInput
          label="SSH Password"
          name="ssh_tunnel_password"
          error={this.getPasswordError()}
          changeHandler={this.onSSHTunnelPasswordChanged.bind(this)}
          value={this.props.currentConnection.ssh_tunnel_password || ''} />
      </div>
    );
  }
}

SSHTunnelPasswordValidation.propTypes = {
  currentConnection: PropTypes.object.isRequired,
  isValid: PropTypes.bool
};

SSHTunnelPasswordValidation.displayName = 'SSHTunnelPasswordValidation';

module.exports = SSHTunnelPasswordValidation;