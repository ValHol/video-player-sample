/**
 * @flow
 */

import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Easing,
  Animated,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native'
import Video from 'react-native-video'
import Colors from '../commons/colors'

const Icons = {
  PAUSE: require('./img/ic_pause_black_48dp.png'),
  PLAY: require('./img/ic_play_arrow_black_48dp.png'),
  VOLUME: require('./img/ic_volume_up_black_48dp.png'),
  MUTE: require('./img/ic_volume_off_black_48dp.png'),
  FULL_SCREEN: require('./img/ic_fullscreen_black_48dp.png'),
  FULL_SCREEN_EXIT: require('./img/ic_fullscreen_exit_black_48dp.png')
}

export default class VideoScene extends Component {

  static propTypes = {
    course: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      loadingVideo: true,
      fullScreen: false,
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      currentPercentage: new Animated.Value(0.0),
      remainingPercentage: new Animated.Value(100.0),
      paused: false,
      portraitMode: true
    }

    this._onVideoProgress = this._onVideoProgress.bind(this)
    this._onVideoError = this._onVideoError.bind(this)
    this._onVideoEnd = this._onVideoEnd.bind(this)
    this._onVideoLoadStart = this._onVideoLoadStart.bind(this)
    this._onVideoLoadEnd = this._onVideoLoadEnd.bind(this)
    this._onVideoPressed = this._onVideoPressed.bind(this)
    this._onFullScreenPressed = this._onFullScreenPressed.bind(this)
    this._onVolumePressed = this._onVolumePressed.bind(this)
    this._onLayout = this._onLayout.bind(this)
  }

  /**
   * CALLBACKS
   */

  _onVideoPressed () {
    this.setState({
      paused: !this.state.paused
    })
  }

  _onVolumePressed () {
    this.setState({
      muted: !this.state.muted
    })
  }

  _onFullScreenPressed () {
    this.setState({
      fullScreen: !this.state.fullScreen
    })
  }

  _onVideoLoadStart () {
    this.setState({
      loadingVideo: true
    })
  }

  _onVideoLoadEnd (data) {
    this.setState({
      loadingVideo: false,
      duration: data.duration,
      currentPercentage: new Animated.Value(0.0),
      remainingPercentage: new Animated.Value(100.0)
    })
  }

  _onVideoProgress (data) {
    let currentPercentage = data.currentTime / this.state.duration * 100

    Animated.timing(
      this.state.currentPercentage,
      {
        toValue: currentPercentage,
        easing: Easing.linear,
        duration: 220
      }
    ).start()

    Animated.timing(
      this.state.remainingPercentage,
      {
        toValue: 100 - currentPercentage,
        easing: Easing.linear,
        duration: 220
      }
    ).start()
  }

  _onVideoError () {

  }

  _onVideoEnd () {

  }

  _onLayout (event) {
    let portraitMode = event.nativeEvent.layout.height > event.nativeEvent.layout.width
    if (portraitMode === this.state.portraitMode) return
    this.setState({
      portraitMode: portraitMode
    })
  }

  /**
   * RENDER FUNCTIONS
   */

  // TODO Make control component
  renderControlContainer () {
    return (
      <View style={styles.controlContainer}>
        {this.renderControlButton(this._onVideoPressed, this.state.paused ? Icons.PLAY : Icons.PAUSE)}
        {this.renderControlButton(this._onFullScreenPressed, this.state.fullScreen ? Icons.FULL_SCREEN_EXIT : Icons.FULL_SCREEN)}
        {this.renderControlButton(this._onVolumePressed, this.state.muted ? Icons.MUTE : Icons.VOLUME)}
      </View>
    )
  }

  renderControlButton (callback, icon) {
    return (
      <TouchableOpacity onPress={() => {
        if (callback !== null) callback()
      }}>
        <Image source={icon}
          style={styles.icon} />
      </TouchableOpacity>
    )
  }

  // TODO Make video component with control
  renderVideo () {
    return (
      <View style={this.state.fullScreen ? styles.videoFullScreen : styles.videoContainer}>
        <TouchableOpacity style={this.state.fullScreen ? styles.videoFullScreen : styles.video}
          onPress={() => { this._onVideoPressed() }}>
          <Video source={{ uri: this.props.course.url }}
            rate={this.state.rate}
            volume={this.state.volume}
            muted={this.state.muted}
            paused={this.state.paused}
            resizeMode={this.state.resizeMode}
            repeat={false}
            playInBackground={false}
            playWhenInactive={false}
            onLoadStart={this._onVideoLoadStart}
            onLoad={this._onVideoLoadEnd}
            onProgress={this._onVideoProgress}
            onEnd={this._onVideoEnd}
            onError={this._onVideoError}
            style={this.state.fullScreen ? styles.videoFullScreen : styles.video} />
        </TouchableOpacity>
        <ActivityIndicator
          animating={this.state.loadingVideo}
          size='large'
          color={Colors.BLUE}
          style={styles.activityIndicator} />
      </View>
    )
  }

  // TODO Animate to full screen
  renderFullScreen () {
    return (
      <View style={[ styles.videoFullScreen, { backgroundColor: Colors.BLACK } ]}>
        { this.renderVideo() }
        <View style={styles.fsLowerContainer}>
          <View style={styles.progress}>
            <Animated.View style={[ styles.innerProgressCompleted, { flex: this.state.currentPercentage } ]} />
            <Animated.View style={[ styles.innerProgressRemaining, { flex: this.state.remainingPercentage } ]} />
          </View>
          {this.renderControlContainer()}
        </View>
      </View>
    )
  }

  renderScreen () {
    return (
      <ScrollView style={styles.mainContainer}
        onLayout={(event) => this._onLayout(event)}>
        { this.state.fullScreen ? null : this.renderVideo() }
        <View style={styles.lowerBarContainer}>
          <View style={styles.progress}>
            <Animated.View style={[ styles.innerProgressCompleted, { flex: this.state.currentPercentage } ]} />
            <Animated.View style={[ styles.innerProgressRemaining, { flex: this.state.remainingPercentage } ]} />
          </View>
          { this.renderControlContainer() }
        </View>
        <View style={styles.container}>
          <Text style={styles.videoTitle}>
            { this.props.course.title }
          </Text>
          <Text style={styles.videoBody}>
            { this.props.course.description }
          </Text>
        </View>
      </ScrollView>
    )
  }

  render () {
    return this.state.fullScreen ? this.renderFullScreen() : this.renderScreen()
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#DDD'
  },
  container: {
    margin: 8,
    padding: 12,
    borderColor: '#0001',
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowRadius: 2,
    backgroundColor: '#FFF'
  },
  videoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    color: Colors.ORANGE
  },
  videoBody: {
    fontSize: 14,
    textAlign: 'left'
  },
  video: {
    flex: 1
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 3
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: Colors.VERY_DARK_BLUE
  },
  icon: {
    width: 30,
    height: 30
  },
  controlContainer: {
    flexDirection: 'row'
  },
  lowerBarContainer: {
    backgroundColor: '#0002',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    height: 40
  },
  videoContainer: {
    height: 220,
    backgroundColor: Colors.BLACK
  },
  videoFullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fsLowerContainer: {
    flexDirection: 'row',
    backgroundColor: '#aaad',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center'
  }
})
