import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {
  counterInitialize,
  counterIncrease,
  counterDecrease,
} from '../reducers/counter/counter_actions';
import {goalsInitialize} from '../reducers/goals/goals_actions';
import {
  pointsGoalInitialize,
  pointsGoalIncrease,
} from '../reducers/pointsGoal/pointsGoal_actions';

import {
  Title,
  MainButton,
  ProgressBar,
  AlignRow,
  AppView,
} from '../components/general_components';
import SuccessModal from './SuccessModal';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      goalsList: props.goalsList,
      pointsGoal: props.pointsGoal,
      visible: false,
    };
    this.onPressIncrease = this.onPressIncrease.bind(this);
    this.onPressDecrease = this.onPressDecrease.bind(this);
    this.changeVisible = this.changeVisible.bind(this);
    this.initializeProps(props);
  }

  initializeProps(props) {
    props.counterInitialize();
    props.goalsInitialize();
    props.pointsGoalInitialize();
  }
  componentWillReceiveProps(nextProps) {
    const {count, pointsGoal, goalsList} = this.state;
    if (
      count !== nextProps.count ||
      goalsList !== nextProps.goalsList ||
      pointsGoal !== nextProps.pointsGoal
    ) {
      let {count, goalsList, pointsGoal} = nextProps;
      this.setState({count, goalsList, pointsGoal});
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) return true;
    return false;
  }

  changeVisible() {
    this.setState({visible: !this.state.visible});
  }

  formatText(progress) {
    progress = parseInt(progress * 100);
    return progress + ' %';
  }

  onPressIncrease() {
    this.props.counterIncrease();
    if (parseInt(this.state.count) + 1 === parseInt(this.props.pointsGoal)) {
      this.changeVisible();
      this.props.pointsGoalIncrease();
    }
  }
  onPressDecrease() {
    this.props.counterDecrease();
  }

  render() {
    const {goalsList, pointsGoal, count, visible} = this.state;
    const {isEmpty} = this.props;
    const progress = count / pointsGoal;
    const goalActive = Math.floor(Math.random() * goalsList.length);
    let title;
    if (isEmpty)
      title = (
        <View>
          <Title size="20px" font="Mali-Bold" margin="2px">
            New around here?
          </Title>
          <Title size="20px" font="Mali-Regular" margin="0px">
            you can slide right and go to Instructions page
          </Title>
        </View>
      );
    else title = <Title>{goalsList[goalActive]}</Title>;
    return (
      <AppView center>
        <SuccessModal
          visible={visible}
          onClose={this.changeVisible}
          goal={this.props.pointsGoal}
        />
        {title}
        <Title font="Rajdhani-Regular" size="100px">
          {parseInt(progress * 100)} %
        </Title>
        <ProgressBar
          progress={progress}
          height={50}
          borderRadius={0}
          width={progressBarWidth}
          borderWidth={2}>
          <Title font="Rajdhani-Regular" absolute>
            {count}/ {pointsGoal} pt
          </Title>
        </ProgressBar>
        <AlignRow>
          <MainButton
            onPress={this.onPressIncrease}
            text="+"
            width={progressBarWidth}
            numItems={2}
          />
          <MainButton
            text="-"
            onPress={this.onPressDecrease}
            width={progressBarWidth}
            numItems={2}
          />
        </AlignRow>
      </AppView>
    );
  }
}

const progressBarWidth = 300;
const actions = {
  counterInitialize,
  counterIncrease,
  counterDecrease,
  goalsInitialize,
  pointsGoalInitialize,
  pointsGoalIncrease,
};
const mapStateToProps = state => {
  return {
    count: state.count.count,
    goalsList: state.goalsList.goalsList,
    pointsGoal: state.pointsGoal.pointsGoal,
    isEmpty: state.goalsList.isEmpty,
  };
};

Home.propTypes = {
  goalsList: PropTypes.array,
  pointsGoal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isEmpty: PropTypes.bool,
  counterInitialize: PropTypes.func,
  counterIncrease: PropTypes.func,
  counterDecrease: PropTypes.func,
  goalsInitialize: PropTypes.func,
  pointsGoalInitialize: PropTypes.func,
  pointsGoalIncrease: PropTypes.func,
};

Home.defaultProps = {
  count: -1,
};

export default connect(
  mapStateToProps,
  actions,
)(Home);
