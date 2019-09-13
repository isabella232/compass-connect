import React from 'react';
import PropTypes from 'prop-types';
import Actions from 'actions';
import { InfoSprinkle } from 'hadron-react-components';
import debounce from 'lodash.debounce';
import classnames from 'classnames';

import styles from '../connect.less';

/**
 * A connection string placeholder.
 */
const PLACEHOLDER = 'e.g. mongodb+srv://username:password@cluster0-jtpxd.mongodb.net/admin';

/**
 * A link for the info sprinkle.
 */
const CONNECTION_STRING_LINK = 'https://docs.mongodb.com/manual/reference/connection-string/';

class ConnectionStringInput extends React.PureComponent {
  static displayName = 'DriverUrlInput';

  static propTypes = { customUrl: PropTypes.string };

  constructor(props) {
    super(props);
    this.validateConnectionString = debounce(Actions.validateConnectionString, 550);
  }

  /**
   * Visits external page.
   */
  onExternalLinkClicked() {
    Actions.onExternalLinkClicked(CONNECTION_STRING_LINK);
  }

  /**
   * Handles a connection string change.
   *
   * @param {Object} evt - evt.
   */
  onCustomUrlChanged(evt) {
    const customUrl = evt.target.value.trim();

    Actions.onCustomUrlChanged(customUrl);

    this.validateConnectionString();
  }

  /**
   * Gets customUrl.
   *
   * @returns {String} customUrl.
   */
  getCustomUrl() {
    return this.props.customUrl;
  }

  render() {
    return (
      <div className={classnames(styles['connect-string-item'])}>
        <label>
          <span>Paste your connection string (SRV or Standard <InfoSprinkle
            helpLink={CONNECTION_STRING_LINK}
            onClickHandler={this.onExternalLinkClicked.bind(this)} />)</span>
        </label>
        <input
          name="connectionString"
          placeholder={PLACEHOLDER}
          className={classnames(styles['form-control'])}
          value={this.getCustomUrl()}
          onChange={this.onCustomUrlChanged.bind(this)} />
      </div>
    );
  }
}

export default ConnectionStringInput;
