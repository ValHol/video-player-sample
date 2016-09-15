/**
 * Sample React Native App
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry, Navigator, BackAndroid } from 'react-native'
import CategoriesScene from './main/scenes/CategoriesScene'
import CoursesScene from './main/scenes/CoursesScene'
import VideoScene from './main/scenes/VideoScene'

const categories = require('./main/mock/mock.json')
const urlArray = [
  'http://movietrailers.apple.com/movies/independent/snowden/snowden-tlr3_i320.m4v',
  'http://movietrailers.apple.com/movies/weinstein/gold/gold-trailer-1_i320.m4v'
]

class VideoPlayerSample extends Component {

  constructor (props) {
    super(props)
    this.routes = [
      {
        title: 'Categories',
        index: 0
      },
      {
        title: 'Courses',
        index: 1
      },
      {
        title: 'Video',
        index: 2
      }
    ]

    this.state = {
      currentScene: this.routes[0]
    }

    this.mainNavigator = {}

    BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.state.currentScene.index !== this.routes[0].index) {
          this.mainNavigator.pop()
          return true
        }
        return false
      }
    )
    BackAndroid.addEventListener.bind(this)
    this._renderScene = this._renderScene.bind(this)
    this.selectCourse = this.selectCourse.bind(this)
  }

  selectCourse(course) {
    course.url = urlArray[Math.floor(Math.random() * urlArray.length)]
    this.refs.navigator.push({
      title: course.title,
      index: 2,
      course: course
    })
  }

  _renderScene (route, navigator) {
    this.state.currentScene = route
    this.mainNavigator = navigator

    switch (route.index) {
      case 2:
        return (
          <VideoScene
            navigation={navigator}
            course={route.course} />
        )
      case 1:
        return (
          <CoursesScene
            category={categories[route.rowid]}
            selectCourse={this.selectCourse}/>
        )
      case 0:
      default:
        return (
          <CategoriesScene
            navigation={navigator}
            dataSource={categories} />
        )
    }
  }

  render () {
    return (
            <Navigator
              ref="navigator"
              initialRoute={this.routes[0]}
              renderScene={this._renderScene}
            />
        )
  }
}

AppRegistry.registerComponent('VideoPlayerSample', () => VideoPlayerSample)
