import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { getHabits, formatWeek, setError, removeHabit, reorderHabits, createHabit, saveHabit, toggleHabitItemStatus, saveHabitItemNotes, clearHabitItem } from '../actions/habits';
import { generatePushID } from '../lib/helpers';

class HabitListing extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    habits: PropTypes.shape({
      habitCreatedKey: PropTypes.string,
      habitOrder: PropTypes.array,
      habitsraw: PropTypes.Object,
      habits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    getHabits: PropTypes.func.isRequired,
    toggleHabitItemStatus: PropTypes.func.isRequired,
    saveHabitItemNotes: PropTypes.func.isRequired,
    clearHabitItem: PropTypes.func.isRequired,
    reorderHabits: PropTypes.func.isRequired,
    auth: PropTypes.bool,
  }

  static defaultProps = {
    auth: false,
  }

  componentWillMount = () => {
    // console.log('inHabitListing', this.props);
    // console.log('the state', this.state);
    const habitsExist = Object.keys(this.props.habits.habitsraw).length !== 0;
    if (!habitsExist) {
      console.log('going to create initial habits');
      this.createInitialHabits();
    } else {
      this.fetchHabits();
    }
  }

  createInitialHabits = async () => {
    console.log('createInitialHabits');
    const startingDate = moment().startOf('isoweek');
    for (let i = 0; i < 5; i += 1) {
      console.log('i = ', i);
      const habitKey = generatePushID();
      await this.props.createHabit(startingDate, habitKey, i);
    }
  }

  /**
    * Fetch Data from API if logged in, then format weekly view
    */
  fetchHabits = async (date = moment()) => {
    // eslint-disable-next-line
    const { auth, getHabits, formatWeek } = this.props;
    console.log('in fetchHabits', this.state);
    if (auth) await getHabits(date);
    await formatWeek(date);
  }

  render = () => {
    // eslint-disable-next-line
    const { Layout, habits, createHabit, reorderHabits, removeHabit, saveHabit, clearHabitItem, toggleHabitItemStatus, saveHabitItemNotes, loading, formatWeek} = this.props;

    // console.log('in render for Habits container', this.props);
    return (
      <Layout
        error={habits.error}
        loading={loading}
        habits={habits.habits}
        saveHabitItemNotes={saveHabitItemNotes}
        toggleHabitItemStatus={toggleHabitItemStatus}
        clearHabitItem={clearHabitItem}
        saveHabit={saveHabit}
        reorderHabits={reorderHabits}
        createHabit={createHabit}
        removeHabit={removeHabit}
        habitCreatedKey={habits.habitCreatedKey}
        habitOrder={habits.habitOrder}
        fetchHabits={this.fetchHabits}
        formatWeek={formatWeek}
      />
    );
  }
}

const mapStateToProps = state => ({
  habits: state.habits || {},
  auth: state.member.auth,
  loading: state.status.loading,
});

const mapDispatchToProps = {
  getHabits,
  formatWeek,
  reorderHabits,
  removeHabit,
  setError,
  createHabit,
  toggleHabitItemStatus,
  saveHabitItemNotes,
  clearHabitItem,
  saveHabit,
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitListing);
