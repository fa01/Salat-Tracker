import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

const Analytics = (props) => {
  console.log('props = ', props);
  const { Layout, habits, match } = props;
  console.log('match = ', match);
  return (
    <Layout
      error={habits.error}
      loading={habits.loading}
      habits={habits.habits}
    />
    // <View>
    //   lol
    // </View>
  );
};

Analytics.propTypes = {
  Layout: PropTypes.func.isRequired,
  habits: PropTypes.shape({
    habitCreatedKey: PropTypes.string,
    habitOrder: PropTypes.array,
    habits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

Analytics.defaultProps = {
  match: null,
};

const mapStateToProps = state => ({
  habits: state.habits || {},
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
