import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
import moment from 'moment';
import Actions from 'actions';
import classnames from 'classnames';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import styles from './sidebar.less';

const TWO_DAYS = 24 * 60 * 60 * 1000;

class Favorites extends React.Component {
  static displayName = 'Favorites';

  static propTypes = {
    currentConnection: PropTypes.object.isRequired,
    connections: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired
  };

  /**
   * Selects a favorite connection.
   *
   * @param {Object} favorite - A favorite connection.
   */
  onFavoriteClicked(favorite) {
    Actions.onFavoriteSelected(favorite);
  }

  /**
   * Copies a favorite connection.
   *
   * @param {Object} favorite - A favorite connection.
   * @param {Object} evt - evt.
   */
  onCopyConnectionClicked(favorite, evt) {
    evt.stopPropagation();
    Actions.onCopyConnectionClicked(favorite);
  }

  /**
   * Deletes a favorite connection.
   *
   * @param {Object} favorite - A favorite connection.
   */
  onRemoveConnectionClicked(favorite) {
    Actions.onDeleteConnectionClicked(favorite);
  }

  /**
   * Opens a modal for editing a favorite connection.
   */
  onEditConnectionClicked() {
    Actions.showFavoriteModal();
  }

  /**
   * Gets a proper class name for active and not active favorite connections.
   *
   * @param {Object} favorite - A favorite connection.
   *
   * @returns {String} - A class name
   */
  getClassName(favorite) {
    const classnamesProps = [styles['connect-sidebar-list-item']];

    if (this.props.currentConnection === favorite) {
      classnamesProps.push(styles['connect-sidebar-list-item-is-active']);
    }

    return classnames(...classnamesProps);
  }

  /**
   * Formats lastUsed.
   *
   * @param {Object} model - A connection model.
   *
   * @returns {String} - A last used moment.
   */
  formatLastUsed(model) {
    if (!model.lastUsed) {
      return 'Never';
    }

    if ((new Date() - model.lastUsed) < TWO_DAYS) {
      return moment(model.lastUsed).fromNow();
    }

    return moment(model.lastUsed).format('lll');
  }

  /**
   * Render favorite connections.
   *
   * @returns {React.Component}
   */
  renderFavorites() {
    const favorites = this.props.connections
      .filter((connection) => connection.isFavorite);

    return map(favorites, (favorite, i) => {
      const title = `${favorite.hostname}:${favorite.port}`;
      const style = favorite.color
        ? { borderRight: `5px solid ${favorite.color}` }
        : {};

      return (
        <li
          className={this.getClassName(favorite)}
          style={style}
          key={i}
          title={title}
          onClick={this.onFavoriteClicked.bind(this, favorite)}>
          <div className={classnames(styles['connect-sidebar-list-item-details'])}>
            <div className={classnames(styles['connect-sidebar-list-item-last-used'])}>
              {this.formatLastUsed(favorite)}
            </div>
            <div
              className={classnames(styles['connect-sidebar-list-item-name'])} >
              {favorite.name}
            </div>
          </div>
          <DropdownButton
            bsSize="xsmall"
            bsStyle="link"
            title="&hellip;"
            className={classnames(styles['connect-sidebar-list-item-actions'])}
            noCaret
            pullRight
            id="favorite-actions">
            <MenuItem eventKey="1" onClick={this.onCopyConnectionClicked.bind(this, favorite)}>Copy</MenuItem>
            <MenuItem eventKey="2" onClick={this.onEditConnectionClicked.bind(this, favorite)}>Edit</MenuItem>
            <MenuItem eventKey="3" onClick={this.onRemoveConnectionClicked.bind(this, favorite)}>Remove</MenuItem>
          </DropdownButton>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="connect-sidebar-connections-favorites">
        <div className={classnames(styles['connect-sidebar-header'])}>
          <i className="fa fa-fw fa-star" />
          <span>Favorites</span>
        </div>
        <ul className={classnames(styles['connect-sidebar-list'])}>
          {this.renderFavorites()}
        </ul>
      </div>
    );
  }
}

export default Favorites;
