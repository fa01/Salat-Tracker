import React from 'react';
import { Container, Content, Text, Icon, Picker, Form } from 'native-base';
import { AreaChart, ProgressCircle } from 'react-native-svg-charts';
import { Circle } from 'react-native-svg';
import { View } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import platform from '../../../native-base-theme/variables/commonColor';
import Spacer from './Spacer';

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      habitSelected: this.props.habits[0].key,
      habitData: this.props.habits[0],
    };
  }

  onValueChange(value) {
    this.setState({
      habitSelected: value,
      habitData: this.props.habits.find(h => h.key === value),
    });
  }

  render() {
    const { habits } = this.props;
    const {
      fontSizeH1, lineHeightH1, fontFamilyH1, textColor,
    } = platform;

    const commitsData = [
      { date: '2017-01-02', count: 1 },
      { date: '2017-01-03', count: 2 },
      { date: '2017-01-04', count: 3 },
      { date: '2017-01-05', count: 4 },
      { date: '2017-01-06', count: 5 },
      { date: '2017-01-30', count: 2 },
      { date: '2017-01-31', count: 3 },
      { date: '2017-03-01', count: 2 },
      { date: '2017-04-02', count: 4 },
      { date: '2017-03-05', count: 2 },
      { date: '2017-02-30', count: 4 },
    ];

    return (
      <Container>
        <Content padder>
          <Form>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              headerStyle={{ backgroundColor: '#48914D' }}
              textStyle={{
                paddingLeft: 0,
                color: textColor,
                fontSize: fontSizeH1,
                lineHeight: lineHeightH1,
                fontFamily: fontFamilyH1,
              }}
              selectedValue={this.state.habitSelected}
              onValueChange={this.onValueChange}
            >
              {habits.map((habit =>
                <Picker.Item label={habit.title} value={habit.key} key={habit.key} />
              ))}
            </Picker>
          </Form>
          <Spacer size={10} />
          <View style={{
            flex: 1,
            flexDirection: 'row',
            height: 50,
            justifyContent: 'space-between',
            }}
          >
            <View style={{
              flex: 1,
              flexDirection: 'column',
              height: 50,
              justifyContent: 'center',
              }}
            >
              <Text> Weekly target 7 days a week </Text>
            </View>
            <ProgressCircle
              style={{ height: 50, width: 50 }}
              progress={5 / 7}
              progressColor="rgb(134, 65, 244)"
              strokeWidth={10}
            />
          </View>
          <Spacer size={30} />
          <View style={{
              flex: 1, flexDirection: 'row', height: 50, justifyContent: 'space-between',
            }}
          >
            <View style={{
              flex: 1, flexDirection: 'column', height: 50, justifyContent: 'center',
              }}
            >
              <Text>
                Actual average 7 days a week
              </Text>
            </View>
            <ProgressCircle
              style={{ height: 50, width: 50 }}
              progress={5 / 7}
              progressColor="rgb(134, 65, 244)"
              strokeWidth={10}
            />
          </View>

          <Spacer size={30} />

          <AreaChart
            style={{ height: 200 }}
            data={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]}
            svg={{ fill: 'rgba(134, 65, 244, 0.2)' }}
            contentInset={{ top: 20, bottom: 30 }}
            renderDecorator={({
              x, y, index, value,
            }) => (
              <Circle
                key={index}
                cx={x(index)}
                cy={y(value)}
                r={4}
                stroke="rgb(134, 65, 244)"
                fill="white"
              />
            )}
          />
          <ContributionGraph
            values={commitsData}
            endDate={new Date('2017-04-01')}
            numDays={105}
            width={400}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
          />

        </Content>
      </Container>
    );
  }
}

Analytics.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  habits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};


Analytics.defaultProps = {
  error: null,
  reFetch: null,
};

export default Analytics;
